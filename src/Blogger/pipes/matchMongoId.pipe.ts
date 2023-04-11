import {
  ArgumentMetadata,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class MatchMongoIdPipe implements PipeTransform {
  public transform(value: string, metadata: ArgumentMetadata): string {
    if (!isMongoId(value)) {
      throw new NotFoundException();
    }
    return value;
  }
}
