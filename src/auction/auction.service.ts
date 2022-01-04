import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { Auction, AuctionDocument, AuctionModel } from './auction.model';
import * as NFTMarket from '../contracts/NFTMarket.json'
import { UserService } from '../user/user.service';
import { MarketItemService } from '../market-item/market-item.service';
import { Erc20Service } from '../erc20/erc20.service';

@Injectable()
export class AuctionService{
    private provider: ethers.providers.WebSocketProvider
    private marketContract: ethers.Contract
    constructor(
        @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
        private readonly userService: UserService,
        private readonly marketItemService: MarketItemService,
        private readonly erc20Service: Erc20Service
    ){}
    
    async findMany(){
        return this.auctionModel.find().lean()
    }
    
    async findById(id){
        return this.auctionModel.findById(id).lean()
    }

    async findByAuctionId(auctionId: number){
        let options = {
            auctionId: auctionId
        }
        return this.auctionModel.findOne(options)
    }

    async createAuction(auction: Auction){
        return this.auctionModel.create(auction)
    }

    async findOrCreateByAuctionId(_auctionId: number){
        await this.auctionModel.findOneAndUpdate(
                {auctionId: _auctionId},
                {},
                {upsert : true, strict : false}
            )
        return await this.findByAuctionId(_auctionId)
    }

    async listen(){
        this.provider = new ethers.providers.WebSocketProvider("http://127.0.0.1:8545")
        this.marketContract = new ethers.Contract(process.env.RONIA_MARKET, NFTMarket.abi, this.provider)

        console.log("listening on auctions started...")
            this.marketContract.on("AuctionCreated", async (_auctionId, _tokenId, _tokenContract, _startTime, _endTime, _reservePrice, _seller, _auctionCurrency) => {
                console.log("Auction created: " + _tokenId.toNumber()) 
                let seller = await this.userService.findByAddressOrCreate(_seller)
                let marketItem = await this.marketItemService.findOrCreateByTokenIdAndContract(_tokenId.toNumber(), _tokenContract)
                let auctionCurrency = await this.erc20Service.findOrCreateByAddress(_auctionCurrency)
                let auction = await this.findOrCreateByAuctionId(_auctionId.toNumber())
                auction.seller = seller
                auction.marketItem = marketItem
                auction.startTime = _startTime
                auction.endTime = _endTime
                auction.reservePrice = _reservePrice
                auction.ended = false
                auction.auctionCurrency = auctionCurrency
                await auction.save()
                console.log(auction)
                console.log(auction.auctionCurrency.address)
            });
    }
}
