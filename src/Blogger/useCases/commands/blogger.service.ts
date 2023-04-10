import { ObjectId } from 'mongodb';
import {
  BlogDocument,
  Nullable,
  PostDocument,
  UserDocument,
} from '../../../Model';
import { DeletePost } from './delete-post.service';
import { UpdatePost } from './update-post.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BloggerQueryRepository } from '../../repos';

export abstract class BloggerService {
  protected isOwner(userId: string, ownerId: ObjectId): boolean {
    try {
      return userId === ownerId.toHexString();
    } catch (e) {
      return false;
    }
  }

  protected isPostBelongToBlog(
    post: PostDocument,
    blog: BlogDocument,
  ): boolean {
    return blog.id === post.blogId.toHexString();
  }

  protected isAllFound(
    entities: [
      Nullable<UserDocument>,
      Nullable<BlogDocument>,
      Nullable<PostDocument>,
    ],
  ): boolean {
    for (const entt of entities) {
      if (!entt) {
        return false;
      }
    }
    return true;
  }

  protected isUserOwnBlogAndPost(
    user: UserDocument,
    blog: BlogDocument,
    post: PostDocument,
  ) {
    return (
      this.isOwner(user.id, blog._blogOwnerInfo.userId) &&
      this.isOwner(user.id, post._ownerId)
    );
  }

  protected async checkEntitiesThenGetPost(
    command: DeletePost | UpdatePost,
    repo: BloggerQueryRepository,
  ): Promise<PostDocument> {
    const entities = await Promise.all([
      repo.getUserEntity(command.userId),
      repo.getBlogEntity(command.blogId),
      repo.getPostEntity(command.postId),
    ]);
    if (!this.isAllFound(entities)) {
      throw new NotFoundException();
    }
    const [user, blog, post] = entities;
    if (blog._isOwnerBanned) {
      throw new NotFoundException();
    }
    if (!this.isPostBelongToBlog(post, blog)) {
      throw new NotFoundException();
    }
    if (!this.isUserOwnBlogAndPost(user, blog, post)) {
      throw new ForbiddenException();
    }
    return post;
  }
}
