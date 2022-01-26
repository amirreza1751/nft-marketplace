import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.model';

@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>){}

    async findMany(options?) {
        return this.eventModel.find(options).lean();
    }

    async findById(id) {
        return this.eventModel.findById(id);
    }

    async createEvent(_event: Event){
        return this.eventModel.create(_event)
    }
}
