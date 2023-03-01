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
import { VoidPromise } from '../Model/Type/promise.types';

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
  @HttpCode(HttpStatus.CREATED)
  public async createPost(@Body() pojo: PostInputModel) {
    return await this.postService.createPost(pojo);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getPostById(
    @Param('id') postId: string,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    return await this.queryRepo.findPostById(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost(
    @Param('id') postId: string,
    @Body() pojo: PostInputModel,
  ): VoidPromise {
    return await this.postService.updatePost(postId, pojo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost(@Param('id') postId: string): VoidPromise {
    return await this.postService.deletePost(postId);
  }

  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  public async getCommentsForPost(@Param('id') postId: string) {
    return await this.queryRepo.getPaginatedComments(postId);
  }
}
