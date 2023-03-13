import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { MessageENUM, deleteHidden } from '../../helpers/';
import {
  PostLogicModel,
  PostPresentationModel,
  NullablePromise,
} from '../Type';

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
    default: () => new Date(),
    readOnly: true,
    transform: (date: Date): string => date.toISOString(),
  })
  createdAt: Date;

  @Prop({ trim: true, minLength: 1, maxLength: 100, required: true })
  shortDescription: string;
  @Prop({ required: true, maxlength: 30, minlength: 1, trim: true })
  title: string;

  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    trim: true,
  })
  public blogId: ObjectId;
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    trim: true,
  })
  public blogName: string;

  get id(): string {
    return this._id.toHexString();
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics = {
  async NullableFindById(id: string | ObjectId): NullablePromise<PostDocument> {
    try {
      return await this.findById(id);
    } catch (e) {
      return null;
    }
  },
  async isPostExist(id: string | ObjectId): Promise<boolean> {
    try {
      const _id = id instanceof ObjectId ? id : new ObjectId(id);
      return (await this.countDocuments({ _id })) > 0;
    } catch (e) {
      return false;
    }
  },
};

export interface PostSchemaMethods {
  NullableFindById: (id: string | ObjectId) => NullablePromise<PostDocument>;
  isBlogExist: (id: string | ObjectId) => Promise<boolean>;
}
