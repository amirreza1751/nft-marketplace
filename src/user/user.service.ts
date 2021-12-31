import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarketItem } from 'src/market-item/market-item.model';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
    
    async findById(id){
        return this.userModel.findById(id).lean()
    }

    async findMany(){
        return this.userModel.find().lean()
    }

    async createUser(user: User){
        return this.userModel.create(user)
    }

    async updateUser(id, updatedUser: User){
        const res = await this.userModel.findByIdAndUpdate(id, 
            {
                $set: {
                    // address: "test",
                    marketItems: updatedUser.marketItems
                }
            }
            , {new: true, useFindAndModify: false})
        return res
    }
}
