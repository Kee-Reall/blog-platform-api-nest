import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../Model/Schema/blog.schema';
import { Model } from 'mongoose';
import { BlogsPaginationConfig } from './blogs.pagination-config';
import { BlogPresentationModel } from '../../Model/Type/blogs.types';
import { PaginatedOutput } from '../../Model/Type/pagination.types';
import { BlogFilters } from '../../Model/Type/query.types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  public async getBlogsWithPaginationConfig(
    query: BlogFilters,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    const config = new BlogsPaginationConfig(query);
    const { filter, sortBy, sortDirection, shouldSkip, limit } = config;
    const direction: 1 | -1 = sortDirection === 'asc' ? 1 : -1;
    const items = await this.BlogModel.find(filter)
      .sort({ [sortBy]: direction })
      .skip(shouldSkip)
      .limit(limit);
    const totalCount = await this.BlogModel.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / limit),
      page: +query.pageNumber,
      pageSize: limit,
      totalCount,
      items,
    } satisfies PaginatedOutput<BlogPresentationModel>;
  }

  public async getBlogById(id: string): Promise<BlogPresentationModel> {
    const blog = this.BlogModel.findById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }
}
