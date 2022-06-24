import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
        const { name, email, password } = dto;
        await this.usersService.createUser(name, email, password);
    }

    @Post("/email-verify")
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signUpVerifyToken } = dto;
        return await this.usersService.verifyEmail(signUpVerifyToken);
    }
    
    @Post("/login")
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        return await this.usersService.login(email, password);
    }
    
    @Post("/:id")
    async getUserInfo(@Param("id") userId: string): Promise<UserInfo> {
        return await this.usersService.getUserInfo(userId);
    }

    @Get("/env")
    getEnv(): string{
        return process.env.DATABASE_HOST;
    }
    
}
