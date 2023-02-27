import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Like {
  @Prop({ required: true, readonly: true }) public target: string;
  @Prop({ required: true, readonly: true }) public userId: string;
  @Prop({ required: true }) public login: string;
  @Prop({ required: true, default: new Date() }) public AddedAt: Date;
  @Prop({ default: 'None', enum: ['Like', 'Dislike', 'None'] })
  public LikeStatus: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
