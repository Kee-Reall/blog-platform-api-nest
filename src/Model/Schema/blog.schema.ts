import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogLogicModel } from '../Type/blogs.types';
import { urlRegex } from '../../helpers/variables/urlRegex';
import { MessageENUM } from '../../helpers/enums/message';
import { ObjectId } from 'mongodb';
import { deleteHidden } from '../../helpers/functions/deleteHidden.function';
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
    validate: [urlRegex, MessageENUM.NOT_URL],
    trim: true,
  })
  public websiteUrl: string;
  @Prop({ readOnly: true, default: new Date() }) private _createdAt: Date;
  @Prop({ default: false }) public isMembership: boolean;

  get id(): string {
    return this._id.toHexString();
  }
  get createdAt(): string {
    return this._createdAt.toISOString();
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
