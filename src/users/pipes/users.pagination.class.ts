import { PaginationConfig } from '../../helpers/classes/pagination.config';
import { FilterQuery } from 'mongoose';
import { UserPresentationModel } from '../../Model/Type/users.types';
import { UsersFilters } from '../../Model/Type/query.types';

export class UsersPaginationConfig extends PaginationConfig {
  filter: FilterQuery<UserPresentationModel>;
  constructor(query: UsersFilters) {
    super(query);
    this.filter = {
      $or: [
        { login: new RegExp(query.searchLoginTerm, 'ig') },
        { email: new RegExp(query.searchEmailTerm, 'ig') },
      ],
    };
  }
}
