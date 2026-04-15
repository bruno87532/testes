import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";

import { PrismaService } from "src/common/db/prisma/prisma.service";

import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    private readonly logger = new Logger()
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: CreateUserDto) {
        try {
            const user = await this.prismaService.user.create({ data })

            return { user }
        } catch (error) {
            this.logger.error("Error ocurred while creating user", error)
        }
    }

    async delete() {
        try {

        } catch (error) {
            this.logger.error("Error ocurred while deleting user", error)
        }
    }

    async update() {
        try {

        } catch (error) {
            this.logger.error("Error ocurred while updating user", error)
        }
    }
}