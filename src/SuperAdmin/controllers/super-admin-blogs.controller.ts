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
import { BasicAuthGuard } from '../guard';
import { MatchMongoIdPipe } from '../../Blogger/pipes';
import { adminCommand, adminQuery } from '../useCases';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
  VoidPromise,
  WithOwnerInfo,
} from '../../Model';
import { BanInput } from '../validators';

@Controller('/api/sa/blogs')
@UseGuards(BasicAuthGuard)
export class SuperAdminBlogsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public async getBlogsForAdmin(
    @Query() filter: BlogFilter,
  ): Promise<PaginatedOutput<WithOwnerInfo<BlogPresentationModel>>> {
    return await this.queryBus.execute(
      new adminQuery.GetPaginatedBlogs(filter),
    );
  }

  @Put(':blogId/bind/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async bindBlog(
    @Param('blogId', MatchMongoIdPipe) blogId: string,
    @Param('userId', MatchMongoIdPipe) userId: string,
  ): VoidPromise {
    return await this.commandBus.execute(
      new adminCommand.BindBlog(userId, blogId),
    );
  }

  @Put(':blogId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banBlog(
    @Param('blogId', MatchMongoIdPipe) blogId: string,
    @Body() dto: BanInput,
  ) {
    return await this.commandBus.execute(
      new adminCommand.BanBlog(blogId, dto.isBanned),
    );
  }
}
