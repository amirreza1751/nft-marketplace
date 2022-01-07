import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { Auction, AuctionDocument, AuctionModel } from './auction.model';
import * as NFTMarket from '../contracts/NFTMarket.json';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Erc20Service } from '../erc20/erc20.service';
import { KollectionService } from '../kollection/kollection.service';
import { Token } from '../token/token.model';

@Injectable()
export class AuctionService {
  private provider: ethers.providers.WebSocketProvider;
  private marketContract: ethers.Contract;
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly erc20Service: Erc20Service,
    private readonly kollectionService: KollectionService
  ) {}

  async findMany() {
    return this.auctionModel.find().lean();
  }

  async findById(id) {
    return this.auctionModel.findById(id).lean();
  }

  async findByAuctionId(auctionId: number) {
    let options = {
      auctionId: auctionId,
    };
    return this.auctionModel.findOne(options);
  }

  async findByToken(tokenId: number, contract: string) {
    return await this.auctionModel.findOne().populate('token');
  }

  async createAuction(auction: Auction) {
    return this.auctionModel.create(auction);
  }

  async findOrCreateByAuctionId(_auctionId: number) {
    let res = await this.auctionModel.findOne({auctionId: _auctionId})
    if(!res){
      res = await this.auctionModel.create({auctionId: _auctionId})
    }
    return res
  }

  async listen() {
    this.provider = new ethers.providers.WebSocketProvider(
      'http://127.0.0.1:8545',
    );
    this.marketContract = new ethers.Contract(
      process.env.RONIA_MARKET,
      NFTMarket.abi,
      this.provider,
    );

    console.log('listening on auctions started...');
    this.marketContract.on(
      'AuctionCreated',
      async (
        _auctionId,
        _tokenId,
        _tokenContract,
        _startTime,
        _endTime,
        _reservePrice,
        _seller,
        _auctionCurrency,
      ) => {
        console.log('Auction created: ' + _tokenId.toNumber());
        let seller = await this.userService.findOrCreateByAddress(_seller);
        let kollection = await this.kollectionService.findOrCreateByContract(process.env.RONIA_NFT)
        let kollectionTokens = (await kollection.populate('tokens', 'tokenId')).tokens
      let token = kollectionTokens.find(item => {
        return item.tokenId == _tokenId.toNumber()
      })
      if(token){
        token.owner = seller
      } else{
        let createdToken: Token = new Token();
        createdToken.tokenId = _tokenId.toNumber();
        createdToken.owner = seller;
        createdToken.kollection = kollection;
        // createdToken.tokenUri = _tokenUri; get token URI from contract
        let res = await this.tokenService.createToken(createdToken)
        kollection.tokens.push(res)
        token = res;
      }
        await kollection.save()
        let auctionCurrency = await this.erc20Service.findOrCreateByAddress(_auctionCurrency);
        let auction = await this.findOrCreateByAuctionId(_auctionId.toNumber());
        auction.seller = seller;
        auction.token = token;
        auction.auctionCurrency = auctionCurrency;

        auction.startTime = _startTime;
        auction.endTime = _endTime;
        auction.reservePrice = _reservePrice;
        auction.ended = false;
        await auction.save();
        console.log(auction);
        console.log(auction.auctionCurrency.address);
      },
    );
  }
}
