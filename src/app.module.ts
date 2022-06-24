import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfigAsync } from './config/ormConfig';

console.log("경로 : " + `${__dirname}\\config\\env\\.${process.env.NODE_ENV}.env`);
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [`${__dirname}\\config\\env\\.${process.env.NODE_ENV}.env`],
    load: [emailConfig],
    isGlobal: true,
    validationSchema,
  }), TypeOrmModule.forRootAsync(ormConfigAsync),
    UsersModule, EmailModule,],
  controllers: [],
  providers: [],
})
export class AppModule { }