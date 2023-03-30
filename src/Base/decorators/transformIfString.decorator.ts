import { Transform, TransformFnParams } from 'class-transformer';

export function TrimIfString() {
  return Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : value,
  );
}
