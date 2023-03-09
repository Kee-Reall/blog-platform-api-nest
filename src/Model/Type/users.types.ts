import { ObjectId } from 'mongodb';

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

export type ConfirmationType = {
  isConfirmed: boolean;
  code: string;
  confirmationDate: Date;
};
