import { PaginationConfig } from '../../Helpers/classes/pagination.config';
import { FilterQuery } from 'mongoose';
import { Direction, UserPresentationModel, UsersFilter } from '../../Model';

export class UsersPaginationConfig extends PaginationConfig {
  filter: FilterQuery<UserPresentationModel>;
  constructor(query: UsersFilter) {
    super(query);
    this.filter = {
      $or: [
        { login: new RegExp(query.searchLoginTerm || '[*]*', 'ig') },
        { email: new RegExp(query.searchEmailTerm || '[*]*', 'ig') },
      ],
    };
  }
}

export class DefaultUsersQuery implements Required<UsersFilter> {
  pageNumber = 1;
  pageSize = 10;
  searchEmailTerm = '[*]*';
  searchLoginTerm = '[*]*';
  sortBy = 'createdAt';
  sortDirection: Direction = 'desc';
}
