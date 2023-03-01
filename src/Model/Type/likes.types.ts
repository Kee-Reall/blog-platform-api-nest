import { ObjectId } from 'mongodb';

export type LikeStatus = 'Like' | 'Dislike' | 'None';

export interface LikeModel {
  addedAt: Date;
  target: ObjectId;
  userId: ObjectId;
  login: string;
  likeStatus: LikeStatus;
}

export interface LikeInputModel {
  likeStatus: LikeStatus;
}

export interface LikeDTO extends LikeInputModel {
  userId: string;
}

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type NewestLikeArray = Array<
  Pick<LikeModel, 'login' | 'addedAt' | 'userId'>
>;
export type NewestLikeArrayWithTarget = Array<
  Pick<LikeModel, 'login' | 'addedAt' | 'userId' | 'target'>
>;

export type LikeMapped = Pick<LikeModel, 'likeStatus' | 'target' | 'userId'>;

export type LastLikes = { newestLikes: NewestLikeArray };

export type ExtendedLikesInfo = LikesInfo & LastLikes;

export type WithLike<T> = T & {
  likesInfo: LikesInfo;
};

export type WithExtendedLike<T> = T & {
  extendedLikesInfo: ExtendedLikesInfo;
};

export type UserCommentator = {
  userLogin: string;
  userId: ObjectId;
};
