import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { BloggerQueryRepository, BloggerCommandRepository } from '../../repos';
import {
  Blog,
  BlogDocument,
  BlogInputModel,
  BlogOwnerInfo,
  BlogPresentationModel,
} from '../../../Model';

export class CreateBlog implements BlogInputModel {
  description: string;

  name: string;
  websiteUrl: string;
  constructor(public userId: string, dto: BlogInputModel) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

@CommandHandler(CreateBlog)
export class CreateBlogUseCase implements ICommandHandler<CreateBlog> {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    private commandRepo: BloggerCommandRepository,
    private queryRepo: BloggerQueryRepository,
  ) {}
  public async execute({
    description,
    name,
    websiteUrl,
    userId,
  }: CreateBlog): Promise<BlogPresentationModel> {
    const user = await this.queryRepo.getUserEntity(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const _blogOwnerInfo: BlogOwnerInfo = {
      userId: user._id,
      userLogin: user.login,
    };
    const blog = new this.blogModel({
      description,
      name,
      websiteUrl,
      _blogOwnerInfo,
    });
    if (!(await this.commandRepo.saveBlog(blog))) {
      throw new ImATeapotException();
    }
    return blog.toJSON() as BlogPresentationModel;
  }
}
