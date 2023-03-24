import { PaginationConfig } from '../../Helpers';
import { FilterQuery } from 'mongoose';
import {
  BanQuery,
  Direction,
  UserPresentationModel,
  UsersFilter,
} from '../../Model';

export class UsersPaginationConfig extends PaginationConfig {
  filter: FilterQuery<UserPresentationModel>;
  constructor(query: UsersFilter) {
    super(query);
    const banStatus =
      query.banStatus === 'banned'
        ? true
        : query.banStatus === 'notBanned' //если banned, то банстатус Тру, если notBanned он будет фолс
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

export class DefaultUsersQuery implements Required<UsersFilter> {
  public pageNumber = 1;
  public pageSize = 10;
  public searchEmailTerm = '[*]*';
  public searchLoginTerm = '[*]*';
  public sortBy = 'createdAt';
  public sortDirection: Direction = 'desc';
  public banStatus: BanQuery = 'all';
}
