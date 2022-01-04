import { Field, ID, InputType, Int, ObjectType, } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { UserShare } from "../user-share/user-share.model";
import { User } from "../user/user.model";

export type MarketItemDocument =  MarketItem & mongoose.Document
@Schema()
@ObjectType()
export class MarketItem{

    @Field(()=> ID)
    _id: number

    @Prop()
    @Field()
    itemId: number
    
    @Prop()
    @Field()
    tokenId: number

    @Prop()
    @Field()
    contract: string

    @Prop()
    @Field()
    tokenUri: string

    @Prop()
    @Field()
    price: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User)
    owner: User
    
    @Prop()
    @Field()
    type: string

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserShare.name })
    // @Field(() => [UserShare])
    // royalties: UserShare[]
}

export const MarketItemModel = SchemaFactory.createForClass(MarketItem)

@InputType()
export class FindMarketItemInput{
    @Field()
    _id: string
}