export interface IEmailService {
    sendMemberJoinVerification: (email: string, signUpVerifyToken: string) => Promise<void>;
}