import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event } from '../event/event.model';
import { Kollection } from '../kollection/kollection.model';
import { UserShare } from '../user-share/user-share.model';
import { User } from '../user/user.model';

export type TokenDocument = Token & mongoose.Document;
@Schema()
@ObjectType()
export class Token {
  
  @Field(() => ID)
  _id: number;

  @Prop()
  @Field({ nullable: true })
  tokenId: number;

  @Prop()
  @Field({ nullable: true })
  tokenUri: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  creator: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Kollection.name })
  @Field(() => Kollection, { nullable: true })
  kollection: Kollection;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  @Field(() => [Event], { nullable: true })
  events: Event[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserShare.name })
  // @Field(() => [UserShare], { nullable: true })
  // royalties: UserShare[]
}

export const TokenModel = SchemaFactory.createForClass(Token);

@InputType()
export class FindTokenInput {
  @Field()
  _id: string;
}
