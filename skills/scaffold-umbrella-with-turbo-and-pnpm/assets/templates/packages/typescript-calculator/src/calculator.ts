export class Calculator {
  add(left: number, right: number): number {
    return left + right;
  }

  subtract(left: number, right: number): number {
    return left - right;
  }

  multiply(left: number, right: number): number {
    return left * right;
  }

  divide(left: number, right: number): number {
    if (right === 0) {
      throw new RangeError('Cannot divide by zero');
    }

    return left / right;
  }
}
