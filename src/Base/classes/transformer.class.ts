import { ObjectId } from 'mongodb';
import { Nullable } from '../../Model';

export class Transformer {
  static stringToObjectId(value: string): Nullable<ObjectId> {
    try {
      return new ObjectId(value);
    } catch (e) {
      return null;
    }
  }
}
