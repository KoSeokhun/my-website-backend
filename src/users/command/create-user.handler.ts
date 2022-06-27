import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { DataSource } from 'typeorm';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { UserEntity } from '../entitiy/users.entity';
import { CreateUserEvent } from '../event/create-user.event';
import { TestEvent } from '../event/test.event';
import { CreateUserCommand } from './create-user.command';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(private dataSource: DataSource,
        private emailService: EmailService,
        private authService: AuthService,
    private eventBus: EventBus,) { }
    
    async execute(command: CreateUserCommand) {
        const { name, email, password } = command;

        const userExists = await this.checkUserExists(email);
        if (userExists) {
            throw new UnprocessableEntityException('해당 이메일로 가입한 사용자가 이미 존재합니다.');
        }

        const signUpVerifyToken = uuid.v1();

        await this.saveUser(name, email, password, signUpVerifyToken);

        this.eventBus.publish(new CreateUserEvent(email, signUpVerifyToken));
        this.eventBus.publish(new TestEvent());
    }

    private async checkUserExists(email: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        const user = await queryRunner.manager.findOneBy(UserEntity, { email });

        await queryRunner.release();

        return user !== null;
    }

    private async saveUser(name: string, email: string, password: string, signUpVerifyToken: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = new UserEntity();

            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signUpVerifyToken = signUpVerifyToken;

            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();
        } catch (e) {
            // since we have errors lets rollback the changes we made.
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated.
            await queryRunner.release();
        }
    }
}