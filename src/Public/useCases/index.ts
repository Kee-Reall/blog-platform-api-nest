import { queryUseCases } from './query';
import { commandUseCases } from './commands';

export const useCases = [...queryUseCases, ...commandUseCases];
export * from './query';
export * from './commands';
