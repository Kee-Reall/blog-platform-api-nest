import { Transform, TransformFnParams } from 'class-transformer';
import { ValidationOptions, ValidationArguments } from 'class-validator';
/* Decorator from chat GPT */
export function TrimIfString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const originalValidateFn = object.constructor.prototype['validate'];
    object.constructor.prototype['validate'] = function (options?: any) {
      if (typeof this[propertyName] === 'string') {
        this[propertyName] = this[propertyName].trim();
      }
      return originalValidateFn.call(this, options);
    };
    Transform(({ value }: TransformFnParams) =>
      typeof value === 'string' ? value.trim() : value,
    )(object, propertyName);
  };
}
