import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type UserDocument = User & mongoose.Document
@Schema()
@ObjectType()
export class User{
    
    @Field(()=> ID)
    _id: number

    @Prop({required: true})
    @Field()
    address: string
}

export const UserModel = SchemaFactory.createForClass(User)