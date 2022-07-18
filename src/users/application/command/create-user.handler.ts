import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { CreateUserCommand } from './create-user.command';
import { UserFactory } from 'src/users/domain/user.factory';
import { IUserRepository } from 'src/users/domain/repository/iuser.repository';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(private userFactory: UserFactory,
        @Inject('UserRepository') private userRepository: IUserRepository,) { }
    
    async execute(command: CreateUserCommand) {
        const { email, password } = command;

        const user = await this.userRepository.findByEmail(email);
        if (user !== null) {
            throw new UnprocessableEntityException('해당 이메일로 가입한 사용자가 이미 존재합니다.');
        }

        const id = ulid();
        const signUpVerifyToken = uuid.v1();

        await this.userRepository.save(id, email, password, signUpVerifyToken);

        this.userFactory.create(id, email, password, signUpVerifyToken);
    }
}