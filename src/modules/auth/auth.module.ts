import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { UserModule } from "../user/user.module";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET_KEY") ?? "",
                signOptions: { expiresIn: "7d" }
            })
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
    exports: [AuthService]
})
export class AuthModule { }