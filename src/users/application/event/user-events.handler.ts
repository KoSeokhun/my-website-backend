import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateUserEvent } from 'src/users/domain/create-user.event';
import { IEmailService } from '../adapter/iemail.service';
import { TestEvent } from './test.event';

@EventsHandler(CreateUserEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<CreateUserEvent | TestEvent> {
    constructor(
        @Inject('EmailService') private emailService: IEmailService,
    ) { }

    async handle(event: CreateUserEvent | TestEvent) {
        switch (event.name) {
            case CreateUserEvent.name: {
                console.log('CreateUserEvent!');
                const { email, signUpVerifyToken } = event as CreateUserEvent;
                await this.emailService.sendMemberJoinVerification(email, signUpVerifyToken);
                break;
            }
            case TestEvent.name: {
                console.log('TestEvent!');
                break;
            }
            default:
                break;
        }
    }
}