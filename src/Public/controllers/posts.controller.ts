import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostFilter } from '../../Model';

@Controller('api/v2/posts')
export class PostsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get()
  public async getPosts(@Query() filter: PostFilter) {
    return;
  }

  @Get(':id')
  public async getPost(@Param() postId: string) {
    return;
  }

  @Get(':id/comments')
  public async getComments(@Param() postId: string) {
    return;
  }

  @Post(':id/comments')
  public async createComment(@Param() postId: string, @Body() dto) {
    return;
  }

  @Put(':id/like-status')
  public async likePost(@Param() postId: string, @Body() dto) {
    return;
  }
}
