import { SuperAdminQueryRepository } from './query.repository';
import { SuperAdminCommandRepository } from './command.repository';

export * from './query.repository';
export * from './command.repository';
export const superAdminRepositories = [
  SuperAdminQueryRepository,
  SuperAdminCommandRepository,
];
