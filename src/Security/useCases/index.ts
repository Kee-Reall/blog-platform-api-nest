import { commandHandlers } from './commands';
import { queriesHandlers } from './queries';

export * from './commands';
export * from './queries';

export const useCases = [...commandHandlers, ...queriesHandlers];
