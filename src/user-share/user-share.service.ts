import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserShare, UserShareDocument } from './user-share.model';

@Injectable()
export class UserShareService {
  constructor(
    @InjectModel(UserShare.name)
    private userShareModel: Model<UserShareDocument>,
  ) {}

  async findById(id) {
    return this.userShareModel.findById(id).lean();
  }
}
