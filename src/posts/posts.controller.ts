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
import { PostsService } from './posts.service';
import { PostPresentationModel } from '../Model/Type/posts.types';
import { PostsQueryRepository } from './repos/posts.query.repository';
import { WithExtendedLike } from '../Model/Type/likes.types';
import {
  IPaginationConfig,
  PaginatedOutput,
} from '../Model/Type/pagination.types';
import { VoidPromise } from '../Model/Type/promise.types';
import {
  CommentConfigFabric,
  CommentsByPost,
  PostsQueryPipe,
} from './pipes/posts.query.pipe';
import { PostInput } from './validators/post.validator';
import { BasicAuth } from '../helpers/classes/basicAuth.guard';

@Controller('api/posts')
export class PostsController {
  constructor(
    private postService: PostsService,
    private queryRepo: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAllPosts(
    @Query(PostsQueryPipe) config: IPaginationConfig,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    return await this.queryRepo.getPaginatedPosts(config);
  }

  @UseGuards(BasicAuth)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createPost(@Body() pojo: PostInput) {
    return await this.postService.createPost(pojo);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getPostById(
    @Param('id') postId: string,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    return await this.queryRepo.findPostById(postId);
  }

  @UseGuards(BasicAuth)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost(
    @Param('id') postId: string,
    @Body() pojo: PostInput,
  ): VoidPromise {
    return await this.postService.updatePost(postId, pojo);
  }
  @UseGuards(BasicAuth)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost(@Param('id') postId: string): VoidPromise {
    return await this.postService.deletePost(postId);
  }

  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  public async getCommentsForPost(
    @Query(CommentsByPost) configFabric: CommentConfigFabric,
    @Param('id') postId: string,
  ) {
    return await this.queryRepo.getPaginatedComments(configFabric(postId));
  }
}
