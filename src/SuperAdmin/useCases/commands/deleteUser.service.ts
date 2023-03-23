import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SuperAdminCommandRepository } from '../../repos';
import { VoidPromise } from '../../../Model';

export class DeleteUser {
  constructor(public userId: ObjectId) {}
}
@CommandHandler(DeleteUser)
export class DeleteUserUseCase implements ICommandHandler<DeleteUser> {
  constructor(private commandRepo: SuperAdminCommandRepository) {}
  public async execute({ userId }: DeleteUser): VoidPromise {
    const isDeleted = await this.commandRepo.deleteUser(userId);
    if (!isDeleted) {
      throw new NotFoundException();
    }
    return;
  }
}
