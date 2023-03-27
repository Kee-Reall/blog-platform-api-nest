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
import { MatchMongoIdPipe } from '../pipes';
import { BlogInput, PostInput } from '../validators';
import { HardJwtAuthGuard, User } from '../../Infrastructure';
import { bloggerCommands, bloggerQueries } from '../useCases';
import {
  AccessTokenMeta,
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
  PostPresentationModel,
  VoidPromise,
  WithExtendedLike,
} from '../../Model';

@Controller('api/blogger/blogs')
@UseGuards(HardJwtAuthGuard)
export class BloggerController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  @Get()
  public async getBlogsForOwner(
    @User() user: AccessTokenMeta,
    @Query() filters: BlogFilter,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.queryBus.execute(
      new bloggerQueries.GetPaginatedBlogs(user.userId, filters),
    );
  }

  @Post()
  public async CreateBlog(
    @User() user: AccessTokenMeta,
    @Body() dto: BlogInput,
  ): Promise<BlogPresentationModel> {
    return await this.commandBus.execute(
      new bloggerCommands.CreateBlog(user.userId, dto),
    );
  }

  @Post(':id/posts')
  public async CreatePost(
    @Param('id') blogId: string,
    @User() user: AccessTokenMeta,
    @Body() dto: PostInput,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    return await this.commandBus.execute(
      new bloggerCommands.CreatePost(user.userId, blogId, dto),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async UpdateBlog(
    @Param('id') blogId: string,
    @User() user: AccessTokenMeta,
    @Body() dto: BlogInput,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.UpdateBlog(user.userId, blogId, dto),
    );
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async UpdatePost(
    @Param('blogId', MatchMongoIdPipe) blogId: string,
    @Param('postId', MatchMongoIdPipe) postId: string,
    @User() user: AccessTokenMeta,
    @Body() dto: PostInput,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.UpdatePost(user.userId, blogId, postId, dto),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async DeleteBlog(
    @Param('id') blogId: string,
    @User() user: AccessTokenMeta,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.DeleteBlog(user.userId, blogId),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async DeletePost(
    @Param('blogId', MatchMongoIdPipe) blogId: string,
    @Param('postId', MatchMongoIdPipe) postId: string,
    @User() user: AccessTokenMeta,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.DeletePost(user.userId, blogId, postId),
    );
  }
}
