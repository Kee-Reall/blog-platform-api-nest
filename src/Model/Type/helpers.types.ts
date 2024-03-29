import { Model } from 'mongoose';

export type Nullable<T = any> = T | null;
export type VoidPromise = Promise<void>;
export type VoidablePromise<T> = Promise<void | T>;
export type NullablePromise<T = any> = Promise<T | null>;
export type NullableArrayPromise<T = any> = Promise<T[] | null>;

export type NullableKey<T> = {
  [K in keyof T]: T[K] | null;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ModelWithStatic<
  Doc,
  Static = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [p in any]: Function;
  },
> = Model<Doc> & Static;

export type Populated<mainDoc, populatedDoc, key extends keyof mainDoc> = Omit<
  mainDoc,
  key
> & {
  [param in key]: populatedDoc;
};
