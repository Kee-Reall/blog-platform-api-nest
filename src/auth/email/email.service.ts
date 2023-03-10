import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mail: MailerService) {}

  public async test() {
    return await this.mail.sendMail({
      // test method
      to: [''],
      subject: 'test subject',
      html: '<h1>TEST MESSAGE</h1>',
    });
  }

  public async sendConfirmationAfterRegistration(
    email: string,
    code: string,
  ): Promise<boolean> {
    try {
      const { accepted } = await this.mail.sendMail({
        to: email,
        subject: 'Registration conformation',
        html: `<p>http://google.com/похуй-какой-домен/auth/registration-confirmation?code=${code}</p>`,
      });
      return accepted.length > 0;
    } catch (e) {
      return false;
    }
  }
}
