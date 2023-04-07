import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { command, query } from '../useCases';
import { IsBlogBanByCommentGuard } from '../guards';
import { CommentInput, LikeInput } from '../validators';
import { JwtGuard, Meta, SoftJwtGuard } from '../../Base';
import {
  AccessTokenMeta,
  CommentPresentationModel,
  SoftGuardMeta,
  VoidPromise,
  WithLike,
} from '../../Model';

@Controller('api/comments/:id')
@UseGuards(IsBlogBanByCommentGuard)
export class CommentsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  @Get()
  @UseGuards(SoftJwtGuard)
  public async getComment(
    @Param('id') commentId: string,
    @Meta() meta: SoftGuardMeta,
  ): Promise<WithLike<CommentPresentationModel>> {
    return await this.queryBus.execute(
      new query.GetComment(meta.userId, commentId),
    );
  }

  @Delete()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteComment(
    @Param('id') commentId: string,
    @Meta() meta: AccessTokenMeta,
  ): VoidPromise {
    return await this.commandBus.execute(
      new command.DeleteComment(meta.userId, commentId),
    );
  }

  @Put()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateComment(
    @Param('id') commentId: string,
    @Meta() meta: AccessTokenMeta,
    @Body() dto: CommentInput,
  ): VoidPromise {
    return await this.commandBus.execute(
      new command.UpdateComment(meta.userId, commentId, dto.content),
    );
  }

  @Put('like-status')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async likeComment(
    @Param('id') commentId: string,
    @Meta() meta: AccessTokenMeta,
    @Body() dto: LikeInput,
  ) {
    return await this.commandBus.execute(
      new command.LikeComment(meta.userId, commentId, dto.likeStatus),
    );
  }
}
