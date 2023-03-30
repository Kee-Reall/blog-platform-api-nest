import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import {
  NullablePromise,
  SessionFilter,
  SessionJwtMeta,
  SessionMetadata,
  VoidPromise,
} from '../Type/';

export type SessionDocument = HydratedDocument<Session>;

@Schema({
  versionKey: false,
  toJSON: {
    getters: true,
    transform: (doc) => {
      return {
        ip: doc.ip.at(-1),
        title: doc.title,
        lastActiveDate: doc.updateDate,
        deviceId: doc._id.toHexString(),
      };
    },
  },
})
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
  public setLastIp(ip: string): void {
    const idx = this.ip.indexOf(ip);
    if (idx === -1) {
      this.ip.push(ip);
    } else {
      this.ip.splice(idx, 1);
      this.ip.push(ip);
    }
  }

  public async killYourself() {
    const model = this.constructor as Model<SessionDocument>;
    await model.deleteOne(this);
  }

  public setNewUpdateDate(): void {
    this.updateDate = new Date();
  }

  static async findUsersSessions(
    id: string,
  ): NullablePromise<SessionDocument[]> {
    try {
      const userId = new ObjectId(id);
      const that = this as unknown as Model<SessionDocument>;
      return await that.find({ userId });
    } catch (e) {
      console.error('failed findUsersSessions at session static ');
      return [];
    }
  }

  static async killAllSessionsExcludeCurrent(currentSession: SessionFilter) {
    try {
      const filter = {
        usedId: new ObjectId(currentSession.userId),
        _id: { $ne: new ObjectId(currentSession.deviceId) },
      };
      const that = this as unknown as Model<SessionDocument>;
      await that.deleteMany(filter);
      return;
    } catch (e) {
      return;
    }
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.methods = {
  setLastIp: Session.prototype.setLastIp,
  killYourself: Session.prototype.killYourself,
  getMetaForToken: Session.prototype.getMetaForToken,
  setNewUpdateDate: Session.prototype.setNewUpdateDate,
};

SessionSchema.statics = {
  findUsersSessions: Session.findUsersSessions,
  killAllSessionsExcludeCurrent: Session.killAllSessionsExcludeCurrent,
};

export interface SessionModelStatics {
  findUsersSessions: (id: string) => NullablePromise<SessionDocument[]>;
  killAllSessionsExcludeCurrent: (currentSession: SessionFilter) => VoidPromise;
}
