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
import { PostsService } from '../posts.service';
import { PostsQueryRepository } from '../repos';
import { PostsQueryPipe } from '../pipes/posts.query.pipe';
import { PostInput, LikeInput, CommentInput } from '../validators';
import {
  BasicAuthGuard,
  HardJwtAuthGuard,
  SoftJwtAuthGuard,
  User,
} from '../../Infrastructure';
import {
  AccessTokenMeta,
  IPaginationConfig,
  NullableKey,
  PaginatedOutput,
  PostPresentationModel,
  SoftGuardMeta,
  VoidPromise,
  WithExtendedLike,
} from '../../Model';

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
  public async createPost(@Body() dto: PostInput) {
    return await this.service.createPost(dto);
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
  @UseGuards(SoftJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getCommentsForPost(
    @Param('id') postId: string,
    @User() meta: SoftGuardMeta,
    @Query() inputQuery,
  ) {
    return await this.queryRepo.getPaginatedComments(
      inputQuery,
      postId,
      meta.userId,
    );
  }

  @Post(':id/comments')
  @UseGuards(HardJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  public async createCommentForPost(
    @Param('id') postId: string,
    @User() meta: AccessTokenMeta,
    @Body() dto: CommentInput,
  ) {
    return await this.service.createComment(postId, dto.content, meta.userId);
  }
}
