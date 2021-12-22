import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketItem, MarketItemDocument } from './market-item.model';
@Injectable()
export class MarketItemService {

    constructor(
        @InjectModel(MarketItem.name) private marketItemModel: Model<MarketItemDocument>
    ){}
    async findMany(){
            return this.marketItemModel.find().lean()
    }

    async findById(id){
        return this.marketItemModel.findById(id).lean()
    }

    async createMarketItem(marketItem: MarketItem){
        return this.marketItemModel.create(marketItem)
    }
}
