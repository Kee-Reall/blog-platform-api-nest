import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { hash as genHash, genSalt, compare } from 'bcrypt';
import { v4 as genUUIDv4 } from 'uuid';
import { addMinutes, isBefore } from 'date-fns';
import {
  ConfirmationType,
  NullablePromise,
  RecoveryType,
  UserInputModel,
  UserLogicModel,
  VoidPromise,
} from '../Type/';

export type UserDocument = HydratedDocument<User> & UserMethods;

@Schema({ _id: false, versionKey: false })
export class ConfirmationScheme implements ConfirmationType {
  @Prop({ default: () => genUUIDv4(), nullable: true })
  code: string | null = genUUIDv4();

  @Prop({ required: true, default: () => addMinutes(new Date(), 60) })
  confirmationDate: Date = addMinutes(new Date(), 60);

  @Prop({ required: true, default: false })
  isConfirmed: boolean = false;
}

@Schema({ _id: false, versionKey: false })
export class RecoverySchema implements RecoveryType {
  @Prop({ required: true, default: () => new Date() })
  expirationDate: Date = new Date();

  @Prop({ default: null, nullable: true })
  recoveryCode: string | null = null;
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

  @Prop({
    required: true,
    default: () => new ConfirmationScheme(),
  })
  confirmation: ConfirmationScheme;

  @Prop({
    required: true,
    default: () => new RecoverySchema(),
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
    const hash = await genHash(password, await genSalt(13));
    return new this({ login, email, hash });
  },

  async findByLoginOrEmail(
    loginOrEmail: string,
  ): NullablePromise<UserDocument> {
    try {
      return await this.findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      });
    } catch (e) {
      return null;
    }
  },

  generateDefaultRecovery(): RecoveryType {
    return { expirationDate: new Date(), recoveryCode: null };
  },

  generateDefaultConfirmation(isAdmin = false): ConfirmationType {
    return { code: null, confirmationDate: new Date(), isConfirmed: isAdmin };
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
    this.hash = await genHash(password, await genSalt(13));
  },

  confirm() {
    this.confirmation.isConfirmed = true;
    this.confirmation.code = null;
  },

  updateConfirmCode() {
    this.confirmation.code = genUUIDv4();
    this.confirmation.confirmationDate = addMinutes(new Date(), 60);
  },

  setRecoveryMetadata() {
    this.recovery.recoveryCode = genUUIDv4();
    this.recovery.expirationDate = addMinutes(new Date(), 10);
  },

  isRecoveryCodeActive() {
    const isDateExpired = isBefore(new Date(), this.recovery.expirationDate);
    return isDateExpired && this.confirmation.isConfirmed;
  },

  async changePassword(password: string): VoidPromise {
    await this.setHash(password);
    this.resetRecoveryCode();
  },

  async comparePasswords(password: string): Promise<boolean> {
    return await compare(password, this.hash);
  },

  resetRecoveryCode() {
    this.recovery.recoveryCode = null;
  },

  async killYourself() {
    await this.constructor.deleteOne(this);
  },
};

export interface UserMethods {
  isFieldsUnique: () => Promise<[boolean, string[]]>;
  setHash: (password: string) => VoidPromise;
  changePassword: (password: string) => VoidPromise;
  confirm: () => void;
  updateConfirmCode: () => void;
  killYourself: () => VoidPromise;
  setRecoveryMetadata: () => void;
  resetRecoveryCode: () => void;
  isRecoveryCodeActive: () => boolean;
  comparePasswords: (password: string) => Promise<boolean>;
}

export interface UserModelStatics {
  findByLoginOrEmail: (loginOrEmail: string) => NullablePromise<UserDocument>;
  newUser: (dto: UserInputModel) => Promise<UserDocument>;
  generateDefaultRecovery: () => RecoveryType;
  generateDefaultConfirmation: (isAdmin: boolean) => ConfirmationType;
}
