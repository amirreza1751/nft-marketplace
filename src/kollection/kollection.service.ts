import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kollection, KollectionDocument } from './kollection.model';

@Injectable()
export class KollectionService {
    constructor(@InjectModel(Kollection.name) private kollectionModel: Model<KollectionDocument>){}

    async findMany() {
        return this.kollectionModel.find().lean();
    }

    async findById(id) {
        return this.kollectionModel.findById(id);
    }

    async findByContract(_contract: string){
        return this.kollectionModel.findOne({contract: _contract})
    }

    async findOrCreateByContract(_contract) {
        let kollection = await this.kollectionModel.findOne({contract: _contract});
        if(!kollection){
            kollection =  await this.kollectionModel.create({contract: _contract});
        }
        return kollection;
      }

      async creatKollection(_kollection: Kollection){
            return this.kollectionModel.create(_kollection)
      }
}
