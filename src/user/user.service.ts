import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserModel } from './user.model';



@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){
    }
    
    async findById(id){
        return this.userModel.findById(id).lean()
    }

    async findMany(){
        return this.userModel.find().lean()
    }
    
    async findByAddress(_address: string){
        return this.userModel.findOne({address: _address})
    }

    async findByAddressOrCreate(_address: string){
         let res = await this.userModel.findOneAndUpdate({address: _address}, {}, {upsert: true})
         return this.findByAddress(_address)
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
