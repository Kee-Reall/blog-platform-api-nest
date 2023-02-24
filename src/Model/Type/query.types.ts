import { BlogPresentationModel } from './blogs.types';

export interface AbstractFilter<T> {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export interface BlogFilters extends AbstractFilter<BlogPresentationModel> {
  searchNameTerm?: string;
}

// export interface UsersFilters extends AbstractFilter<UserViewModel> {
//   searchLoginTerm?: string
//   searchEmailTerm?: string
// }
//
// export interface CommentsFilter extends AbstractFilter<CommentsLogicModel> {
//   searchId?:string
// }
