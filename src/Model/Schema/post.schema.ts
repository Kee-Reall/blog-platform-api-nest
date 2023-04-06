import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { MessageENUM, deleteHidden } from '../../Helpers/';
import { PostLogicModel, NullablePromise } from '../Type';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  toJSON: {
    getters: true,
    transform: deleteHidden,
  },
})
export class Post implements PostLogicModel {
  public _id: ObjectId;
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
    ref: 'Blog',
  })
  public blogId: ObjectId;
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    trim: true,
  })
  public blogName: string;

  @Prop({ default: false }) public _isOwnerBanned: boolean;
  @Prop({ required: true, readonly: true, ref: 'User' })
  public _ownerId: ObjectId;
  @Prop({ default: false }) public _isBlogBanned: boolean;

  get id(): string {
    return this._id.toHexString();
  }

  static async NullableFindById(
    id: string | ObjectId,
  ): NullablePromise<PostDocument> {
    try {
      const that = this as unknown as Model<PostDocument>;
      return await that.findById(id);
    } catch (e) {
      return null;
    }
  }

  static async isPostExist(id: string | ObjectId): Promise<boolean> {
    try {
      const that = this as unknown as Model<PostDocument>;
      const _id = id instanceof ObjectId ? id : new ObjectId(id);
      return (await that.countDocuments({ _id })) > 0;
    } catch (e) {
      return false;
    }
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics = {
  NullableFindById: Post.NullableFindById,
  isPostExist: Post.NullableFindById,
};

export interface PostStaticMethods {
  NullableFindById: (id: string | ObjectId) => NullablePromise<PostDocument>;
  isBlogExist: (id: string | ObjectId) => Promise<boolean>;
}
