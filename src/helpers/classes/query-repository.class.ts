import { Model, ObjectId } from 'mongoose';
import { IPaginationConfig } from '../../Model/Type/pagination.types';
import { NullablePromise } from '../../Model/Type/promise.types';

export abstract class QueryRepository {
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
  ): NullablePromise<T> {
    try {
      return (await model.findById(id)) ?? null;
    } catch (e) {
      return null;
    }
  }
}
