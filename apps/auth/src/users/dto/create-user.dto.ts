import {IsDate, IsEmail, IsOptional, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    _id: string;

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    updatedAt: Date;
}