import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { hash as genHash, genSalt } from 'bcrypt';
import { UserInputModel } from '../Type/users.types';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: {
    getters: true,
    transform: (doc) => {
      return {
        id: doc.id,
        login: doc.login,
        email: doc.email,
        createdAt: doc.createdAt,
      };
    },
  },
})
export class User {
  private _id: ObjectId;
  @Prop({
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 10,
    unique: true,
  })
  login: string;

  @Prop({
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 300,
    unique: true,
  })
  email: string;

  @Prop({ required: true, default: () => new Date(), readonly: true })
  createdAt: Date;

  @Prop({ required: true, minlength: 5 })
  hash: string;

  get id(): string {
    return this._id.toHexString();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics = {
  async newUser(dto: UserInputModel): Promise<UserDocument> {
    const { login, email, password } = dto;
    const hash = await genHash(password, await genSalt(10));
    return new this({ login, email, hash });
  },
};

export interface UserModelStatic {
  newUser: (dto: UserInputModel) => Promise<UserDocument>;
}
