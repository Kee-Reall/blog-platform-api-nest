import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  PostInputModel,
  PostPresentationModel,
} from '../Model/Type/posts.types';
import { PostsQueryRepository } from './repos/posts.query.repository';
import { PostFilters } from '../Model/Type/query.types';

@Controller('api/posts')
export class PostsController {
  constructor(
    private postService: PostsService,
    private queryRepo: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllPosts(@Query() query: PostFilters) {
    return await this.queryRepo.getPaginatedPosts(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getPostById(
    @Param('id') postId: string,
  ): Promise<PostPresentationModel> {
    return await this.queryRepo.findPostById(postId);
  }
}
