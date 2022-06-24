import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { UserEntity } from './users.entity';

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(private dataSource: DataSource,
        private emailService: EmailService,) { }

    async createUser(name: string, email: string, password: string) {
        const userExists = await this.checkUserExists(email);
        if (userExists) {
            throw new UnprocessableEntityException('해당 이메일로 가입한 사용자가 이미 존재합니다.');
        }

        const signUpVerifyToken = uuid.v1();
        await this.saveUser(name, email, password, signUpVerifyToken);
        await this.sendMemberJoinEmail(email, signUpVerifyToken);
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

    private async sendMemberJoinEmail(email: string, signUpVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signUpVerifyToken);
    }

    async verifyEmail(signUpVerifyToken: string): Promise<string>{
        // 1. DB에서 signUpVerifyToken으로 회원 가입 처리 중인 회원이 있는지 조회.
        // 2. 존재한다면 바로 로그인 상태가 되도록 JWT를 발급.
        // 3. 존재하지 않다면 에러 발생.
        throw new Error('The method is not implemented.');
    }

    async login(email: string, password: string): Promise<string> {
        // 1. 해당 email과 password를 가진 회원이 존재하는지 DB에서 확인.
        // 2. 존재한다면 JWT를 발급.
        // 3. 존재하지 않다면 에러 발생.
        throw new Error('The method is not implemented.');
    }

    async getUserInfo(userId: string): Promise<UserInfo> {
        // 1. 해당 userId를 가진 회원이 존재하는지 DB에서 확인. 
        // 2. 존재한다면 조회된 데이터를 UserInfo 타입으로 응답.
        // 3. 존재하지 않다면 에러 발생.

        throw new Error('The method is not implemented.');
    }
}
