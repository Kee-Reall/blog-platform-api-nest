import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ObjectId } from 'mongodb';

@ValidatorConstraint({ name: 'isValidObjectId', async: false })
export class IsValidObjectIdConstraint implements ValidatorConstraintInterface {
  validate(str: string) {
    return ObjectId.isValid(str);
  }
}

export function IsValidObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidObjectIdConstraint,
    });
  };
}
