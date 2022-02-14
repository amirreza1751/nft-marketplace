import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Event, EventDocument } from './event.model';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectConnection('ronia') private connection: Connection,
  ) {}

  async findMany(options?) {
    return this.eventModel.find(options).lean();
  }

  async findById(id) {
    return this.eventModel.findById(id);
  }

  async createEvent(_event: Event) {
    return this.eventModel.create(_event);
  }
  async findOrCreateByTxHash(_txHash: string) {
    let res = await this.eventModel.findOne({ txHash: _txHash });
    if (!res) {
      res = await this.eventModel.create({ txHash: _txHash });
    }
    return res;
  }
}
