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
import { PostsQueryRepository } from './repos/posts.query.repository';
import {
  CommentConfigFabric,
  CommentsByPost,
  PostsQueryPipe,
} from './pipes/posts.query.pipe';
import { PostInput } from './validators/post.validator';
import { BasicAuthGuard } from '../helpers';
import {
  IPaginationConfig,
  PaginatedOutput,
  PostPresentationModel,
  VoidPromise,
  WithExtendedLike,
} from '../Model';

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

  @Post()
  @UseGuards(BasicAuthGuard)
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

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost(
    @Param('id') postId: string,
    @Body() pojo: PostInput,
  ): VoidPromise {
    return await this.postService.updatePost(postId, pojo);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
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
