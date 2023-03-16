import { PostsQueryPipe } from '../../src/posts/pipes/posts.query.pipe';

describe('PostsPipe', () => {
  it('should be defined', () => {
    expect(new PostsQueryPipe()).toBeDefined();
  });
});
