import { FilterQuery, PipelineStage } from 'mongoose';
import { Nullable } from '../../Model/Type/promise.types';
import { PaginationConfigClass } from '../classes/pagination-config.class';
import { ObjectId } from 'mongodb';

export function generateLikeInfo<
  T extends PaginationConfigClass & { filter: FilterQuery<T> },
>(config: T, userId: Nullable<ObjectId>): PipelineStage[] {
  const filter = config.filter || {};
  return [
    {
      $match: filter,
    },
    {
      $sort: { [config.sortBy]: config.sortDirection! === 'asc' ? 1 : -1 },
    },
    // Пропускаем нужное количество записей
    {
      $skip: config.shouldSkip,
    },
    // Ограничиваем количество записей
    {
      $limit: config.limit,
    },
    {
      $lookup: {
        from: 'likes',
        let: { postId: '$id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      { $eq: ['$target', '$$postId'] },
                      { $ne: ['$likeStatus', 'None'] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ['$target', '$$postId'] },
                      { $ne: ['userId', userId] },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'newestLikes',
      },
    },
    {
      $addFields: {
        id: '$_id',
        likesInfo: {
          newestLike: '$newestLikes',
          likeCount: {
            $reduce: {
              input: '$newestLikes',
              initialValue: 0,
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$$this.likeStatus', 'Like'] },
                      { $ne: ['$$this.likeStatus', null] },
                    ],
                  },
                  { $add: ['$$value', 1] },
                  '$$value',
                ],
              },
            },
          },
          dislikeCount: {
            $reduce: {
              input: '$newestLikes',
              initialValue: 0,
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$$this.likeStatus', 'Dislike'] },
                      { $ne: ['$$this.likeStatus', null] },
                    ],
                  },
                  { $add: ['$$value', 1] },
                  '$$value',
                ],
              },
            },
          },
          MyStatus: {
            $reduce: {
              input: '$newestLikes',
              initialValue: 'None',
              in: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$$this.userId', userId] },
                      { $ne: ['$$this.likeStatus', null] },
                    ],
                  },
                  '$$this.likeStatus',
                  '$$value',
                ],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        newestLikes: 0,
      },
    },
  ];
}
