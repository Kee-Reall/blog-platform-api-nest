import { BlogPresentationModel } from './blogs.types';
import { PostPresentationModel } from './posts.types';
import { UserPresentationModel } from './users.types';
import { CommentsLogicModel } from './comments.types';

export type Direction = 'asc' | 'desc';

export interface AbstractFilter<T> {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string | keyof T;
  sortDirection?: Direction;
}

export interface BlogFilter extends AbstractFilter<BlogPresentationModel> {
  searchNameTerm?: string;
}

export type PostFilter = AbstractFilter<PostPresentationModel>;

export interface UsersFilter extends AbstractFilter<UserPresentationModel> {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  banStatus?: string;
}

export interface CommentsFilter extends AbstractFilter<CommentsLogicModel> {
  searchId?: string;
}

export type BanQuery = 'all' | 'banned' | 'notBanned';
