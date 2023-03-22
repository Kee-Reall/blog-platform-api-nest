import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { deleteHiddenAndPostId, MessageENUM } from '../../Helpers';
import { CommentatorInfoType, CommentsLogicModel, VoidPromise } from '../Type';

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

@Schema({ toJSON: { getters: true, transform: deleteHiddenAndPostId } })
export class Comment implements Omit<CommentsLogicModel, '_id'> {
  _id: ObjectId;

  @Prop({ required: true, readonly: true, default: () => ({}) })
  commentatorInfo: CommentatorInfo;

  @Prop({
    trim: true,
    required: [true, MessageENUM.REQUIRED_FIELD],
    maxLength: [300, MessageENUM.LENGTH],
    minLength: [20, MessageENUM.LENGTH],
  })
  content: string;

  @Prop({ required: true, default: () => new Date(), readonly: true })
  createdAt: Date;

  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD], readonly: true })
  postId: ObjectId;

  get id() {
    return this._id.toHexString();
  }

  public async changeContent(content: string): VoidPromise {
    if (this.content === content) {
      return;
    }
    this.content = content;
    const that = this as CommentDocument;
    await that.save();
  }

  public isOwner(userId: string): boolean {
    return this.commentatorInfo.userId.toHexString() === userId;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.methods = {
  changeContent: Comment.prototype.changeContent,
  isOwner: Comment.prototype.isOwner,
};
