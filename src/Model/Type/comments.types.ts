import { ObjectId } from 'mongodb';

export type CommentatorInfoType = {
  userId: ObjectId;
  userLogin: string;
};

export type CommentsLogicModel = {
  _id: ObjectId;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  postId: ObjectId;
};

export type CommentPresentationModel = Pick<CommentsLogicModel, 'content'> & {
  id: string;
  postId: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type CommentInputModel = Pick<CommentsLogicModel, 'content'>;
