import { ObjectId } from 'mongodb';
import {
  BlogDocument,
  Nullable,
  PostDocument,
  UserDocument,
} from '../../src/Model';
import { BloggerService } from '../../src/Blogger/useCases/commands/blogger.service';

class BloggerServiceMock extends BloggerService {
  constructor() {
    super();
  }

  public isOwnerPub(userId: string, ownerId: ObjectId): boolean {
    return this.isOwner(userId, ownerId);
  }

  public isPostBelongToBlogPub(
    post: PostDocument,
    blog: BlogDocument,
  ): boolean {
    return this.isPostBelongToBlog(post, blog);
  }
  public isAllFoundPub(
    entities: [
      Nullable<UserDocument>,
      Nullable<BlogDocument>,
      Nullable<PostDocument>,
    ],
  ): boolean {
    return this.isAllFound(entities);
  }
}

// this test check for shared logic of inheritors of BloggerService.

describe('test shared logic in blogger useCases', () => {
  const serviceMock = new BloggerServiceMock();

  describe('mock.isOwner()  method tests', () => {
    const obj1 = new ObjectId();
    const obj2 = new ObjectId();
    it.each([
      { input: { userId: obj1.toHexString(), ownerId: obj1 }, expect: true },
      { input: { userId: obj1.toHexString(), ownerId: obj2 }, expect: false },
      { input: { userId: 'fqfeqgwr', ownerId: obj2 }, expect: false },
      { input: { userId: '', ownerId: obj2 }, expect: false },
      { input: { userId: obj2.toHexString(), ownerId: obj1 }, expect: false },
    ])('should return expected value', function (scene) {
      expect(
        serviceMock.isOwnerPub(scene.input.userId, scene.input.ownerId),
      ).toBe(scene.expect);
    });
  });

  describe('mock.isPostBelongToBlog() method tests', () => {
    const post1: Partial<PostDocument> = {
      blogId: new ObjectId(),
    };
    const blog1: Partial<BlogDocument> = {
      id: post1.blogId.toHexString(), //we have id getter in original class
    };
    it('shuold return true', () => {
      expect(
        serviceMock.isPostBelongToBlogPub(
          post1 as PostDocument,
          blog1 as BlogDocument,
        ),
      ).toBe(true);
    });
    it('should return false', () => {
      expect(
        serviceMock.isPostBelongToBlogPub(
          <PostDocument>{ blogId: new ObjectId() },
          <BlogDocument>{ id: new ObjectId().toHexString() },
        ),
      ).toBe(false);
    });

    describe('test mock.isAllFound', () => {
      const user = { name: 'fafa' } as unknown as UserDocument;
      const blog = { name: 'fafa' } as unknown as BlogDocument;
      const post = { name: 'fafa' } as unknown as PostDocument;
      it('should be correct', () => {
        expect(serviceMock.isAllFoundPub([user, blog, post])).toBe(true);
      });
      it.each([
        { t: [user, blog, null] },
        { t: [user, null, post] },
        { t: [null, blog, post] },
        { t: [null, null, post] },
        { t: [null, blog, null] },
        { t: [user, null, null] },
        { t: [null, null, null] },
      ])('should be incorrect', (value: any) => {
        const val = value.t as unknown as [
          Nullable<UserDocument>,
          Nullable<BlogDocument>,
          Nullable<PostDocument>,
        ];
        expect(serviceMock.isAllFoundPub(val)).toBe(false);
      });
    });
  });
});
