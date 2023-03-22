import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): ObjectId {
    try {
      return new ObjectId(value);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
