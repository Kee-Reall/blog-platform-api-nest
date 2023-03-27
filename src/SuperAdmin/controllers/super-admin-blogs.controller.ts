import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../Infrastructure';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
  VoidPromise,
  WithOwnerInfo,
} from '../../Model';
import { adminCommand, adminQuery } from '../useCases';
import { MatchMongoIdPipe } from '../../Blogger/pipes';

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
}
