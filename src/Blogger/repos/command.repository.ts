import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Repository } from '../../Base';
import { ErrorENUM } from '../../Helpers';
import {
  Blog,
  BlogDocument,
  Post,
  PostDocument,
  User,
  UserDocument,
  VoidPromise,
} from '../../Model';

@Injectable()
export class BloggerCommandRepository extends Repository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {
    super();
  }
  public async saveBlog(blog: BlogDocument): Promise<boolean> {
    return this.saveEntity(blog);
  }

  async savePost(post: PostDocument): Promise<boolean> {
    return this.saveEntity(post);
  }

  public async deleteBlog(id: string): Promise<boolean> {
    return await this.deleteUsingId(this.blogModel, id);
  }

  public async deletePostsByBlogId(_id: ObjectId): VoidPromise {
    try {
      await this.postModel.deleteMany({ blogId: _id }); // todo ты должен каскадно получить все удаленные посты, удалить их коменты, каскадн удалить все лайки к коментам и постам.
    } catch (e) {
      console.error(ErrorENUM.BROKEN_DATA + e.message ?? ErrorENUM.MESSAGE);
    } finally {
      return;
    }
  }
}
