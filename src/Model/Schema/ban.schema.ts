import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserForBloggerPresentation } from '../Type';

export type BanDocument = HydratedDocument<Ban>;

/*in ban list for blogger. Global ban contain in user*/

@Schema()
export class Ban {
  @Prop({ required: true, readonly: true, ref: 'User' })
  public ownerId: ObjectId;
  @Prop({ required: true, readonly: true, ref: 'User' })
  public bannedUserId: ObjectId;
  @Prop({ required: true, readonly: true }) public bannedUserLogin: 'string';
  @Prop({ required: true, readonly: true, ref: 'Blog' })
  public blogId: ObjectId;
  @Prop({ default: true }) public isBanned: boolean;
  @Prop({ required: true }) public banReason: string;
  @Prop({ default: () => new Date() }) public banDate: Date;

  public toPresentationModel(): UserForBloggerPresentation {
    return {
      id: this.bannedUserId,
      login: this.bannedUserLogin,
      banInfo: {
        isBanned: this.isBanned,
        banDate: this.banDate,
        banReason: this.banReason,
      },
    };
  }
}

export const BanSchema = SchemaFactory.createForClass(Ban);

BanSchema.methods = {
  toPresentationModel: Ban.prototype.toPresentationModel,
};
