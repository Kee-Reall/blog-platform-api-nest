import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../Base';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MatchMongoIdPipe } from '../pipes';
import { BunUserForBlogInput } from '../validators';
import { VoidPromise } from '../../Model';

type typeUserFilterLater = any;

@Controller('api/blogger/users')
@UseGuards(JwtGuard)
export class BloggerUsersController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get('blog/:id')
  @HttpCode(HttpStatus.OK)
  public async getBannedUsers(
    @Param('id', MatchMongoIdPipe) blogId: string,
    @Query() filter: typeUserFilterLater,
  ) {
    return;
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banUserForBlog(
    @Param('id', MatchMongoIdPipe) userId: string,
    @Body() dto: BunUserForBlogInput,
  ): VoidPromise {
    return;
  }
}
