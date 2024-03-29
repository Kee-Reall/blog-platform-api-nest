import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { LikeENUM } from '../../Helpers';
import {
  IPaginationConfig,
  LikeDocument,
  LikeMapped,
  LikesInfo,
  LikeStatus,
  NewestLikeArray,
  Nullable,
  NullablePromise,
  PaginatedOutput,
  PaginationDigits,
  VoidablePromise,
  VoidPromise,
} from '../../Model';

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

  protected async saveEntity<T extends { save: () => VoidablePromise<T> }>(
    entity: T,
  ): Promise<boolean> {
    try {
      await entity.save();
      return true;
    } catch (e) {
      return false;
    }
  }

  protected async countLikesInfo<T extends HydratedDocument<unknown>>(
    model: Model<LikeDocument>,
    items: Array<T>,
    userId: Nullable<string> = null,
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
      const userIdCompare = userId ? userId : null;
      const targetIds: ObjectId[] = items.map((el) => el._id as ObjectId);
      const likes: LikeMapped[] = await model
        .find({
          target: { $in: targetIds },
          _isOwnerBanned: false,
        })
        .select('likeStatus target userId')
        .lean();
      return await Promise.all(
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
          _isOwnerBanned: false,
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

  protected async getLikeForTarget(
    model: Model<LikeDocument>,
    userIdStr: string,
    targetStr: string,
  ): NullablePromise<LikeDocument> {
    try {
      const [userId, target] = [
        new ObjectId(userIdStr),
        new ObjectId(targetStr),
      ];
      return (await model.findOne({ userId, target })) ?? null;
    } catch (e) {
      return null;
    }
  }

  protected async findManyWithFilter<Doc>(
    model: Model<Doc>,
    filter: FilterQuery<unknown>,
  ): NullablePromise<Doc[]> {
    try {
      return await model.find(filter);
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  protected async findOneWithFilter<Doc>(
    model: Model<Doc>,
    filter: FilterQuery<Doc>,
  ): NullablePromise<Doc> {
    try {
      return await model.findOne(filter);
    } catch (e) {
      return null;
    }
  }

  protected paginationOutput<T>(
    digits: PaginationDigits,
    items: Array<T>,
  ): PaginatedOutput<T> {
    return {
      pagesCount: Math.ceil(digits.totalCount / digits.limit),
      page: digits.pageNumber,
      pageSize: digits.limit,
      totalCount: digits.totalCount,
      items,
    };
  }
}
