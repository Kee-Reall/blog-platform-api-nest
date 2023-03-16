import { BlogsQueryPipe } from '../../src/blogs/pipes/blogs.query.pipe';

describe('BlogsPipe', () => {
  it('should be defined', () => {
    expect(new BlogsQueryPipe()).toBeDefined();
  });
});
