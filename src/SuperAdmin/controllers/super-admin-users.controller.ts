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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersFilter } from '../../Model';
import { UserInput } from '../validators';
import { adminCommand, adminQuery } from '../useCases';
import { BanUserInput } from '../validators/ban-user.validator';
import { BasicAuthGuard, ParseObjectIdPipe } from '../../Infrastructure';

@Controller('api/sa/users')
@UseGuards(BasicAuthGuard)
export class SuperAdminUsersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public async getUsersForAdmin(@Query() fltr: UsersFilter) {
    return await this.queryBus.execute(new adminQuery.GetPaginatedUsers(fltr));
  }

  @Post()
  public async createUser(@Body() dto: UserInput) {
    return await this.commandBus.execute(new adminCommand.CreateUser(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param('id', ParseObjectIdPipe) userId: ObjectId) {
    return await this.commandBus.execute(new adminCommand.DeleteUser(userId));
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banUser(
    @Param('id', ParseObjectIdPipe) userId: ObjectId,
    @Body() dto: BanUserInput,
  ) {
    return await this.commandBus.execute(new adminCommand.BanUser(userId, dto));
  }
}
