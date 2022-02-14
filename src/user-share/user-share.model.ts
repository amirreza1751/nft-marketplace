import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.model';
import * as mongoose from 'mongoose';

export type UserShareDocument = UserShare & mongoose.Document;
@Schema()
@ObjectType()
export class UserShare {
  @Field(() => ID)
  _id: number;

  @Prop()
  @Field(() => User, { nullable: true })
  account: User;

  @Prop()
  @Field({ nullable: true })
  value: number;
}
export const UserShareModel = SchemaFactory.createForClass(UserShare);
