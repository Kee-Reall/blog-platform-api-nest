import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { UsersFilters } from '../../Model/Type/query.types';
import { UsersPaginationConfig } from '../repos/users.pagination-config';

export class UserQueryPipe implements PipeTransform {
  transform(query: UsersFilters, metadata: ArgumentMetadata) {
    return new UsersPaginationConfig(query);
  }
}
