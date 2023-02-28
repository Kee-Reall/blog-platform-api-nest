import { HydratedDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IPaginationConfig } from '../../Model/Type/pagination.types';
import {
  Nullable,
  NullablePromise,
  VoidPromise,
} from '../../Model/Type/promise.types';
import { LikeDocument } from '../../Model/Schema/like.schema';
import {
  LikeMapped,
  LikesInfo,
  LikeStatus,
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

  protected async save<T extends { save: () => Promise<void | T> }>(
    entity: T,
  ): Promise<boolean> {
    try {
      await entity.save();
      return true;
    } catch (e) {
      return false;
    }
  }

  protected async countLikesInfo<T>(
    model: Model<LikeDocument>,
    items: HydratedDocument<T>[],
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
              if (like.userId.toHexString() === userId.toHexString()) {
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
}