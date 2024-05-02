import {UserDocument} from "@app/common";
import {Types} from "mongoose";


export class UserResponseDto {
    _id: Types.ObjectId;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserDocument) {
        this._id = user._id;
        this.email = user.email;
        this.name = user.name;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}