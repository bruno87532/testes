import { IsString, IsNotEmpty, IsDefined, IsIn } from "class-validator";

import { Status } from "@prisma/client";

export class CreateTaskDto {
    @IsDefined()
    @IsIn([
        "COMPLETED",
        "PROGRESS",
        "STOP"
    ])
    status!: Status

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    description!: string
}