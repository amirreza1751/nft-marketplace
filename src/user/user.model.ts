import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { MarketItem } from "src/market-item/market-item.model";

export type UserDocument = User & mongoose.Document
@Schema()
@ObjectType()
export class User{
    
    @Field(()=> ID)
    _id: number

    @Prop({required: true})
    @Field()
    address: string

    @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketItem' } })
    @Field(() => [MarketItem])
    marketItems: MarketItem[]
}

export const UserModel = SchemaFactory.createForClass(User)