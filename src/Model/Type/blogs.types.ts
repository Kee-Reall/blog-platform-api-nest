import { ObjectId } from 'mongoose';
export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogLogicModel = {
  _id?: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogPresentationModel = Omit<BlogLogicModel, '_id'> & {
  id: string;
  createdAt: string;
};
