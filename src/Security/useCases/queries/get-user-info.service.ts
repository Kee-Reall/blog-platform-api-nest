import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthQueryRepository } from '../../repos';
import { UserInfoType } from '../../../Model';

export class GetUserInfo {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserInfo)
export class GetUserInfoUseCase implements IQueryHandler<GetUserInfo> {
  constructor(private repo: AuthQueryRepository) {}

  public async execute(query: GetUserInfo): Promise<UserInfoType> {
    return this.repo.getUserInfo(query.userId);
  }
}
