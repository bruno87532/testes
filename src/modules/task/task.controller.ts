import { Controller, UseGuards, Post, Delete, Get, Param, Patch, Req, Body, UsePipes, ValidationPipe } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { TaskService } from "./task.service";

import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

import type { RequestWithUser } from "src/common/types/request-with-user";

@Controller("task")
@UseGuards(AuthGuard("jwt"))
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Req() req: RequestWithUser, @Body() data: CreateTaskDto) {
        return await this.taskService.create(data, req.user.id)
    }

    @Get()
    async findMany(@Req() req: RequestWithUser) {
        return await this.taskService.findMany(req.user.id)
    }

    @Get("/:id")
    async find(@Req() req: RequestWithUser, @Param("id") id: string) {
        return await this.taskService.find(id, req.user.id)
    }

    @Delete("/:id")
    async delete(@Req() req: RequestWithUser, @Param("id") id: string) {
        return await this.taskService.delete(id, req.user.id)
    }

    @Patch("/:id")
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(@Req() req: RequestWithUser, @Param("id") id: string, @Body() data: UpdateTaskDto) {
        return await this.taskService.update(data, id, req.user.id)
    }
}
