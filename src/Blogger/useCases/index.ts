import { bloggerCommandsHandlers } from './commands';
import { bloggerQueriesHandlers } from './queries';

export * from './commands';
export * from './queries';

export const useCasesHandlers = [
  ...bloggerCommandsHandlers,
  ...bloggerQueriesHandlers,
];
