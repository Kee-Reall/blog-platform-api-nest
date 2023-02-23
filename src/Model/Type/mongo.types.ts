import { ObjectId } from 'mongoose';

export type WithId<T> = T & { _id: ObjectId };
