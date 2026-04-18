import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsString, Matches } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email?: string

    @IsOptional()
    @MinLength(8)
    @IsString()
    @Matches(/(?=.*[a-z])/, { message: "Password must have at lest 1 lowercase character" })
    @Matches(/(?=.*[A-Z])/, { message: "Password must have at lest 1 uppercase character" })
    @Matches(/(?=.*\W)/, { message: "Password must have at lest 1 special character" })
    @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
    password?: string
}