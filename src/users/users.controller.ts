import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from './repos/users.query.repository';
import { UsersService } from './users.service';
import { BasicAuth } from '../helpers/classes/basicAuth.guard';
import { IPaginationConfig } from '../Model/Type/pagination.types';
import { UserQueryPipe } from './pipes/users.pipe';
import { UserInput } from './validators/user.validator';

@Controller('api/users')
export class UsersController {
  constructor(
    private queryRepo: UsersQueryRepository,
    private service: UsersService,
  ) {}

  @UseGuards(BasicAuth)
  @Get()
  public async getPaginatedUsers(
    @Query(UserQueryPipe) config: IPaginationConfig,
  ) {
    return await this.queryRepo.getPaginatedUsers(config);
  }

  @UseGuards(BasicAuth)
  @Post()
  public async createUser(@Body() dto: UserInput) {
    return await this.service.createUser(dto);
  }

  @UseGuards(BasicAuth)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param('id') userId: string) {
    return await this.service.deleteUser(userId);
  }
}
