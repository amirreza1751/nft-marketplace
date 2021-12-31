import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { MarketItem, MarketItemDocument } from './market-item.model';
@Injectable()
export class MarketItemService {

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

}
