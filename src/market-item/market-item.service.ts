import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { MarketItem, MarketItemDocument } from './market-item.model';
import * as NFT from '../contracts/NFT.json'

@Injectable()
export class MarketItemService implements OnModuleInit {
    private provider: ethers.providers.WebSocketProvider
    private marketContract: ethers.Contract

    constructor(
        @InjectModel(MarketItem.name) private marketItemModel: Model<MarketItemDocument>,
        private userService: UserService
    ){}
    async findMany(){
            return this.marketItemModel.find().lean()
    }

    async findById(id){
        return this.marketItemModel.findById(id).lean()
    }

    async createMarketItem(marketItem: MarketItem){
        let item = await this.marketItemModel.create(marketItem)
        let owner = await this.userService.findById(item.owner)
        if(owner){
            if(owner.marketItems){
                owner.marketItems.push(item)
            } else{
                owner.marketItems = [{...item}]
            }
            await this.userService.updateUser(item.owner._id, owner)
            return item
        }
    }

    async findByOwnerId(ownerId){
        return this.marketItemModel.findOne({owner: ownerId})
    }

    async onModuleInit(){
        this.provider = new ethers.providers.WebSocketProvider("http://127.0.0.1:8545")
        this.marketContract = new ethers.Contract(process.env.RONIA_NFT, NFT.abi, this.provider)

        console.log("listening on transfers started...")
            this.marketContract.on("Transfer", async (from, to, tokenId) => {
                console.log("transfer created: " + tokenId.toNumber())
                console.log("from: " + from) 
                console.log("to: " + to)
            });
    }
}
