import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";

import { Status } from "@prisma/client";

export class UpdateTaskDto {
    @IsOptional()
    @IsIn([
        "COMPLETED",
        "PROGRESS",
        "STOP"
    ])
    status?: Status

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string
}