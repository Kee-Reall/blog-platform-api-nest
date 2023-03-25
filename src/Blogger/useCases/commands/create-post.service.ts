import { PostInputModel, PostPresentationModel } from '../../../Model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class CreatePost implements PostInputModel {
  content: string;
  shortDescription: string;
  title: string;

  constructor(
    public userId: string,
    public blogId: string,
    dto: PostInputModel,
  ) {
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.title = dto.title;
  }
}

@CommandHandler(CreatePost)
export class CreatePostUseCase implements ICommandHandler<CreatePost> {
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {}
  public async execute(command: CreatePost): Promise<PostPresentationModel> {
    const blog = await this.queryRepo.getBlogEntity(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    if (blog._blogOwnerInfo.userId.toHexString() !== command.userId) {
      throw new ForbiddenException();
    }
    return;
  }
}
