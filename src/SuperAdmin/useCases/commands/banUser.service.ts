import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
  BanUserInputModel,
  User,
  UserDocument,
  VoidPromise,
} from '../../../Model';
import { NotFoundException } from '@nestjs/common';

export class BanUser implements BanUserInputModel {
  public banReason: string;
  public isBanned: boolean;

  constructor(public userId: ObjectId, dto: BanUserInputModel) {
    this.banReason = dto.banReason;
    this.isBanned = dto.isBanned;
  }
}

@CommandHandler(BanUser)
export class BanUserUseCase implements ICommandHandler<BanUser> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  public async execute(command: BanUser): VoidPromise {
    const user = this.userModel.findById(command.userId);
    if (!user) {
      throw new NotFoundException();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return user;
  }
}
