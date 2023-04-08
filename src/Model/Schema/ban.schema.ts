import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserForBloggerPresentation } from '../Type';

export type BanDocument = HydratedDocument<Ban>;

/*in ban list for blogger. Global ban contain in user*/

@Schema()
export class Ban {
  @Prop({ required: true, readonly: true, ref: 'User' }) ownerId: ObjectId;
  @Prop({ required: true, readonly: true, ref: 'User' }) bannedUserId: ObjectId;
  @Prop({ required: true, readonly: true }) bannedUserLogin: 'string';
  @Prop({ required: true, readonly: true, ref: 'Blog' }) blogId: ObjectId;
  @Prop({ default: true }) isBanned: boolean;
  @Prop({ required: true }) banReason: string;
  @Prop({ default: () => new Date() }) banDate: Date;

  public toPresentationModel(): UserForBloggerPresentation {
    return {
      id: this.bannedUserId.toHexString(),
      login: this.bannedUserLogin,
      banInfo: {
        isBanned: this.isBanned,
        banDate: this.banDate.toISOString(),
        banReason: this.banReason,
      },
    };
  }
}

export const BanSchema = SchemaFactory.createForClass(Ban);

BanSchema.methods = {
  toPresentationModel: Ban.prototype.toPresentationModel(),
};
