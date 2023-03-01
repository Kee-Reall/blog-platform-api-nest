import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

@Controller('api/comments')
export class CommentsController {
  // future features
  @Get(':id')
  @HttpCode(HttpStatus.NOT_FOUND)
  public getCommentById(@Param('id') commentId: string) {
    return;
  }
}
