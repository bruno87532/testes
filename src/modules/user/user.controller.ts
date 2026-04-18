import { Controller, Post, Body, UsePipes, Req, ValidationPipe, Delete, Res, UseGuards, Get, Patch } from "@nestjs/common";

import { UserService } from "./user.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { plainToInstance } from "class-transformer";
import { AuthGuard } from "@nestjs/passport";

import type { Response } from "express";
import type { RequestWithUser } from "src/common/types/request-with-user";

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

    @Delete()
    @UseGuards(AuthGuard("jwt"))
    async delete(@Res({ passthrough: true }) res: Response, @Req() req: RequestWithUser) {
        return plainToInstance(
            UserResponseDto,
            await this.userService.delete(res, req.user.id),
            { excludeExtraneousValues: true }
        )
    }

    @Get("/me")
    @UseGuards(AuthGuard("jwt"))
    async find(@Req() req: RequestWithUser) {
        return plainToInstance(
            UserResponseDto,
            await this.userService.find(req.user.id),
            { excludeExtraneousValues: true }
        )
    }

    @Patch()
    @UseGuards(AuthGuard("jwt"))
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(@Req() req: RequestWithUser, @Body() data: UpdateUserDto) {
        return plainToInstance(
            UserResponseDto,
            await this.userService.update(data, req.user.id),
            { excludeExtraneousValues: true }
        )
    }
}