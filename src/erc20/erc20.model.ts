import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type Erc20Document = Erc20 & mongoose.Document
@Schema()
@ObjectType()
export class Erc20{

    @Field(()=> ID)
    _id: number

    @Prop()
    @Field()
    address: string

    @Prop()
    @Field()
    name: string

    @Prop()
    @Field()
    symbol: string
}
export const Erc20Model = SchemaFactory.createForClass(Erc20)