import { ObjectId } from 'mongodb';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, NotFoundException } from '@nestjs/common';
import { BanUserInputModel, UserDocument, VoidPromise } from '../../../Model';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';

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
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute(command: BanUser): VoidPromise {
    const user = await this.queryRepo.getUserEntity(command.userId);
    if (!user) {
      throw new NotFoundException();
    }
    let shouldSave = false;
    if (user.banInfo.isBanned) {
      if (command.isBanned) {
        shouldSave = this.BanedBeforeAndBanedAfter(user, command.banReason);
      } else {
        shouldSave = this.BannedBeforeAndNotBannedAfter(user);
      }
    } else {
      if (command.isBanned) {
        shouldSave = this.NotBanedBeforeAndBanedAfter(user, command.banReason);
      } // 4th is useless
    }
    if (shouldSave) {
      const isSaved = await this.commandRepo.saveUser(user);
      if (!isSaved) {
        throw new ImATeapotException();
      }
    }
    return;
  }

  private NotBanedBeforeAndBanedAfter(
    user: UserDocument,
    banReason: string,
  ): true {
    user.banInfo.isBanned = true;
    user.banInfo.banReason = banReason;
    user.banInfo.banDate = new Date();
    // пройдись тут по всем сущностям и пометь их как те, что не надо выдавать
    return true;
  }
  private BanedBeforeAndBanedAfter(
    user: UserDocument,
    banReason: string,
  ): boolean {
    if (user.banInfo.banReason === banReason) {
      return false;
    }
    user.banInfo.banReason = banReason;
    return true;
  }
  private BannedBeforeAndNotBannedAfter(user: UserDocument): true {
    user.banInfo.isBanned = false;
    user.banInfo.banReason = null;
    user.banInfo.banDate = null;
    //тоже пройтись по всем сущностям
    return true;
  }

  // private userNotBanedBeforeAndNotBanedAfter(): false {
  //   return false; //этот сценарий ничего не делает, поэтому просто не учёл его
  // }
}