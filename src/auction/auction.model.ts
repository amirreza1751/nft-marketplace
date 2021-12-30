import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type AuctionDocument = Auction & mongoose.Document
@Schema()
@ObjectType()
export class Auction{
    @Field(()=> ID)
    _id: number

    @Prop({required: true})
    @Field()
    auctionId: string

    @Prop({required: true})
    @Field()
    seller: string

    @Prop({required: true})
    @Field()
    tokenId: string

    @Prop({required: true})
    @Field()
    tokenContract: string

    @Prop()
    @Field()
    bidder: string

    @Prop()
    @Field()
    bid: string

    @Prop({required: true})
    @Field()
    startTime: string

    @Prop({required: true})
    @Field()
    endTime: string

    @Prop({required: true})
    @Field()
    reservePrice: string

    @Prop({required: true})
    @Field()
    auctionCurrency: string
}

export const AuctionModel = SchemaFactory.createForClass(Auction)