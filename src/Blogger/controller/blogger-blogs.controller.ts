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
import { JwtGuard, Meta } from '../../Base';
import { MatchMongoIdPipe } from '../pipes';
import { BlogInput, PostInput } from '../validators';
import { bloggerCommands, bloggerQueries } from '../useCases';
import {
  AccessTokenMeta,
  BlogFilter,
  BlogPresentationModel,
  CommentsFilter,
  PaginatedOutput,
  PostPresentationModel,
  VoidPromise,
  WithExtendedLike,
} from '../../Model';

@Controller('api/blogger/blogs')
@UseGuards(JwtGuard)
export class BloggerBlogsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  @Get()
  public async getBlogsForOwner(
    @Meta() user: AccessTokenMeta,
    @Query() filters: BlogFilter,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    return await this.queryBus.execute(
      new bloggerQueries.GetPaginatedBlogs(user.userId, filters),
    );
  }

  @Get('comments')
  public async getCommentsForBlogger(
    @Meta() meta: AccessTokenMeta,
    @Query() filters: CommentsFilter,
  ) {
    return await this.queryBus.execute(
      new bloggerQueries.GetCommentsForBlogger(meta.userId, filters),
    );
  }
  @Post()
  public async createBlog(
    @Meta() user: AccessTokenMeta,
    @Body() dto: BlogInput,
  ): Promise<BlogPresentationModel> {
    return await this.commandBus.execute(
      new bloggerCommands.CreateBlog(user.userId, dto),
    );
  }

  @Post(':id/posts')
  public async createPost(
    @Param('id') blogId: string,
    @Meta() tknMeta: AccessTokenMeta,
    @Body() dto: PostInput,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    return await this.commandBus.execute(
      new bloggerCommands.CreatePost(tknMeta.userId, blogId, dto),
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateBlog(
    @Param('id') blogId: string,
    @Meta() tknMeta: AccessTokenMeta,
    @Body() dto: BlogInput,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.UpdateBlog(tknMeta.userId, blogId, dto),
    );
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost(
    @Param('blogId', MatchMongoIdPipe) blogId: string,
    @Param('postId', MatchMongoIdPipe) postId: string,
    @Meta() tknMeta: AccessTokenMeta,
    @Body() dto: PostInput,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.UpdatePost(tknMeta.userId, blogId, postId, dto),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteBlog(
    @Param('id') blogId: string,
    @Meta() tknMeta: AccessTokenMeta,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.DeleteBlog(tknMeta.userId, blogId),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost(
    @Param('blogId', MatchMongoIdPipe) blogId: string,
    @Param('postId', MatchMongoIdPipe) postId: string,
    @Meta() tknMeta: AccessTokenMeta,
  ): VoidPromise {
    return await this.commandBus.execute(
      new bloggerCommands.DeletePost(tknMeta.userId, blogId, postId),
    );
  }
}
