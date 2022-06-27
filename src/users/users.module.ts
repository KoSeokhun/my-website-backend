import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { UsersController } from './users.controller';
import { UserEntity } from './entitiy/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './command/create-user.handler';
import { UserEventsHandler } from './event/create-user-events.handler';
import { VerifyEmailHandler } from './command/verify-email.handler';
import { LoginHandler } from './command/login.handler';
import { VerifyAccessTokenHandler } from './command/verify-access-token-handler';
import { GetUserInfoQueryHandler } from './query/get-user-info-handler';

const commandHandlers = [
    CreateUserHandler,
    VerifyEmailHandler,
    LoginHandler,
    VerifyAccessTokenHandler,
];

const queryHandlers = [
    GetUserInfoQueryHandler,
]

const eventHandlers = [
    UserEventsHandler,
]

@Module({
    imports: [EmailModule,
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule,
        CqrsModule,],
    controllers: [UsersController],
    providers: [Logger,
        ...commandHandlers,
        ...queryHandlers,
        ...eventHandlers,],
})
export class UsersModule { }
