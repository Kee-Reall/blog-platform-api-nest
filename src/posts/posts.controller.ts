import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  PostInputModel,
  PostPresentationModel,
} from '../Model/Type/posts.types';
import { PostsQueryRepository } from './repos/posts.query.repository';
import { PostFilters } from '../Model/Type/query.types';
import { WithExtendedLike } from '../Model/Type/likes.types';
import { PaginatedOutput } from '../Model/Type/pagination.types';

@Controller('api/posts')
export class PostsController {
  constructor(
    private postService: PostsService,
    private queryRepo: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllPosts(
    @Query() query: PostFilters,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    return await this.queryRepo.getPaginatedPosts(query);
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async createPost(@Body() pojo: PostInputModel) {
    return;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getPostById(
    @Param('id') postId: string,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    return await this.queryRepo.findPostById(postId);
  }
}
