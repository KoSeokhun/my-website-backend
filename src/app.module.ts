import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import authConfig from './config/authConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfigAsync } from './config/ormConfig';
import { ExceptionModule } from './exceptions/exception.module';
import { LoggingModule } from './logging/logging.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [`${__dirname}\\config\\env\\.${process.env.NODE_ENV}.env`],
    load: [emailConfig, authConfig],
    isGlobal: true,
    validationSchema,
  }), TypeOrmModule.forRootAsync(ormConfigAsync),
    UsersModule, EmailModule, ExceptionModule, LoggingModule, TerminusModule,
  HttpModule,],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule { }