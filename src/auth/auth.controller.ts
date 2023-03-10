import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email/email.service';
import { BasicAuth } from '../helpers/classes/basicAuth.guard';
import { UserInput } from '../users/validators/user.validator';
import { AuthService } from './auth.service';
import { EmailInput } from './validators/email';

@Controller('api/auth')
export class AuthController {
  constructor(private mailer: EmailService, private service: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() dto: UserInput) {
    await this.service.registration(dto);
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resendConfirmCode(@Body() _: EmailInput) {
    return await this.service.resendRegistryCode(_.email);
  }

  @UseGuards(BasicAuth) // тест метод -- в продакшене удалять
  @Get('test-mail')
  public async userByToken() {
    this.mailer.test().then((data) => console.log(data));
    return;
  }
}
