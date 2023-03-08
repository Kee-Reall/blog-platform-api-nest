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
  confirmation: Confirmation;
  recovery: Recovery;
};

export type Recovery = {
  recoveryCode: string;
  expirationDate: Date;
};

export type Confirmation = {
  isConfirmed: boolean;
  code: string;
  confirmationDate: Date;
};
