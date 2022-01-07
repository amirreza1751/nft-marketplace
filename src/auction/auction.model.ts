import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Erc20 } from '../erc20/erc20.model';
import { Token } from '../token/token.model';
import { User } from '../user/user.model';

export type AuctionDocument = Auction & mongoose.Document;
@Schema()
@ObjectType()
export class Auction {
  @Field(() => ID)
  _id: number;

  @Prop()
  @Field({ nullable: true })
  auctionId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  seller: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Token.name })
  @Field(() => Token, { nullable: true })
  token: Token;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  bidder: User;

  @Prop()
  @Field({ nullable: true })
  bid: number;

  @Prop()
  @Field({ nullable: true })
  startTime: number;

  @Prop()
  @Field({ nullable: true })
  endTime: number;

  @Prop()
  @Field({ nullable: true })
  reservePrice: number;

  @Prop()
  @Field({ nullable: true })
  ended: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Erc20.name })
  @Field(() => Erc20, { nullable: true })
  auctionCurrency: Erc20;
}

export const AuctionModel = SchemaFactory.createForClass(Auction);

@InputType()
export class FindAuctionInput {
  @Field()
  _id: string;
}
