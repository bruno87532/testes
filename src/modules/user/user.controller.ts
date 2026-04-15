import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";

import { UserService } from "./user.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";

import { plainToInstance } from "class-transformer";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Body() data: CreateUserDto) {
        return plainToInstance(
            UserResponseDto,
            await this.userService.create(data),
            { excludeExtraneousValues: true }
        )
    }
}