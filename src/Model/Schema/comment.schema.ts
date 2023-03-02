import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { MessageENUM } from '../../helpers/enums/message.enum';
import {
  CommentatorInfoType,
  CommentsLogicModel,
} from '../Type/comments.types';
import mongoose from 'mongoose';

export type CommentDocument = mongoose.HydratedDocument<Comment>;

@Schema({ versionKey: false, _id: false })
export class CommentatorInfo implements CommentatorInfoType {
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    readOnly: [true, MessageENUM.READONLY],
  })
  userId: ObjectId;

  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD] })
  userLogin: string;
}

@Schema()
export class Comment implements Omit<CommentsLogicModel, '_id'> {
  private _id: ObjectId;

  @Prop()
  commentatorInfo: CommentatorInfo;

  @Prop({
    trim: true,
    required: [true, MessageENUM.REQUIRED_FIELD],
    maxLength: [300, MessageENUM.LENGTH],
    minLength: [3, MessageENUM.LENGTH],
  })
  content: string;

  @Prop({ required: true, default: new Date(), readonly: true })
  createdAt: Date;

  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD], readonly: true })
  postId: ObjectId;

  get id() {
    return this._id.toHexString();
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
