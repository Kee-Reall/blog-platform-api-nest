import { ObjectId } from 'mongodb';
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
  createdAt: string;
  isMembership: boolean;
};

export type BlogPresentationModel = Omit<
  BlogLogicModel,
  '_id' | 'createdAt'
> & {
  id: string;
  createdAt: string;
};
