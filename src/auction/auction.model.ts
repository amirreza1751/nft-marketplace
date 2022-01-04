import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Erc20 } from "../erc20/erc20.model";
import { MarketItem } from "../market-item/market-item.model";
import { User } from "../user/user.model";

export type AuctionDocument = Auction & mongoose.Document
@Schema()
@ObjectType()
export class Auction{
    @Field(()=> ID)
    _id: number

    @Prop()
    @Field()
    auctionId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User)
    seller: User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MarketItem.name })
    @Field(() => MarketItem)
    marketItem: MarketItem

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User)
    bidder: User

    @Prop()
    @Field()
    bid: number

    @Prop()
    @Field()
    startTime: number

    @Prop()
    @Field()
    endTime: number

    @Prop()
    @Field()
    reservePrice: number

    @Prop()
    @Field()
    ended: boolean

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Erc20.name })
    @Field(()=> Erc20)
    auctionCurrency: Erc20
}

export const AuctionModel = SchemaFactory.createForClass(Auction)

@InputType()
export class FindAuctionInput{
    @Field()
    _id: string
}