import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Erc20 } from '../erc20/erc20.model';
import { Token } from '../token/token.model';
import { User } from '../user/user.model';


export type BuyNowDocument = BuyNow & mongoose.Document;
@Schema()
@ObjectType()
export class BuyNow {
  @Field(() => ID)
  _id: number;

  @Prop()
  @Field({ nullable: true })
  itemId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  seller: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Token.name })
  @Field(() => Token, { nullable: true })
  token: Token;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  winner: User;

  @Prop()
  @Field({ nullable: true })
  purchasedAt: number;

  @Prop()
  @Field({ nullable: true })
  reservePrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Erc20.name })
  @Field(() => Erc20, { nullable: true })
  currency: Erc20;
}

export const BuyNowModel = SchemaFactory.createForClass(BuyNow);

@InputType()
export class FindBuyNowInput {
  @Field()
  _id: string;
}
