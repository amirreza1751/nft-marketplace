import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id) {
    return this.userModel.findById(id).lean();
  }

  async findMany() {
    return this.userModel.find().lean();
  }

  async findByAddress(_address: string) {
    return this.userModel.findOne({ address: _address });
  }

  async findOrCreateByAddress(_address: string) {
    let user = await this.userModel.findOne({address: _address});
        if(!user){
          user =  await this.userModel.create({address: _address});
        }
        return user;
  }

  async createUser(user: User) {
    return this.userModel.create(user);
  }

  async updateUser(id, updatedUser: User) {
    const res = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          // address: "test",
          tokens: updatedUser.tokens,
        },
      },
      { new: true, useFindAndModify: false },
    );
    return res;
  }
}
