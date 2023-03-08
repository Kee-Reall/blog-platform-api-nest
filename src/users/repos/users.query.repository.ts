import { Injectable } from '@nestjs/common';
import { Repository } from '../../helpers/classes/repository.class';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../Model/Schema/user.schema';
import { Model } from 'mongoose';
import { IPaginationConfig } from '../../Model/Type/pagination.types';

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
