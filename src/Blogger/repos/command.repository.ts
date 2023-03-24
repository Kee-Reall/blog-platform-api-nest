import { Injectable } from '@nestjs/common';
import { Repository } from '../../Helpers';
import { BlogDocument } from '../../Model';

@Injectable()
export class BloggerCommandRepository extends Repository {
  constructor() {
    super();
  }
  public async saveBlog(blog: BlogDocument): Promise<boolean> {
    return this.saveEntity(blog);
  }
}
