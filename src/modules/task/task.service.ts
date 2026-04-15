import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/common/db/prisma/prisma.service";

@Injectable()
export class TaskService {
    constructor(private readonly prismaService: PrismaService) { }
}