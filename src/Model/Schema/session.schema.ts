import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SessionJwtMeta, SessionMetadata } from '../Type/';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ versionKey: false })
export class Session implements SessionMetadata {
  _id: ObjectId;
  @Prop({ required: true, readonly: true, ref: 'User' })
  userId: ObjectId;

  @Prop({ default: () => new Date() })
  updateDate: Date;

  @Prop({ type: [String], default: [] })
  ip: string[];

  @Prop({ default: null, nullable: true })
  title: string;

  get deviceId() {
    return this._id.toHexString();
  }

  public getMetaForToken(): SessionJwtMeta {
    return {
      deviceId: this._id.toHexString(),
      updateDate: this.updateDate.toISOString(),
      userId: this.userId.toHexString(),
    };
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.methods = {
  getMetaForToken: Session.prototype.getMetaForToken,
};