export type CommentsLogicModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  postId: string;
};

export type CommentPresentationModel = Omit<
  CommentsLogicModel,
  'postId' | 'createdAt'
> & {
  createdAt: string;
};
