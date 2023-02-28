import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Model } from 'mongoose';
import { BlogsPaginationConfig } from './blogs.pagination-config';
import { BlogPresentationModel } from '../../Model/Type/blogs.types';
import { PaginatedOutput } from '../../Model/Type/pagination.types';
import { BlogFilters, PostFilters } from '../../Model/Type/query.types';
import { Post, PostDocument } from '../../Model/Schema/post.schema';
import { Repository } from '../../helpers/classes/repository.class';
import { PostsPaginationConfig } from '../../posts/repos/posts.pagination-config';
import { PostPresentationModel } from '../../Model/Type/posts.types';
import { Like, LikeDocument } from '../../Model/Schema/like.schema';
import { LikesInfo, WithLike } from '../../Model/Type/likes.types';

@Injectable()
export class BlogsQueryRepository extends Repository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {
    super();
  }

  public async getBlogsWithPaginationConfig(
    query: BlogFilters,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    const config = new BlogsPaginationConfig(query);
    const [items, totalCount] = await this.paginate(this.blogModel, config);
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items,
    } satisfies PaginatedOutput<BlogPresentationModel>;
  }

  public async getBlogById(id: string): Promise<BlogPresentationModel> {
    const blog = await this.findById(this.blogModel, id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  public async getBlogEntityById(id: string): Promise<BlogDocument> {
    const blog = await this.findById(this.blogModel, id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  public async getPostsByBlogId(
    id: string,
    query: PostFilters,
  ): Promise<PaginatedOutput<WithLike<PostPresentationModel>>> {
    const blog = await this.findById(this.blogModel, id);
    if (!blog) {
      throw new NotFoundException();
    }
    const config = new PostsPaginationConfig(query, {
      blogId: blog._id,
    });
    const [items, totalCount] = await this.paginate(this.postModel, config);
    const likesInfo: LikesInfo[] = await this.countLikesInfo(
      this.likeModel,
      items,
    );
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items: items.map((item, idx) => {
        return {
          ...item.toJSON(),
          likesInfo: likesInfo[idx],
        };
      }),
    };
  }
}
