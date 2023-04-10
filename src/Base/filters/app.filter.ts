import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalHTTPFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const [response, status, errorsMessages] = [
      host.switchToHttp().getResponse<Response>(),
      exception.getStatus(),
      exception.getResponse(),
    ];
    if (status === HttpStatus.BAD_REQUEST) {
      return response.status(status).json(errorsMessages);
    }
    return response.sendStatus(status);
  }
}
