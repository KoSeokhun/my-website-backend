import { Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "src/auth/auth.service";
import { DataSource } from "typeorm";
import { UserEntity } from "../entitiy/users.entity";
import { LoginCommand } from "./login.command";

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        private dataSource: DataSource,
        private authService: AuthService,
    ) { }

    async execute(command: LoginCommand): Promise<string> {
        // 1. 해당 email과 password를 가진 회원이 존재하는지 DB에서 확인.
        // 2. 존재한다면 JWT를 발급.
        // 3. 존재하지 않다면 에러 발생.
        const { email, password } = command;
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        const user = await queryRunner.manager.findOneBy(UserEntity, {
            email,
            password,
        });

        await queryRunner.release();

        if (!user) {
            throw new NotFoundException('사용자가 존재하지 않습니다.');
        }
    
        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }
}