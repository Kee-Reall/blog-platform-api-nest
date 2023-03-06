import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogLogicModel, BlogPresentationModel } from '../Type/blogs.types';
import { MessageENUM } from '../../helpers/enums/message.enum';
import { ObjectId } from 'mongodb';
import { deleteHidden } from '../../helpers/functions/deleteHidden.function';
import { HydratedDocument } from 'mongoose';
import { NullablePromise } from '../Type/promise.types';

export type BlogDocument = HydratedDocument<BlogPresentationModel>;

@Schema({
  toJSON: {
    getters: true,
    transform: deleteHidden,
  },
})
export class Blog implements Omit<BlogLogicModel, '_id'> {
  private _id: ObjectId;
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

  get id(): string {
    return this._id.toHexString();
  }
}
export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.statics = {
  async NullableFindById(id: string | ObjectId): NullablePromise<BlogDocument> {
    try {
      return await this.findById(id);
    } catch (e) {
      return null;
    }
  },
  async isBlogExist(id: string | ObjectId) {
    try {
      const _id = id instanceof ObjectId ? id : new ObjectId(id);
      return (await this.countDocuments({ _id })) > 0;
    } catch (e) {
      return false;
    }
  },
};
export interface BlogSchemaMethods {
  NullableFindById: (id: string | ObjectId) => NullablePromise<BlogDocument>;
  isBlogExist: (id: string | ObjectId) => Promise<boolean>;
}
