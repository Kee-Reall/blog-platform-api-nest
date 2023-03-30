import { ObjectId } from 'mongodb';
import {
  BlogDocument,
  Nullable,
  PostDocument,
  UserDocument,
} from '../../../Model';

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
}
