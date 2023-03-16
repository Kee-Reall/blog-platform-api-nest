import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../../helpers/classes/repository.class';
import { IPaginationConfig, User, UserDocument } from '../../Model';

@Injectable()
export class UsersQueryRepository extends Repository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }
  public async getPaginatedUsers(config: IPaginationConfig) {
    const [items, totalCount] = await this.paginate(this.userModel, config);
    return {
      pagesCount: Math.ceil(totalCount / config.limit),
      page: config.pageNumber,
      pageSize: config.limit,
      totalCount,
      items,
    };
  }
}
