import { ForbiddenException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";

import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

import { PrismaService } from "src/common/db/prisma/prisma.service";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@Injectable()
export class TaskService {
    private readonly logger = new Logger()
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: CreateTaskDto, idUser: string) {
        try {
            const { quantity } = await this.count(idUser)
            if (quantity >= 10) throw new ForbiddenException("maximum number of tasks already created")

            const task = await this.prismaService.task.create({
                data: {
                    ...data,
                    idUser
                }
            })

            return { task }
        } catch (error) {
            if (error instanceof HttpException) throw error
            this.logger.error("Error ocurred while creating task", error)
            throw new InternalServerErrorException("Error ocurred while creating task")
        }
    }

    private async count(idUser: string) {
        try {
            const quantity = await this.prismaService.task.count({ where: { idUser } })

            return { quantity }
        } catch (error) {
            this.logger.error("Error ocurred while counting taks", error)
            throw new InternalServerErrorException("Error ocurred while counting taks")
        }
    }

    async update(data: UpdateTaskDto, id: string, idUser: string) {
        try {
            const task = await this.prismaService.task.update({
                where: { id, idUser },
                data
            })

            return { task }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) throw new NotFoundException("Task not found")
            this.logger.error("Error ocurred while updating task", error)
            throw new InternalServerErrorException("Error ocurred while updating task")
        }
    }

    async delete(id: string, idUser: string) {
        try {
            const task = await this.prismaService.task.delete({
                where: { id, idUser }
            })

            return { task }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") throw new NotFoundException("Task not found")
            this.logger.error("Error ocurred while deleting task", error)
            throw new InternalServerErrorException("Error ocurred while deleting task")
        }
    }

    async findMany(idUser: string) {
        try {
            const tasks = await this.prismaService.task.findMany({
                where: { idUser }
            })

            return { tasks }
        } catch (error) {
            this.logger.error("Error ocurred while finding many tasks", error)
            throw new InternalServerErrorException("Error ocurred while finding many tasks")
        }
    }

    async find(id: string, idUser: string) {
        try {
            const task = await this.prismaService.task.findUniqueOrThrow({
                where: { id, idUser }
            })

            return { task }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) throw new NotFoundException("Task not found")
            this.logger.error("Error ocurred while find task")
            throw new InternalServerErrorException("Error ocurred while find task")
        }
    }
}