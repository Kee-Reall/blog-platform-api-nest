import { LikePost, LikePostUseCase } from './like-post.service';
import { LikeComment, LikeCommentUseCase } from './like-comment.service';
import { CreateComment, CreateCommentUseCase } from './create-comment.service';
import { DeleteComment, DeleteCommentUseCase } from './delete-comment.service';
import { UpdateComment, UpdateCommentUseCase } from './update-comment.service';

export const commandUseCases = [
  DeleteCommentUseCase,
  CreateCommentUseCase,
  LikePostUseCase,
  LikeCommentUseCase,
  UpdateCommentUseCase,
];

export const command = {
  DeleteComment,
  LikePost,
  CreateComment,
  UpdateComment,
  LikeComment,
};
