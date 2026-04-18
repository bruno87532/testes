import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../auth.service";

import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(private readonly authV1Service: AuthService) {
        super({ usernameField: "email" })
    }

    async validate(email: string, password: string) {
        const user = await this.authV1Service.validateUser(email, password)
        if (!user) throw new UnauthorizedException("email or password are invalid")
        return user
    }
}