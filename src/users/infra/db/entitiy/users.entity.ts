import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({name: 'user'})
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column({ length: 60 })
    email: string;

    @Column({ length: 30 })
    password: string;

    @Column({ length: 60 })
    signUpVerifyToken: string;
}