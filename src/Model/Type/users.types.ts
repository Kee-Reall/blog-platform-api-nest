import { ObjectId } from 'mongodb';
import { VoidPromise } from './helpers.types';

export type UserPresentationModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserInputModel = {
  login: string;
  email: string;
  password: string;
};

export type UserLoginModel = {
  loginOrEmail: string;
  password: string;
};

export type WithClientMeta<T> = T & { ip: string; agent: string };

export type UserLogicModel = {
  _id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
  hash: string;
  confirmation: ConfirmationType;
  recovery: RecoveryType;
};

export type RecoveryType = {
  recoveryCode: string;
  expirationDate: Date;
};

export type RecoveryInputModel = {
  recoveryCode: string;
  newPassword: string;
};

export type ConfirmationType = {
  isConfirmed: boolean;
  code: string;
  confirmationDate: Date;
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
