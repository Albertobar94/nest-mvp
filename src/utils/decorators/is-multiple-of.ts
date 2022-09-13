import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "IsMultipleOf", async: false })
export class IsMultipleOfConstraint implements ValidatorConstraintInterface {
  validate(num: number, { constraints }: ValidationArguments) {
    return num % constraints[0] === 0;
  }

  defaultMessage({ value, constraints }: ValidationArguments) {
    return `Number (${value}) has to be a multiple of (${constraints?.[0]})`;
  }
}

export function IsMultipleOf(value: number) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [value],
      validator: IsMultipleOfConstraint,
    });
  };
}
