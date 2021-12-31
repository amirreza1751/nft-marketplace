import { Field, ID, InputType, ObjectType, } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "src/user/user.model";

export type MarketItemDocument =  MarketItem & mongoose.Document
@Schema()
@ObjectType()
export class MarketItem{

    @Field(()=> ID)
    _id: number

    @Prop({required: true})
    @Field()
    itemId: string

    @Prop({required: true})
    @Field()
    tokenId: string

    @Prop({required: true})
    @Field()
    tokenUri: string

    @Prop({required: true})
    @Field()
    price: string

    @Field(() => User)
    owner: User
    
}

export const MarketItemModel = SchemaFactory.createForClass(MarketItem)

@InputType()
export class FindMarketItemInput{
    @Field()
    _id: string
}