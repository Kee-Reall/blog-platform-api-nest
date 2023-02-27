import { BlogPresentationModel } from './blogs.types';
import { PostPresentationModel } from './posts.types';

export interface AbstractFilter<T> {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string | keyof T;
  sortDirection?: 'asc' | 'desc';
}

export interface BlogFilters extends AbstractFilter<BlogPresentationModel> {
  searchNameTerm?: string;
}

export type PostFilters = AbstractFilter<PostPresentationModel>;

// export interface UsersFilters extends AbstractFilter<UserViewModel> {
//   searchLoginTerm?: string
//   searchEmailTerm?: string
// }
//
// export interface CommentsFilter extends AbstractFilter<CommentsLogicModel> {
//   searchId?:string
// }
