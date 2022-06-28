import { IEvent } from "@nestjs/cqrs";
import { CqrsEvent } from './cqrs.event';

export class CreateUserEvent extends CqrsEvent implements IEvent {
    constructor(
        readonly email: string,
        readonly signUpVerifyToken: string,
    ) {
        super(CreateUserEvent.name);
    }
}