import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersQueryRepository } from './repos/users.query.repository';
import { UsersFilters } from '../Model/Type/query.types';
import { UserInputModel } from '../Model/Type/users.types';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private queryRepo: UsersQueryRepository,
    private service: UsersService,
  ) {}
  @Get()
  public async getPaginatedUsers(@Query() query: UsersFilters) {
    return await this.queryRepo.getPaginatedUsers(query);
  }

  @Post()
  public async createUser(@Body() dto: UserInputModel) {
    return await this.service.createUser(dto);
  }

  @Delete(':id')
  public async deleteUser(@Param('id') userId: string) {
    return await this.service.deleteUser(userId);
  }
}
