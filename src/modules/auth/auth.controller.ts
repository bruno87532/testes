import { Controller, Post, Get, HttpCode, UseGuards, HttpStatus, Res, Request } from "@nestjs/common";

import type { Response } from "express";

import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard("local"))
    async login(@Request() req: Request & { user: { id: string } }, @Res({ passthrough: true }) res: Response) {
        return await this.authService.login(req, res)
    }

    @Get("/logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        return await this.authService.logout(res)
    }
}