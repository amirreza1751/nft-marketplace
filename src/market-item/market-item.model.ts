import { Field, ID, InputType, ObjectType, } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
// import { UserShare } from "src/user-share/user-share.model";
import { User } from "src/user/user.model";

export type MarketItemDocument =  MarketItem & mongoose.Document
@Schema()
@ObjectType()
export class MarketItem{

    @Field(()=> ID)
    _id: number

    @Prop()
    @Field()
    itemId: string

    @Prop()
    @Field()
    tokenId: string

    @Prop()
    @Field()
    tokenUri: string

    @Prop()
    @Field()
    price: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Field(() => User)
    owner: User
    
    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserShare.name })
    // @Field(() => [UserShare])
    // creators: UserShare[]
}

export const MarketItemModel = SchemaFactory.createForClass(MarketItem)

@InputType()
export class FindMarketItemInput{
    @Field()
    _id: string
}