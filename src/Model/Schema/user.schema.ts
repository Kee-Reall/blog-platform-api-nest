import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { hash as genHash, genSalt, compare } from 'bcrypt';
import { v4 as genUUIDv4 } from 'uuid';
import { addMinutes, isBefore } from 'date-fns';
import {
  BanInfoModel,
  ConfirmationType,
  NullablePromise,
  RecoveryType,
  UserInputModel,
  UserLogicModel,
  UserMethods,
  VoidPromise,
} from '../Type/';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false, versionKey: false })
export class ConfirmationSchema implements ConfirmationType {
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

@Schema({ _id: false, versionKey: false })
export class BanInfoSchema implements BanInfoModel {
  @Prop({ default: false, nullable: true })
  isBanned: boolean = false;
  @Prop({ default: null, nullable: true })
  banDate: Date | null = null;
  @Prop({ default: null, nullable: true })
  banReason: string | null = null;
}

@Schema({
  toJSON: {
    getters: true,
    transform: (doc) => ({
      id: doc.id,
      login: doc.login,
      email: doc.email,
      createdAt: doc.createdAt,
    }),
  },
})
export class User implements UserLogicModel, UserMethods {
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

  @Prop({ default: () => new ConfirmationSchema() })
  confirmation: ConfirmationSchema;

  @Prop({ default: () => new RecoverySchema() })
  recovery: RecoverySchema;

  @Prop({ default: () => new BanInfoSchema() })
  banInfo: BanInfoSchema;

  get id(): string {
    return this._id.toHexString();
  }

  public async isFieldsUnique(): Promise<[boolean, string[]]> {
    const model = this.constructor as Model<UserDocument>;
    const { login, email } = this;
    const [userByLogin, userByEmail] = await Promise.all([
      model.findOne({ login }),
      model.findOne({ email }),
    ]);
    const result: Array<'login' | 'email'> = [];
    if (!userByLogin && !userByEmail) {
      return [true, result];
    }
    if (userByLogin) result.push('login');
    if (userByEmail) result.push('email');
    return [false, result];
  }

  public async setHash(password: string): VoidPromise {
    this.hash = await genHash(password, await genSalt(13));
  }

  public confirm(): void {
    this.confirmation.isConfirmed = true;
    this.confirmation.code = null;
  }

  public updateConfirmCode(): void {
    this.confirmation.code = genUUIDv4();
    this.confirmation.confirmationDate = addMinutes(new Date(), 60);
  }

  public setRecoveryMetadata(): void {
    this.recovery.recoveryCode = genUUIDv4();
    this.recovery.expirationDate = addMinutes(new Date(), 10);
  }

  public isRecoveryCodeActive(): boolean {
    const isDateExpired = isBefore(new Date(), this.recovery.expirationDate);
    return isDateExpired && this.confirmation.isConfirmed;
  }

  public resetRecoveryCode(): void {
    this.recovery.recoveryCode = null;
  }

  public async changePassword(password: string): VoidPromise {
    await this.setHash(password);
    this.resetRecoveryCode();
  }

  public async comparePasswords(password: string): Promise<boolean> {
    return await compare(password, this.hash);
  }

  public async killYourself(): VoidPromise {
    const model = this.constructor as Model<UserDocument>;
    await model.deleteOne(this);
  }
  static async newUser(dto: UserInputModel): Promise<UserDocument> {
    const { login, email, password } = dto;
    const hash = await genHash(password, await genSalt(13));
    const that = this as unknown as Model<UserDocument>;
    return new that({ login, email, hash });
  }

  static async findByLoginOrEmail(
    loginOrEmail: string,
  ): NullablePromise<UserDocument> {
    try {
      const that = this as unknown as Model<UserDocument>;
      return await that.findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      });
    } catch (e) {
      return null;
    }
  }

  static generateDefaultRecovery(): RecoveryType {
    return { expirationDate: new Date(), recoveryCode: null };
  }

  static generateDefaultConfirmation(isAdmin = false): ConfirmationType {
    return { code: null, confirmationDate: new Date(), isConfirmed: isAdmin };
  }

  static async nullableFindById(
    id: string | ObjectId,
  ): NullablePromise<UserDocument> {
    const that = this as unknown as Model<UserDocument>;
    try {
      return await that.findById(id);
    } catch (e) {
      return null;
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  isFieldsUnique: User.prototype.isFieldsUnique,
  setHash: User.prototype.setHash,
  confirm: User.prototype.confirm,
  updateConfirmCode: User.prototype.updateConfirmCode,
  setRecoveryMetadata: User.prototype.setRecoveryMetadata,
  isRecoveryCodeActive: User.prototype.isRecoveryCodeActive,
  changePassword: User.prototype.changePassword,
  comparePasswords: User.prototype.comparePasswords,
  resetRecoveryCode: User.prototype.resetRecoveryCode,
  killYourself: User.prototype.killYourself,
};

UserSchema.statics = {
  newUser: User.newUser,
  findByLoginOrEmail: User.findByLoginOrEmail,
  generateDefaultRecovery: User.generateDefaultRecovery,
  generateDefaultConfirmation: User.generateDefaultConfirmation,
  nullableFindById: User.nullableFindById,
};

export interface UserModelStatics {
  findByLoginOrEmail: (loginOrEmail: string) => NullablePromise<UserDocument>;
  newUser: (dto: UserInputModel) => Promise<UserDocument>;
  generateDefaultRecovery: () => RecoveryType;
  generateDefaultConfirmation: (isAdmin: boolean) => ConfirmationType;
  nullableFindById: (id: string | ObjectId) => NullablePromise<UserDocument>;
}
