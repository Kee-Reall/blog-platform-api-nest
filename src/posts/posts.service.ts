import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  public sayHello() {
    return 'hello';
  }
}
