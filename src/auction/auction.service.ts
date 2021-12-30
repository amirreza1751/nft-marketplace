import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { Auction, AuctionDocument, AuctionModel } from './auction.model';
import * as NFT from '../contracts/NFT.json'
import * as NFTMarket from '../contracts/NFTMarket.json'

@Injectable()
export class AuctionService implements OnModuleInit{
    private provider: ethers.providers.WebSocketProvider
    private marketContract: ethers.Contract
    constructor(@InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>){}
    
    async findMany(){
        return this.auctionModel.find().lean()
    }

    async findByAuctionId(auctionId: string){
        let options = {
            auctionId: auctionId
        }
        return this.auctionModel.findOne(options)
    }

    async createAuction(auction: Auction){
        return this.auctionModel.create(auction)
    }
    async onModuleInit(){
        this.provider = new ethers.providers.WebSocketProvider(process.env.RINKEBY_WEBSOCKET_URL)
        this.marketContract = new ethers.Contract(process.env.RINKEBY_NFTMARKET_ADDRESS, NFTMarket.abi, this.provider)

        console.log("listening started...")
            // this.marketContract.on("AuctionCreated", async (auctionId, tokenId, tokenContract, startTime, endTime, reservePrice, seller, auctionCurrency) => {
            //     console.log("Auction created: " + tokenId.toNumber()) 
            let auctionId: string = 'tesssssssst'               
                let res = await this.findByAuctionId(auctionId)
                
                if(res){
                    console.log("auction exists.")
                    res.tokenId = "tokenId"
                    res.tokenContract = "tokenContract"
                    res.startTime = "startTime"
                    res.endTime = "endTime"
                    res.reservePrice = "reservePrice"
                    res.seller = "seller"
                    res.auctionCurrency = "auctionCurrency"
                    res.save()
                    console.log(res)
                } else {
                    console.log("auction is new.")
                    let newAuction = new Auction()
                    newAuction.auctionId = auctionId
                    newAuction.tokenId = "tokenId"
                    newAuction.tokenContract = "tokenContract"
                    newAuction.startTime = "startTime"
                    newAuction.endTime = "endTime"
                    newAuction.reservePrice = "reservePrice"
                    newAuction.seller = "seller"
                    newAuction.auctionCurrency = "auctionCurrency"
                    await this.createAuction(newAuction)
                    console.log(newAuction)
                }
            // });
    }
}
