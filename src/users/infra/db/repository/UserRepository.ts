import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUserRepository } from "src/users/domain/repository/iuser.repository";
import { User } from "src/users/domain/user";
import { UserFactory } from "src/users/domain/user.factory";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../entitiy/users.entity";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private userFactory: UserFactory,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOneBy({ email });
        if (!userEntity) {
            return null;
        }

        const { id, name, password, signUpVerifyToken } = userEntity;

        return this.userFactory.reconstitute(id, name, email, password, signUpVerifyToken);
    };

    async findByEmailAndPassword(email: string, password: string): Promise<User | null> {
        const userEntity = await this.userRepository.findOneBy({ email, password });
        if (!userEntity) {
            return null;
        }

        const { id, name, signUpVerifyToken } = userEntity;

        return this.userFactory.reconstitute(id, name, email, password, signUpVerifyToken)
    }

    async findBySignUpVerifyToken(signUpVerifyToken: string): Promise<User> {
        const userEntity = await this.userRepository.findOneBy({ signUpVerifyToken });
        if (!userEntity) {
            return null;
        }

        const { id, name, email, password } = userEntity;

        return this.userFactory.reconstitute(id, name, email, signUpVerifyToken, password);
    }

    async save(id: string, name: string, email: string, password: string, signUpVerifyToken: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = new UserEntity();

            user.id = id;
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