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
import { UsersQueryRepository } from './repos';
import { UsersService } from './users.service';
import { BasicAuthGuard } from '../infrastructure';
import { IPaginationConfig } from '../Model';
import { UserQueryPipe } from './pipes/users.pipe';
import { UserInput } from './validators/user.validator';

@Controller('api/users')
export class UsersController {
  constructor(
    private queryRepo: UsersQueryRepository,
    private service: UsersService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  public async getPaginatedUsers(
    @Query(UserQueryPipe) config: IPaginationConfig,
  ) {
    return await this.queryRepo.getPaginatedUsers(config);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  public async createUser(@Body() dto: UserInput) {
    return await this.service.createUser(dto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteUser(@Param('id') userId: string) {
    return await this.service.deleteUser(userId);
  }
}
