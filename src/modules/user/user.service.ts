import { BadRequestException, Injectable, Res, Logger, NotFoundException, Inject, forwardRef, InternalServerErrorException } from "@nestjs/common";

import { AuthService } from "../auth/auth.service";
import { PrismaService } from "src/common/db/prisma/prisma.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { makeHash } from "src/common/functions/make-hash";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { Response } from "express";

@Injectable()
export class UserService {
    private readonly logger = new Logger()
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) { }

    async create(data: CreateUserDto) {
        try {
            const { password } = data
            const hashedPassword = makeHash(password)

            const user = await this.prismaService.user.create({
                data: {
                    ...data,
                    password: hashedPassword
                }
            })

            return { user }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
                throw new BadRequestException("Email already registered")
            }
            this.logger.error("Error ocurred while creating user", error)
            throw new InternalServerErrorException("Error ocurred while creating user")
        }
    }

    async delete(@Res({ passthrough: true }) res: Response, id: string) {
        try {
            const user = await this.prismaService.user.delete({
                where: { id }
            })

            this.authService.logout(res)

            return { user }
        } catch (error) {
            this.logger.error("Error ocurred while deleting user", error)
            throw new InternalServerErrorException("Error ocurred while deleting user")
        }
    }

    async find(id: string) {
        try {
            const user = await this.prismaService.user.findUniqueOrThrow({
                where: { id }
            })

            return { user }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) throw new NotFoundException("User not found")
            this.logger.error("Error ocurred while finding user", error)
            throw new InternalServerErrorException("Error ocurred while finding user")
        }
    }

    async update(data: UpdateUserDto, id: string) {
        try {
            const { password, ...newData } = data

            const user = await this.prismaService.user.update({
                where: { id },
                data: {
                    ...newData,
                    ...(password ? { password: makeHash(password) } : {})
                }
            })

            return { user }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") throw new BadRequestException("Email alread registered")
                throw new NotFoundException("User not found")
            }
            this.logger.error("Error ocurred while updating user", error)
            throw new InternalServerErrorException("Error ocurred while updating user")
        }
    }


    async findByEmail(email: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { email }
            })

            return { user }
        } catch (error) {
            this.logger.error("error ocurred while fetching user", error)
            throw new NotFoundException("Error ocurred while fetching user")
        }
    }
}