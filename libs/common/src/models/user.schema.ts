import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import {AbstractDocument} from "@app/common";
import {IsDate, IsOptional} from "class-validator";


@Schema({versionKey: false, timestamps: true})
export class UserDocument extends AbstractDocument {
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    name: string;

    @IsOptional()
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
