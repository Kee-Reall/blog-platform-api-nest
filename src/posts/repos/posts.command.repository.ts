import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Repository } from '../../helpers/classes/repository.class';
import { Post, PostDocument } from '../../Model';

@Injectable()
export class PostsCommandRepository extends Repository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    super();
  }

  public async savePost(post: PostDocument): Promise<boolean> {
    return await this.saveEntity(post);
  }

  public async deletePost(id: string) {
    return await this.deleteUsingId(this.postModel, id);
  }
}
