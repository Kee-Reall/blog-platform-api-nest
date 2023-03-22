import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SuperAdminQueryRepository } from '../../repos';
import { UsersFilter } from '../../../Model';
import {
  UsersPaginationConfig,
  DefaultUsersQuery,
} from '../../../Infrastructure';

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
  public async execute({ config }: GetPaginatedUsers): Promise<any> {
    return this.queryRepo.getPaginatedUsers(config);
  }
}
