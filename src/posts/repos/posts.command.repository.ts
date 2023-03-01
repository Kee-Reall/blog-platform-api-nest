import { Repository } from '../../helpers/classes/repository.class';
import { Injectable } from '@nestjs/common';
import { Post, PostDocument } from '../../Model/Schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostsCommandRepository extends Repository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    super();
  }

  public async savePost(post: PostDocument): Promise<boolean> {
    return await this.save(post);
  }

  public async deletePost(id: string) {
    return await this.deleteUsingId(this.postModel, id);
  }
}
