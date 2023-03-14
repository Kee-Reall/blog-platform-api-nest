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
import { PostsQueryRepository } from './repos';
import {
  CommentConfigFabric,
  CommentsByPost,
  PostsQueryPipe,
} from './pipes/posts.query.pipe';
import { PostInput, LikeInput } from './validators/';
import {
  BasicAuthGuard,
  HardJwtAuthGuard,
  SoftJwtAuthGuard,
  User,
} from '../helpers';
import {
  AccessTokenMeta,
  IPaginationConfig,
  NullableKey,
  PaginatedOutput,
  PostPresentationModel,
  VoidPromise,
  WithExtendedLike,
} from '../Model';

@Controller('api/posts')
export class PostsController {
  constructor(
    private service: PostsService,
    private queryRepo: PostsQueryRepository,
  ) {}

  @Get()
  @UseGuards(SoftJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getAllPosts(
    @Query(PostsQueryPipe) config: IPaginationConfig,
    @User() user: NullableKey<AccessTokenMeta>,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    console.log('user id: ', user);
    return await this.queryRepo.getPaginatedPosts(config, user.userId);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async createPost(@Body() pojo: PostInput) {
    return await this.service.createPost(pojo);
  }

  @Get(':id')
  @UseGuards(SoftJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getPostById(
    @Param('id') postId: string,
    @User() meta: AccessTokenMeta,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    return await this.queryRepo.findPostByIdWithLike(postId, meta.userId);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost(
    @Param('id') postId: string,
    @Body() dto: PostInput,
  ): VoidPromise {
    return await this.service.updatePost(postId, dto);
  }

  @Put(':id/like-status')
  @UseGuards(HardJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async likePost(
    @Param('id') postId: string,
    @User() meta: AccessTokenMeta,
    @Body() dto: LikeInput,
  ) {
    return this.service.likePost(postId, dto.likeStatus, meta.userId);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost(@Param('id') postId: string): VoidPromise {
    return await this.service.deletePost(postId);
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
