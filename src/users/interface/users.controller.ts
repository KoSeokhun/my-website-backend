import {
   // BadRequestException,
    Body, Controller, Get,
   // Inject, InternalServerErrorException, Logger, LoggerService,
    Param, Post, Query, UseGuards
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from 'src/auth.guard';
import { CreateUserCommand } from '../application/command/create-user.command';
import { LoginCommand } from '../application/command/login.command';
import { VerifyEmailCommand } from '../application/command/verify-email.command';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { GetUserInfoQuery } from '../application/query/get-user-info.query';
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
    constructor(// @Inject(Logger) private readonly logger: LoggerService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,) { }

    @Post("/register")
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
       // this.printLoggerServiceLog(dto);
        const { email, password } = dto;

        const command = new CreateUserCommand(email, password);

        return await this.commandBus.execute(command);
    }

    // private printLoggerServiceLog(dto: CreateUserDto) {
    //     try {
    //         throw new InternalServerErrorException('test');
    //     } catch (e) {
    //         this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    //     }
    //     this.logger.warn('warn: ' + JSON.stringify(dto));
    //     this.logger.log('log: ' + JSON.stringify(dto));
    //     this.logger.verbose('verbose: ' + JSON.stringify(dto));
    //     this.logger.debug('debug: ' + JSON.stringify(dto));
    // }

    @Post("/email-verify")
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signUpVerifyToken } = dto;

        const command = new VerifyEmailCommand(signUpVerifyToken);

        return await this.commandBus.execute(command);
    }
    
    @Post("/login")
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        const command = new LoginCommand(email, password);

        return await this.commandBus.execute(command);
    }

    @UseGuards(AuthGuard)
    @Get("/:id")
    async getUserInfo(@Param("id") userId: string): Promise<UserInfo> {
        // if (+userId < 1) {
        //     throw new BadRequestException('id는 0보다 큰 정수여야 합니다', 'id format exception');
        // }

        const getUserInfoQuery = new GetUserInfoQuery(userId);

        return await this.queryBus.execute(getUserInfoQuery);
    }
}
