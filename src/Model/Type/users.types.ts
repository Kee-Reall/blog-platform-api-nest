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
  id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
  hash: string;

  //  confirmation:Confirmation
  //  recovery: Recovery
};
