import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MessageENUM } from '../../helpers';
import { LikeModel, LikeStatus } from '../Type';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like implements Omit<LikeModel, 'likeStatus'> {
  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD], readonly: true })
  public target: ObjectId;
  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD], readonly: true })
  public userId: ObjectId;
  @Prop({ required: [true, MessageENUM.REQUIRED_FIELD] }) public login: string;
  @Prop({
    required: true,
    default: () => new Date(),
    transform: (date: Date): string => date.toISOString(),
  })
  public addedAt: Date;
  @Prop({ default: 'None', enum: ['Like', 'Dislike', 'None'] })
  public likeStatus: string;

  public async setLikeStatus(likeStatus: LikeStatus) {
    if (this.likeStatus === likeStatus) {
      return;
    }
    this.likeStatus = likeStatus;
    const that = this as unknown as LikeDocument;
    await that.save();
    return;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.methods = {
  setLikeStatus: Like.prototype.setLikeStatus,
};
