import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { CreateUserEvent } from './create-user.event';
import { TestEvent } from './test.event';

@EventsHandler(CreateUserEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<CreateUserEvent | TestEvent> {
    constructor(
        private emailService: EmailService,
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