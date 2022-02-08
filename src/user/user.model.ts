import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Token } from '../token/token.model';

export type UserDocument = User & mongoose.Document;
@Schema()
@ObjectType()
export class User {
  
  @Field(() => ID)
  _id: number;

  @Prop()
  @Field({ nullable: true })
  address: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }] })
  @Field(() => [Token], { nullable: true })
  tokens: Token[];

}

export const UserModel = SchemaFactory.createForClass(User);

@InputType()
export class FindUserInput {
  @Field()
  _id: string;
}

@InputType()
export class FindUserByAddressInput {
  @Field()
  address: string;
}