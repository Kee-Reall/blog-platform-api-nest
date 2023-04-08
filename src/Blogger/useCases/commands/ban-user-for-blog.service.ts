import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerQueryRepository } from '../../repos';
import {
  BanDocument,
  BanUserForBlogInputModel,
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
  constructor(private queryRepo: BloggerQueryRepository) {}
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
    return;
  }

  private async createBan(command: BanUserForBlog): VoidPromise {
    return;
  }
}
