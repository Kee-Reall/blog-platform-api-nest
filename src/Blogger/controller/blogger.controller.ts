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
import { BlogInput, PostInput } from '../validators';
import { HardJwtAuthGuard, User } from '../../Infrastructure';
import { bloggerCommands, bloggerQueries } from '../useCases';
import {
  AccessTokenMeta,
  BlogFilter,
  BlogPresentationModel,
} from '../../Model';

@Controller('api/blogger/blogs')
@UseGuards(HardJwtAuthGuard)
export class BloggerController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  @Get()
  public async getBlogsForOwner(
    @User() user: AccessTokenMeta,
    @Query() filters: BlogFilter,
  ) {
    return this.queryBus.execute(
      new bloggerQueries.GetPaginatedBlogs(user.userId, filters),
    );
  }
  @Post()
  public async CreateBlog(
    @User() user: AccessTokenMeta,
    @Body() dto: BlogInput,
  ): Promise<BlogPresentationModel> {
    return this.commandBus.execute(
      new bloggerCommands.CreateBlog(user.userId, dto),
    );
  }
  @Post(':id/posts')
  public async CreatePost(
    @Param('id') blogId: string,
    @User() user: AccessTokenMeta,
    @Body() dto: PostInput,
  ) {
    return this.commandBus.execute(
      new bloggerCommands.CreatePost(user.userId, blogId, dto),
    );
  }
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async UpdateBlog() {
    return;
  }
  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async UpdatePost() {
    return;
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async DeleteBlog() {
    return;
  }
  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async DeletePost() {
    return;
  }
}
