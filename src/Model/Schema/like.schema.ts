import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MessageENUM } from '../../helpers/enums/message.enum';
import { LikeModel } from '../Type';
import { HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';

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
}

export const LikeSchema = SchemaFactory.createForClass(Like);
