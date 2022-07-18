export class User {
    constructor(
        private id: string,
        private email: string,
        private password: string,
        private signUpVerifyToken: string,
    ) { }

    getId(): Readonly<string> {
        return this.id;
    }
    
    getEmail(): Readonly<string> {
        return this.email;
    }
}