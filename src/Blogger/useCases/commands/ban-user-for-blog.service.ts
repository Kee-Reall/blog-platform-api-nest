import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import {
  Ban,
  BanDocument,
  BanUserForBlogInputModel,
  BlogDocument,
  UserDocument,
  VoidPromise,
} from '../../../Model';

export class BanUserForBlog implements BanUserForBlogInputModel {
  public banReason: string;
  public blogId: string;
  public isBanned: boolean;

  constructor(
    public ownerId: string,
    public userId: string,
    dto: BanUserForBlogInputModel,
  ) {
    this.banReason = dto.banReason;
    this.blogId = dto.blogId;
    this.isBanned = dto.isBanned;
  }
}

@CommandHandler(BanUserForBlog)
export class BloggerBanUserUseCase implements ICommandHandler<BanUserForBlog> {
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
    @InjectModel(Ban.name) private mdl: Model<BanDocument>,
  ) {}
  public async execute(command: BanUserForBlog): VoidPromise {
    const ban: BanDocument = await this.queryRepo.getBanEntity(
      command.ownerId,
      command.userId,
      command.blogId,
    );
    return ban ? this.updateBan(command, ban) : this.createBan(command);
  }
  private async updateBan(
    command: BanUserForBlog,
    ban: BanDocument,
  ): VoidPromise {
    if (command.isBanned === ban.isBanned) {
      if (command.banReason === ban.banReason) {
        return;
      }
      ban.banReason = command.banReason;
      await this.commandRepo.saveBan(ban);
      return;
    } else {
      if (ban.isBanned && !command.isBanned) {
        await this.commandRepo.deleteBan(ban._id);
        return;
      }
    }
    // you never should get here
    throw new ImATeapotException();
  }

  private async createBan(command: BanUserForBlog): VoidPromise {
    const entities: [UserDocument, UserDocument, BlogDocument] =
      await Promise.all([
        this.queryRepo.getUserEntity(command.ownerId),
        this.queryRepo.getUserEntity(command.userId),
        this.queryRepo.getBlogEntity(command.blogId),
      ]);
    for (const doc of entities) {
      if (!doc) {
        throw new NotFoundException();
      }
    }
    const [owner, user, blog] = entities;
    if (blog._blogOwnerInfo.userId.toHexString() !== owner.id) {
      throw new ForbiddenException();
    }
    if (owner.id === user.id) {
      throw new ForbiddenException(); // blogger can't ban yourself
    }
    const ban = new this.mdl({
      ownerId: owner._id,
      bannedUserId: user._id,
      bannedUserLogin: user.login,
      blogId: blog._id,
      isBanned: command.isBanned,
      banReason: command.banReason,
    });
    const isSaved = await this.commandRepo.saveBan(ban);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
