import { NotFoundException } from '@nestjs/common';
import { Nullable } from '../../Model';

// eslint-disable-next-line @typescript-eslint/ban-types
export function CheckExistence<
  T extends { new (...args: any[]): IExistenceChecker },
>(constructor: T) {
  return class extends constructor {
    checkExisting(entity: Nullable<unknown>) {
      //type issue. Class does not understand that he has it
      if (!entity) {
        throw new NotFoundException();
      }
    }
  };
}

export interface IExistenceChecker {
  checkExisting(entity: Nullable<unknown>): void;
}
