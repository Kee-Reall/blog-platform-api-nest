import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { MessageENUM, deleteHidden } from '../../Helpers';
import { BlogLogicModel, BlogOwnerInfoModel, NullablePromise } from '../Type';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ _id: false, versionKey: false })
export class BlogOwnerInfo implements BlogOwnerInfoModel {
  @Prop({ required: true, readonly: true })
  userId: ObjectId;
  @Prop({ required: true })
  userLogin: string;
}

@Schema({
  toJSON: {
    getters: true,
    transform: deleteHidden,
  },
})
export class Blog implements Required<BlogLogicModel> {
  public _id: ObjectId;
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    minlength: [1, MessageENUM.LENGTH],
    maxlength: [15, MessageENUM.LENGTH],
    trim: true,
  })
  public name: string;
  @Prop({
    required: [true, 'description is required'],
    minlength: [1, MessageENUM.LENGTH],
    maxlength: [500, MessageENUM.LENGTH],
    trim: true,
  })
  public description: string;
  @Prop({
    required: [true, MessageENUM.REQUIRED_FIELD],
    minlength: [1, MessageENUM.LENGTH],
    maxlength: [300, MessageENUM.LENGTH],
    trim: true,
  })
  public websiteUrl: string;
  @Prop({
    readOnly: true,
    default: () => new Date(),
    transform: (date: Date): string => date.toISOString(),
  })
  public createdAt: Date;
  @Prop({ default: false }) public isMembership: boolean;

  @Prop({ required: true, readonly: true })
  public _blogOwnerInfo: BlogOwnerInfo;

  @Prop({ default: false }) public _isOwnerBanned: boolean;

  get id(): string {
    return this._id.toHexString();
  }

  static async NullableFindById(
    id: string | ObjectId,
  ): NullablePromise<BlogDocument> {
    try {
      const that = this as unknown as Model<BlogDocument>;
      return await that.findById(id);
    } catch (e) {
      return null;
    }
  }

  static async isBlogExist(id: string | ObjectId) {
    try {
      const that = this as unknown as Model<BlogDocument>;
      const _id = id instanceof ObjectId ? id : new ObjectId(id);
      return (await that.countDocuments({ _id })) > 0;
    } catch (e) {
      return false;
    }
  }
}
export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.statics = {
  NullableFindById: Blog.NullableFindById,
  isBlogExist: Blog.isBlogExist,
};
export interface BlogStaticMethods {
  NullableFindById: (id: string | ObjectId) => NullablePromise<BlogDocument>;
  isBlogExist: (id: string | ObjectId) => Promise<boolean>;
}
