import { User } from "../user";

export interface IUserRepository {
    findByEmail: (email: string) => Promise<User>;
    findByEmailAndPassword: (email: string, password: string) => Promise<User>;
    findBySignUpVerifyToken: (signUpVerifyToken: string) => Promise<User>;
    save: (id: string, name: string, email: string, password: string, signUpVerifyToken: string) => Promise<void>;
}