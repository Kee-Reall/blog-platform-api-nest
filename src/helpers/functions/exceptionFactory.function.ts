import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function exceptionFactory(errors: Array<ValidationError>) {
  throw new BadRequestException({
    errorMessages: errors
      .map(({ constraints, property }) => {
        const errorMessages = [];
        for (const message of Object.values(constraints)) {
          errorMessages.push({
            message,
            field: property,
          });
        }
        return errorMessages;
      })
      .flat(),
  });
}
