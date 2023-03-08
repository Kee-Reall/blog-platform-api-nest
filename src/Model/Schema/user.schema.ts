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
import { VoidPromise } from '../Type/promise.types';

export type UserDocument = HydratedDocument<User> & UserMethods;

@Schema({ _id: false, versionKey: false })
export class ConfirmationScheme implements Confirmation {
  @Prop({ required: true, default: '' })
  code: string = '';

  @Prop({ required: true, default: () => new Date() })
  confirmationDate: Date = new Date();

  @Prop({ required: true, default: false })
  isConfirmed: boolean = false;
}

@Schema({ _id: false, versionKey: false })
export class RecoverySchema implements Recovery {
  @Prop({ required: true, default: () => new Date() })
  expirationDate: Date = new Date();

  @Prop({ required: true, default: '' })
  recoveryCode: string = '';
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
  constructor(data?: Partial<User>) {
    Object.assign(this, data);
    this.confirmation = this.confirmation || new ConfirmationScheme();
    this.recovery = this.recovery || new RecoverySchema();
  }
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

  @Prop({
    required: true,
    default: () => {
      return { code: '', confirmationDate: new Date(), isConfirmed: false };
    },
  })
  confirmation: ConfirmationScheme;

  @Prop({
    required: true,
    default: () => {
      return { expirationDate: new Date(), recoveryCode: '' };
    },
  })
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

UserSchema.methods = {
  async isFieldsUnique(): Promise<[boolean, string[]]> {
    const { login, email } = this;
    const [userByLogin, userByEmail] = await Promise.all([
      this.constructor.findOne({ login }),
      this.constructor.findOne({ email }),
    ]);
    const result: Array<'login' | 'email'> = [];
    if (!userByLogin && !userByEmail) {
      return [true, result];
    }
    if (userByLogin) result.push('login');
    if (userByEmail) result.push('email');
    return [false, result];
  },

  async setHash(password: string) {
    this.hash = await genHash(password, await genSalt(10));
  },
};

export interface UserMethods {
  isFieldsUnique: () => Promise<[boolean, string[]]>;
  setHash: (password: string) => VoidPromise;
}

export interface UserModelStatic {
  newUser: (dto: UserInputModel) => Promise<UserDocument>;
}
