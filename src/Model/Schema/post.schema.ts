import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostLogicModel, PostPresentationModel } from '../Type/posts.types';
import * as mongoose from 'mongoose';
import { MessageENUM } from '../../helpers/enums/message.enum';
import { ObjectId } from 'mongodb';
import { deleteHidden } from '../../helpers/functions/deleteHidden.function';

export type PostDocument = mongoose.HydratedDocument<PostPresentationModel>;

@Schema({
  toJSON: {
    getters: true,
    transform: deleteHidden,
  },
})
export class Post implements Omit<PostLogicModel, '_id'> {
  private _id: ObjectId;
  @Prop({
    trim: true,
    minLength: 1,
    maxLength: 1000,
    required: true,
  })
  content: string;

  @Prop({
    default: new Date(),
    readOnly: true,
    transform: (date: Date): string => date.toISOString(),
  })
  createdAt: Date;

  @Prop({ trim: true, minLength: 1, maxLength: 100, required: true })
  shortDescription: string;
  @Prop({ required: true, maxlength: 30, minlength: 1 })
  title: string;

  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
  })
  public blogId: ObjectId;
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
  })
  public blogName: string;

  get id(): string {
    return this._id.toHexString();
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
