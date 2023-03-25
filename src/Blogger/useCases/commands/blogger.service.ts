import { ObjectId } from 'mongodb';

export abstract class BloggerService {
  protected isOwner(userId: string, ownerId: ObjectId): boolean {
    try {
      return userId === ownerId.toHexString();
    } catch (e) {
      return false;
    }
  }
}
