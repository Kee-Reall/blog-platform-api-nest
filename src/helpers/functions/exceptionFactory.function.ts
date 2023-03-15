import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function exceptionFactory(errors: Array<ValidationError>) {
  throw new BadRequestException({
    errorsMessages: errors
      .map(({ constraints, property }) => {
        const errorsMessages = [];
        for (const message of Object.values(constraints)) {
          errorsMessages.push({
            message,
            field: property,
          });
        }
        return errorsMessages;
      })
      .flat(),
  });
}
