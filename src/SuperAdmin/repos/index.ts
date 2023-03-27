import { AdminQueryRepository } from './query.repository';
import { AdminCommandRepository } from './command.repository';

export * from './query.repository';
export * from './command.repository';
export const superAdminRepositories = [
  AdminQueryRepository,
  AdminCommandRepository,
];
