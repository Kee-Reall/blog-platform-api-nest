import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Transformer } from '../../Base';

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): ObjectId {
    const objectId = Transformer.stringToObjectId(value);
    if (!objectId) {
      throw new NotFoundException();
    }
    return objectId;
  }
}
