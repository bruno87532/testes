import { Injectable, Request, Res } from "@nestjs/common";

import type { Response } from "express";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) { }

    async validateUser(email: string, password: string) {
        const { user } = await this.userService.findByEmail(email)
        if (user && await bcrypt.compare(password, user.password)) {
            const { id, ...result } = user
            return { id }
        }

        return null
    }

    async login(@Request() req: Request & { user: { id: string } }, @Res({ passthrough: true }) res: Response) {
        const nodeEnv = this.configService.get<string>("NODE_ENV")
        const token = this.jwtService.sign(req.user)
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: nodeEnv === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return { success: true }
    }

    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })

        return { success: true }
    }
}