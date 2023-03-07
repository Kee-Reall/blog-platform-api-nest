import { ObjectId } from 'mongodb';

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostCreateModel = PostInputModel & { blogId: string };

export type PostLogicModel = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
};

export type PostPresentationModel = Omit<PostLogicModel, '_id'> & {
  id: string;
  blogId: string;
  createdAt: string;
};
