import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AdminQueryRepository } from '../repos';
import { MessageENUM } from '../../Helpers';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsLoginUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private queryRepo: AdminQueryRepository) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    return await this.queryRepo.isUserUnique('login', value);
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {};
  }
  if (!validationOptions.message) {
    validationOptions.message = MessageENUM.ALREADY_EXISTS;
  }
  return function (obj: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: obj.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLoginUniqueConstraint,
    });
  };
}
