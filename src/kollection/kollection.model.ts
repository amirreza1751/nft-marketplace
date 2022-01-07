import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Token } from '../token/token.model';

export type KollectionDocument = Kollection & mongoose.Document;

@Schema()
@ObjectType()
export class Kollection {
  @Field(() => ID)
  _id: number;

  @Prop()
  @Field({ nullable: true })
  contract: string;

  @Prop()
  @Field({ nullable: true })
  name: string;

  @Prop()
  @Field({ nullable: true })
  icon: string;

  @Prop()
  @Field({ nullable: true })
  type: string;

  @Prop()
  @Field({ nullable: true })
  logo: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }] })
  @Field(() => [Token], { nullable: true })
  tokens: Token[];
}

export const KollectionModel = SchemaFactory.createForClass(Kollection);

@InputType()
export class FindKollectionInput {
  @Field()
  _id: string;
}
