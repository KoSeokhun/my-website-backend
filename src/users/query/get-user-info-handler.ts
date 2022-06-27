import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DataSource } from "typeorm";
import { UserEntity } from "../entitiy/users.entity";
import { UserInfo } from "../UserInfo";
import { GetUserInfoQuery } from "./get-user-info.query";

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
    constructor(
        private dataSource: DataSource,
    ) { }
    
    async execute(query: GetUserInfoQuery): Promise<UserInfo> {
        // 1. 해당 userId를 가진 회원이 존재하는지 DB에서 확인. 
        // 2. 존재한다면 조회된 데이터를 UserInfo 타입으로 응답.
        // 3. 존재하지 않다면 에러 발생.
        const { userId } = query;
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        const user = await queryRunner.manager.findOneBy(UserEntity, {
            id: userId,
        });

        await queryRunner.release();

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}