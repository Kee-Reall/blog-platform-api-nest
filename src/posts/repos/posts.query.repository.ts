import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../../Model/Schema/post.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { PostPresentationModel } from '../../Model/Type/posts.types';
import { PostFilters } from '../../Model/Type/query.types';
import { PostsPaginationConfig } from './posts.pagination-config';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
  ) {}

  public async findPostById(id: string): Promise<PostPresentationModel> {
    const post = await this.PostModel.findById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  public async getPaginatedPosts(query: PostFilters) {
    const { filter, sortBy, sortDirection, shouldSkip, limit } =
      new PostsPaginationConfig(query);
    const direction: 1 | -1 = sortDirection === 'asc' ? 1 : -1;
    console.log(sortBy, sortDirection);
    const items = await this.PostModel.find(filter)
      .sort({ [sortBy]: direction })
      .skip(shouldSkip)
      .limit(limit);
    const totalCount = await this.PostModel.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / limit),
      page: +query.pageNumber || 1,
      pageSize: limit,
      totalCount,
      items,
    };
  }
}
