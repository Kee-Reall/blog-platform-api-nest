import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mail: MailerService) {}

  private generateConfirmHTML(code: string) {
    return `
      <h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://blog-platform-api-nest.vercel.app/api/auth/confirm-email?code=${code}'>complete registration</a>
      </p>`;
  }

  private generateRecoveryHTML(code: string) {
    return `
    <h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
      <a href='https://blog-platform-api-nest.vercel.app/api/auth/password-recovery?recoveryCode=${code}'>recovery password</a>
    </p>`;
  }

  public async sendConfirmation(email: string, code: string): Promise<boolean> {
    try {
      const { accepted } = await this.mail.sendMail({
        to: email,
        subject: 'Registration conformation',
        html: this.generateConfirmHTML(code),
      });
      return accepted.length > 0;
    } catch (e) {
      return false;
    }
  }

  public async sendRecoveryInfo(email: string, code: string): Promise<boolean> {
    try {
      const { accepted } = await this.mail.sendMail({
        to: email,
        subject: 'Password recovery',
        html: this.generateRecoveryHTML(code),
      });
      return accepted.length > 0;
    } catch (e) {
      return false;
    }
  }
}
