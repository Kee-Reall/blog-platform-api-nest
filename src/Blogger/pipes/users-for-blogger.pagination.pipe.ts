import { PaginationConfig } from '../../Base';
import { Ban, UsersForBloggerFilter } from '../../Model';
import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';

export class UsersForBloggerPaginationPipe extends PaginationConfig {
  public filter: FilterQuery<Ban>;

  constructor(filters: UsersForBloggerFilter, ownerId: string, blogId: string) {
    super(filters);
    this.filter = {
      bannedUserLogin: new RegExp(filters.searchLoginTerm || '[*]*', 'ig'),
      ownerId: new ObjectId(ownerId),
      blogId: new ObjectId(blogId),
    };
  }
}
