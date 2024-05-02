import {IsDate, IsDefined, IsEmail, IsOptional, IsString, IsStrongPassword} from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsDefined()
    _id: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    updatedAt: Date;
}