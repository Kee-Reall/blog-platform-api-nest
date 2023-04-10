import { FilterQuery } from 'mongoose';
import { PaginationConfig } from '../../Base';
import {
  BanQuery,
  Direction,
  UserPresentationModel,
  UsersForAdminFilter,
} from '../../Model';

export class UsersPaginationConfig extends PaginationConfig {
  filter: FilterQuery<UserPresentationModel>;
  constructor(query: UsersForAdminFilter) {
    super(query);
    const banStatus =
      query.banStatus === 'banned'
        ? true
        : query.banStatus === 'notBanned' //если banned, то banSatatus τρυe, если notBanned он будет false
        ? false
        : undefined; // если ни то, ни другое, то undefined
    const filter = {
      $or: [
        { login: new RegExp(query.searchLoginTerm || '[*]*', 'ig') },
        { email: new RegExp(query.searchEmailTerm || '[*]*', 'ig') },
      ],
    };
    if (banStatus === undefined) {
      this.filter = filter;
    } else {
      this.filter = { ...filter, 'banInfo.isBanned': banStatus };
    }
  }
}

export class DefaultUsersQuery implements Required<UsersForAdminFilter> {
  public pageNumber = 1;
  public pageSize = 10;
  public searchEmailTerm = '[*]*';
  public searchLoginTerm = '[*]*';
  public sortBy = 'createdAt';
  public sortDirection: Direction = 'desc';
  public banStatus: BanQuery = 'all';
}
