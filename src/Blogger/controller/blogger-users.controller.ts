import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { MatchMongoIdPipe } from '../pipes';
import { JwtGuard, Meta } from '../../Base';
import { bloggerCommands } from '../useCases';
import { BunUserForBlogInput } from '../validators';
import { AccessTokenMeta, VoidPromise } from '../../Model';

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
    @Meta() meta: AccessTokenMeta,
  ) {
    return;
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banUserForBlog(
    @Param('id', MatchMongoIdPipe) userId: string,
    @Body() dto: BunUserForBlogInput,
    @Meta() meta: AccessTokenMeta,
  ): VoidPromise {
    return this.commandBus.execute(
      new bloggerCommands.BanUserForBlog(meta.userId, userId, dto),
    );
  }
}
