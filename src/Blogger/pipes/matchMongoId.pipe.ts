import { ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

export class MatchMongoIdPipe {
  public transform(value: string, metadata: ArgumentMetadata): string {
    if (!isMongoId(value)) {
      throw new NotFoundException();
    }
    return value;
  }
}
