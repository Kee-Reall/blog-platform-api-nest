import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryRepository } from '../repos';
import { JwtGuard, SoftJwtGuard, Meta } from '../../Infrastructure';
import { AccessTokenMeta, SoftGuardMeta } from '../../Model';
import { CommentInput, LikeInput } from '../validators';
import { PostsService } from '../posts.service';

@Controller('api/comments')
export class CommentsController {
  constructor(
    private queryRepo: PostsQueryRepository,
    private service: PostsService,
  ) {}

  @Get(':id')
  @UseGuards(SoftJwtGuard)
  @HttpCode(HttpStatus.OK)
  public async getCommentById(
    @Param('id') commentId: string,
    @Meta() meta: SoftGuardMeta,
  ) {
    return this.queryRepo.getCommentWithLike(commentId, meta.userId);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async createCommentForPost(
    @Param('id') commentId: string,
    @Meta() meta: AccessTokenMeta,
    @Body() dto: CommentInput,
  ) {
    return await this.service.updateComment(
      commentId,
      dto.content,
      meta.userId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @Param('id') commentId: string,
    @Meta() meta: AccessTokenMeta,
  ) {
    return await this.service.deleteComment(commentId, meta.userId);
  }

  @Put(':id/like-status')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async likeComment(
    @Param('id') commentId: string,
    @Meta() meta: AccessTokenMeta,
    @Body() dto: LikeInput,
  ) {
    return await this.service.likeComment(
      commentId,
      meta.userId,
      dto.likeStatus,
    );
  }
}
