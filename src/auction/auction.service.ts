import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
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
var Web3 = require('web3');

@Injectable()
export class AuctionService implements OnApplicationBootstrap{
  private web3;
  private marketContract;

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly erc20Service: Erc20Service,
    private readonly kollectionService: KollectionService
  ) {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.NETWORK_WEBSOCKET_URL));
  }
  onApplicationBootstrap(){
    console.log("auction module created!")
    this.listenOnAuctionCreated()
    // this.listenOnAuctionBidded()
    // this.listenOnAuctionDurationExtended()
    // this.listenOnAuctionUpdated()
    // this.listenOnAuctionEnded()
  }
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

  async listenOnAuctionCreated() {
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening on auctions started...');
    this.marketContract.once('AuctionCreated', {}, async (error, auctionCreatedEvent)=>{
      console.log(auctionCreatedEvent.returnValues)
        console.log('Auction created: ' + auctionCreatedEvent.returnValues.auctionId);
        let seller = await this.userService.findOrCreateByAddress(auctionCreatedEvent.returnValues.seller);
        let kollection = await this.kollectionService.findOrCreateByContract(process.env.RONIA_NFT)
        let kollectionTokens = (await kollection.populate('tokens', 'tokenId')).tokens
      let token = kollectionTokens.find(item => {
        return item.tokenId == auctionCreatedEvent.returnValues.tokenId
      })
      if(token){
        token.owner = seller
      } else{
        let createdToken: Token = new Token();
        createdToken.tokenId = auctionCreatedEvent.returnValues.tokenId;
        createdToken.owner = seller;
        createdToken.kollection = kollection;
        // createdToken.tokenUri = _tokenUri; get token URI from contract
        let res = await this.tokenService.createToken(createdToken)
        kollection.tokens.push(res)
        token = res;
      }
        await kollection.save()
        let auctionCurrency = await this.erc20Service.findOrCreateByAddress(auctionCreatedEvent.returnValues.auctionCurrency);
        let auction = await this.findOrCreateByAuctionId(auctionCreatedEvent.returnValues.auctionId);
        auction.seller = seller;
        auction.token = token;
        auction.auctionCurrency = auctionCurrency;

        auction.startTime = auctionCreatedEvent.returnValues.startTime;
        auction.endTime = auctionCreatedEvent.returnValues.endTime;
        auction.reservePrice = auctionCreatedEvent.returnValues.reservePrice;
        auction.ended = false;
        await auction.save();
        console.log(auction);
        console.log(auction.auctionCurrency.address);
      },
    );
  }

  async listenOnAuctionBidded(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening on auctions bidded...');
    this.marketContract.once('AuctionBidded', {}, async (error, auctionBiddedEvent)=>{
        let sender = await this.userService.findOrCreateByAddress(auctionBiddedEvent.returnValues.sender);
        let auction = await this.findOrCreateByAuctionId(auctionBiddedEvent.returnValues.auctionId);
        auction.bidder = sender;
        auction.bid = auctionBiddedEvent.returnValues.amount;
        auction.save();
      }
    );
  }

  async listenOnAuctionDurationExtended(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening on auctions duration extended...');
    this.marketContract.once('AuctionDurationExtended', {}, async (error, auctionDurationExtendedEvent)=>{
        let auction = await this.findOrCreateByAuctionId(auctionDurationExtendedEvent.returnValues.auctionId);
        auction.endTime = auctionDurationExtendedEvent.returnValues.newEndTime;
        auction.save();
      }
    );
  }

  async listenOnAuctionUpdated(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening on auctions updated...');
    this.marketContract.once('AuctionUpdated', {}, async (error, auctionUpdatedEvent)=>{
        let auction = await this.findOrCreateByAuctionId(auctionUpdatedEvent.returnValues.auctionId);
        auction.reservePrice = auctionUpdatedEvent.returnValues.reservePrice;
        auction.save();
      }
    );
  }

  async listenOnAuctionEnded(){
    this.marketContract = new this.web3.eth.Contract(
      NFTMarket.abi,
      process.env.RONIA_MARKET,
    );

    console.log('listening on auctions ended...');
    this.marketContract.once('AuctionEnded', {}, async (error, auctionEndedEvent)=>{
        let auction = await this.findOrCreateByAuctionId(auctionEndedEvent.returnValues.auctionId);
        auction.ended = true;
        auction.save();
      }
    );
  }


}
