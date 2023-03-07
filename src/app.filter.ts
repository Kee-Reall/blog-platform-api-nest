import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalHTTPFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    console.log(status);
    response
      .status(400)
      .json(
        status === 404 ? { blogId: 'FUCK YOU LEATHER MAN' } : { teapot: 'WOW' },
      );
  }
}
