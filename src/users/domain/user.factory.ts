import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { TestEvent } from "../application/event/test.event";
import { CreateUserEvent } from "./create-user.event";
import { User } from "./user";

@Injectable()
export class UserFactory {
    constructor(private eventBus: EventBus) { }

    create(
        id: string,
        name: string,
        email: string,
        password: string,
        signUpVerifyToken: string,
    ): User {
        const user = new User(id, name, email, password, signUpVerifyToken);

        this.eventBus.publish(new CreateUserEvent(email, signUpVerifyToken));
        this.eventBus.publish(new TestEvent());

        return user;
    }

    reconstitute(
        id: string,
        name: string,
        email: string,
        password: string,
        signUpVerifyToken: string,
    ): User {
        return new User(id, name, email, password, signUpVerifyToken);
    }
}