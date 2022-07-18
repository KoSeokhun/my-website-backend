import { Inject, Injectable, NotFoundException, } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "src/auth/auth.service";
import { IUserRepository } from "src/users/domain/repository/iuser.repository";
import { VerifyEmailCommand } from "./verify-email.command";

@Injectable()
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(
        @Inject('UserRepository') private userRepository: IUserRepository,
        private authService: AuthService,
    ) { }

    async execute(command: VerifyEmailCommand): Promise<string> {
        // 1. DB에서 signUpVerifyToken으로 회원 가입 처리 중인 회원이 있는지 조회.
        // 2. 존재한다면 바로 로그인 상태가 되도록 JWT를 발급.
        // 3. 존재하지 않다면 에러 발생.
        const { signUpVerifyToken } = command;

        const user = await this.userRepository.findBySignUpVerifyToken(signUpVerifyToken);
        if (user === null) {
            throw new NotFoundException('사용자가 존재하지 않습니다.');
        }
        
        return this.authService.login({
            id: user.getId(),
            email: user.getEmail(),
        });
    }
}