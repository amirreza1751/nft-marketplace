import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../user/user.model";
import * as mongoose from "mongoose";

export type UserShareDocument = UserShare & mongoose.Document
@Schema()
@ObjectType()
export class UserShare{
    
    @Field(()=> ID)
    _id: number

    @Field(()=> User)
    account: User

    @Field()
    value: number
}
export const UserShareModel = SchemaFactory.createForClass(UserShare)