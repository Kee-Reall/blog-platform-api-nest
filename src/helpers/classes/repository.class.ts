import { HydratedDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IPaginationConfig } from '../../Model/Type/pagination.types';
import {
  Nullable,
  NullablePromise,
  VoidablePromise,
  VoidPromise,
} from '../../Model/Type/promise.types';
import { LikeDocument } from '../../Model/Schema/like.schema';
import {
  LikeMapped,
  LikesInfo,
  LikeStatus,
  NewestLikeArray,
} from '../../Model/Type/likes.types';
import { LikeENUM } from '../enums/like.enum';

export abstract class Repository {
  protected async paginate<T>(
    model: Model<T>,
    config: IPaginationConfig,
  ): Promise<[Array<T>, number]> {
    const direction: 1 | -1 = config.sortDirection === 'asc' ? 1 : -1;
    const items = model
      .find(config.filter)
      .sort({ [config.sortBy]: direction })
      .skip(config.shouldSkip)
      .limit(config.limit);
    const totalCount = model.countDocuments(config.filter);
    return await Promise.all([items, totalCount]);
  }

  protected async findById<T>(
    model: Model<T>,
    id: string | ObjectId,
  ): NullablePromise<HydratedDocument<T>> {
    try {
      return (await model.findById(id)) ?? null;
    } catch (e) {
      return null;
    }
  }

  protected async save<
    T extends { save: () => VoidablePromise<T>; createdAt?: Date },
  >(entity: T): Promise<boolean> {
    try {
      entity.createdAt = new Date();
      await entity.save();
      return true;
    } catch (e) {
      return false;
    }
  }

  protected async countLikesInfo<T>(
    model: Model<LikeDocument>,
    items: Array<T & { _id: ObjectId }>,
    userId: Nullable<ObjectId> = null,
  ) {
    async function incrementLikeReducer(reducer: LikesInfo): VoidPromise {
      reducer.likesCount += 1;
    }

    async function incrementDislikeReducer(reducer: LikesInfo): VoidPromise {
      reducer.dislikesCount += 1;
    }

    async function setStatusForLikesInfoReducer(
      reducer: LikesInfo,
      status: LikeStatus,
    ): VoidPromise {
      reducer.myStatus = status;
    }

    try {
      const userIdCompare = userId ? userId.toHexString() : null;
      const targetIds: ObjectId[] = items.map((el) => el._id);
      const likes: LikeMapped[] = await model
        .find({
          target: { $in: targetIds },
        })
        .select('likeStatus target userId')
        .lean();
      return Promise.all(
        targetIds.map(async (id) => {
          const reducer: LikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeENUM.NONE,
          };
          for (const like of likes) {
            if (id.toHexString() === like.target.toHexString()) {
              if (like.likeStatus === LikeENUM.LIKE) {
                await incrementLikeReducer(reducer);
              } else if (like.likeStatus === LikeENUM.DISLIKE) {
                await incrementDislikeReducer(reducer);
              }
              if (like.userId.toHexString() === userIdCompare) {
                await setStatusForLikesInfoReducer(reducer, like.likeStatus);
              }
            }
          }
          return reducer;
        }),
      );
    } catch (e) {
      return [];
    }
  }

  protected async getLastLikes(
    model: Model<LikeDocument>,
    target: ObjectId,
    limit = 3,
  ): Promise<NewestLikeArray> {
    try {
      return await model
        .find({
          target,
          likeStatus: LikeENUM.LIKE,
        })
        .sort({ addedAt: -1 })
        .limit(limit)
        .select('userId login addedAt -_id')
        .lean();
    } catch (e) {
      return [];
    }
  }

  protected async deleteUsingId<T>(
    model: Model<T>,
    _id: string | ObjectId,
  ): Promise<boolean> {
    try {
      const { deletedCount } = await model.deleteOne({ _id });
      return deletedCount > 0;
    } catch (e) {
      return false;
    }
  }
}
