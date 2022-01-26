import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Token } from '../token/token.model';

export type EventDocument = Event & mongoose.Document;

@Schema()
@ObjectType()
export class Event{
    @Field(() => ID)
    _id: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User, { nullable: true })
    from: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User, { nullable: true })
    to: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
    @Field(() => Token, { nullable: true })
    token: Token;

    @Prop()
    @Field({ nullable: true })
    price: number;
}
export const EventModel = SchemaFactory.createForClass(Event);

@InputType()
export class FindEventInput {
  @Field()
  _id: string;
}