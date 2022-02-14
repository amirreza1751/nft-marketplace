import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument, UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection('ronia') private connection: Connection,
  ) {}

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
    let user = await this.userModel.findOne({ address: _address });
    if (!user) {
      user = await this.userModel.create({ address: _address });
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

  async createdTokens(_address: string) {
    return (
      await this.userModel.aggregate([
        { $match: { address: _address } },
        {
          $lookup: {
            from: 'tokens',
            let: { creatorId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$creator', '$$creatorId'] } } },
            ],
            as: 'createdTokens',
          },
        },
      ])
    )[0].createdTokens;
  }

  async ownedTokens(_address: string) {
    return (
      await this.userModel.aggregate([
        { $match: { address: _address } },
        {
          $lookup: {
            from: 'tokens',
            let: { ownerId: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$owner', '$$ownerId'] } } }],
            as: 'ownedTokens',
          },
        },
      ])
    )[0].ownedTokens;
  }

  async createdAuctions(_address: string) {
    return (
      await this.userModel.aggregate([
        { $match: { address: _address } },
        {
          $lookup: {
            from: 'auctions',
            let: { sellerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$seller', '$$sellerId'] } } },
            ],
            as: 'createdAuctions',
          },
        },
      ])
    )[0].createdAuctions;
  }

  async createdBuyNowItems(_address: string) {
    return (
      await this.userModel.aggregate([
        { $match: { address: _address } },
        {
          $lookup: {
            from: 'buynows',
            let: { sellerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$seller', '$$sellerId'] } } },
            ],
            as: 'createdBuyNowItems',
          },
        },
      ])
    )[0].createdBuyNowItems;
  }
}
