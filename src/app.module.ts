import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { PrismaModule } from './common/db/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    PrismaModule,
    UserModule,
    TaskModule
  ],
})
export class AppModule { }
