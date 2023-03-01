import { ObjectId } from 'mongodb';

export type CommentatorInfoType = {
  userId: ObjectId;
  userLogin: string;
};

export type CommentsLogicModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  postId: ObjectId;
};

export type CommentPresentationModel = Pick<
  CommentsLogicModel,
  'id' | 'content'
> & {
  postId: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};
