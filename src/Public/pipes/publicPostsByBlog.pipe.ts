import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import { IPaginationConfig, Nullable, Post, PostFilter } from '../../Model';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';

export class PublicPostsByBlogPaginationPipe
  extends PaginationConfig
  implements IPaginationConfig
{
  filter: FilterQuery<Post>;
  constructor(query: PostFilter, id: string) {
    super(query);
    const blogId = this.toMongoId(id);
    if (!blogId) {
      throw new NotFoundException();
    }
    this.filter = { blogId, _isOwnerBanned: false, _isBlogBanned: false };
  }

  private toMongoId(str: string): Nullable<ObjectId> {
    try {
      return new ObjectId(str);
    } catch (e) {
      return null;
    }
  }
}
