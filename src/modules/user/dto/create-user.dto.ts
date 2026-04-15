import { IsEmail, IsNotEmpty, IsDefined, MinLength, IsString, Matches } from "class-validator";

export class CreateUserDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name!: string

    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @MinLength(8)
    @IsString()
    @Matches(/(?=.*[a-z])/, { message: "Password must have at lest 1 lowercase character" })
    @Matches(/(?=.*[A-Z])/, { message: "Password must have at lest 1 uppercase character" })
    @Matches(/(?=.*\W)/, { message: "Password must have at lest 1 special character" })
    @Matches(/(?=(.*\d){5,})/, { message: "Password must have at least 5 numeric characters" })
    password!: string
}