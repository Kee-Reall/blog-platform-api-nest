import { ObjectId } from 'mongodb';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { UsersFilter } from '../../Model';
import { UserInput } from '../validators';
import { adminCommand, adminQuery } from '../useCases';
import { BasicAuthGuard, ParseObjectIdPipe } from '../../Infrastructure';

@Controller('api/sa/users')
@UseGuards(BasicAuthGuard)
export class SuperAdminUsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public getUsersForAdmin(@Query() filter: UsersFilter) {
    return this.queryBus.execute(new adminQuery.GetPaginatedUsers(filter));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param('id', ParseObjectIdPipe) userId: ObjectId) {
    return await this.commandBus.execute(new adminCommand.DeleteUser(userId));
  }

  @Post()
  public async createUser(@Body() dto: UserInput) {
    return this.commandBus.execute(new adminCommand.CreateUser(dto));
  }
}
