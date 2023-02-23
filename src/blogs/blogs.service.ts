import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  public async hello() {
    return 'hello from blogService';
  }
}
