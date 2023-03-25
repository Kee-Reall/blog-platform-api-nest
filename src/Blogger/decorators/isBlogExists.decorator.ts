import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { BloggerQueryRepository } from '../repos';
import { MessageENUM } from '../../Helpers';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
  constructor(private repo: BloggerQueryRepository) {}

  public async validate(blogId: string): Promise<boolean> {
    return await this.repo.isBlogExist(blogId);
  }
}

export function IsBlogExists(validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {};
  }
  if (!validationOptions.message) {
    validationOptions.message = MessageENUM.NOT_EXIST;
  }
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBlogExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogExistConstraint,
    });
  };
}
