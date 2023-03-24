import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SuperAdminQueryRepository } from '../../repos';
import { UsersPaginationConfig, DefaultUsersQuery } from '../../pipes';
import {
  PaginatedOutput,
  UserPresentationModel,
  UsersFilter,
  WithBanInfo,
} from '../../../Model';

export class GetPaginatedUsers {
  config: UsersPaginationConfig;
  constructor(input?: UsersFilter) {
    if (!input) {
      this.config = new UsersPaginationConfig(new DefaultUsersQuery());
    } else {
      this.config = new UsersPaginationConfig(input);
    }
  }
}

@QueryHandler(GetPaginatedUsers)
export class AdminGetUsersHandler implements IQueryHandler<GetPaginatedUsers> {
  constructor(private queryRepo: SuperAdminQueryRepository) {}
  public async execute({
    config,
  }: GetPaginatedUsers): Promise<
    PaginatedOutput<WithBanInfo<UserPresentationModel>>
  > {
    return this.queryRepo.getPaginatedUsers(config);
  }
}
