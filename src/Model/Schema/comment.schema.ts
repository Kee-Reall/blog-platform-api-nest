import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { UserCommentator } from '../Type/likes.types';
import { MessageENUM } from '../../helpers/enums/message.enum';

@Schema({ versionKey: false, _id: false })
export class CommentatorInfo implements UserCommentator {
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    readOnly: [true, MessageENUM.READONLY],
  })
  userId: ObjectId;
  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD] })
  userLogin: string;
}
