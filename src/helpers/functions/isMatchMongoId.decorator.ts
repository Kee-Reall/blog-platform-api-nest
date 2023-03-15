import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { MessageENUM } from '../enums';

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  validate(str: string) {
    return ObjectId.isValid(str);
  }
}

export function IsMatchMongoId(validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {};
  }
  if (!validationOptions.message) {
    validationOptions.message = MessageENUM.FORBIDDEN_VALUE;
  }
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isMatchMongoId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidObjectIdConstraint,
    });
  };
}
