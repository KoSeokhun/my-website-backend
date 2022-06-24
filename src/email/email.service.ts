//import Mail = require('nodemailer/lib/mailer');
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';

import { Inject, Injectable } from '@nestjs/common';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class EmailService {
    private transporter: Mail;

    constructor(
        @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
    ) {
        this.transporter = nodemailer.createTransport({
            service: config.service, // config
            auth: {
                user: config.auth.user, // config
                pass: config.auth.pass, // config 
            }
        });
    }

    async sendMemberJoinVerification(emailAddress: string, signUpVerifyToken: string) {
        const baseUrl = this.config.baseUrl; //config
        const url = `${baseUrl}/users/email-verify?signUpVerifyToken=${signUpVerifyToken}`;
        const mailOptions: EmailOptions = {
            to: emailAddress,
            subject: '가입 인증 메일',
            html: `
                가입 확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
                <form action="${url}" method="POST">
                    <button>가입 확인</button>
                </form>
            `
        }

        return await this.transporter.sendMail(mailOptions);
    }
}
