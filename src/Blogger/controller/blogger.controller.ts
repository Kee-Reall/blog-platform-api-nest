import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HardJwtAuthGuard, User } from '../../Infrastructure';
import {
  AccessTokenMeta,
  BlogFilter,
  BlogPresentationModel,
} from '../../Model';
import { BlogInput } from '../validators/blog.validator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { bloggerCommands } from '../useCases/commands';

@Controller('api/blogger/blogs')
@UseGuards(HardJwtAuthGuard)
export class BloggerController {
  constructor(private queryBas: QueryBus, private commandBus: CommandBus) {}
  @Get()
  public async getBlogsForOwner(
    @User() user: AccessTokenMeta,
    @Query() filters: BlogFilter,
  ) {
    return;
  }
  @Post()
  public async CreateBlog(
    @User() user: AccessTokenMeta,
    @Body() dto: BlogInput,
  ): Promise<BlogPresentationModel> {
    console.log('we get there');
    return this.commandBus.execute(
      new bloggerCommands.CreateBlog(user.userId, dto),
    );
  }
  @Post(':id/posts')
  public async CreatePost() {
    return;
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
