import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Erc20, Erc20Document } from './erc20.model';

@Injectable()
export class Erc20Service {
  constructor(
    @InjectModel(Erc20.name) private erc20Model: Model<Erc20Document>,
  ) {}

  async findById(id) {
    return this.erc20Model.findById(id).lean();
  }

  async findByAddress(_address: string) {
    return this.erc20Model.findOne({ address: _address });
  }

  async findOrCreateByAddress(_address: string) {
    let res = await this.erc20Model.findOne({address: _address})
    if(!res){
      res = await this.erc20Model.create({address: _address})
    }
    return res
  }
}
