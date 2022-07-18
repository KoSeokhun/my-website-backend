import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "src/auth/auth.service";
import { IUserRepository } from "src/users/domain/repository/iuser.repository";
import { LoginCommand } from "./login.command";

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        @Inject('UserRepository') private userRepository: IUserRepository,
        private authService: AuthService,
    ) { }

    async execute(command: LoginCommand): Promise<string> {
        // 1. 해당 email과 password를 가진 회원이 존재하는지 DB에서 확인.
        // 2. 존재한다면 JWT를 발급.
        // 3. 존재하지 않다면 에러 발생.
        const { email, password } = command;

        const user = await this.userRepository.findByEmailAndPassword(email, password);
        if (user === null) {
            throw new NotFoundException('사용자가 존재하지 않습니다.');
        }
    
        return this.authService.login({
            id: user.getId(),
            email: user.getEmail(),
        });
    }
}