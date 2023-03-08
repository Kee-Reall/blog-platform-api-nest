import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { hash as genHash, genSalt } from 'bcrypt';
import {
  Confirmation,
  Recovery,
  UserInputModel,
  UserLogicModel,
} from '../Type/users.types';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false, versionKey: false })
export class ConfirmationScheme implements Confirmation {
  @Prop({ required: true, default: '' })
  code: string;

  @Prop({ required: true, default: () => new Date() })
  confirmationDate: Date;

  @Prop({ required: true, default: false })
  isConfirmed: boolean;
}

@Schema({ _id: false, versionKey: false })
export class RecoverySchema implements Recovery {
  @Prop({ required: true, default: () => new Date() })
  expirationDate: Date;

  @Prop({ required: true, default: '' })
  recoveryCode: string;
}

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
export class User implements UserLogicModel {
  _id: ObjectId;

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

  @Prop({})
  confirmation: ConfirmationScheme;
  @Prop()
  recovery: RecoverySchema;

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
