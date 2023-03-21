import { Model } from 'mongoose';

export type Nullable<T = any> = T | null;
export type VoidPromise = Promise<void>;
export type VoidablePromise<T> = Promise<void | T>;
export type NullablePromise<T = any> = Promise<T | null>;
export type NullableArrayPromise<T = any> = Promise<T[] | null>;

export type NullableKey<T> = {
  [K in keyof T]: T[K] | null;
};

export type ModelWithStatic<Doc, Static> = Model<Doc> & Static;
