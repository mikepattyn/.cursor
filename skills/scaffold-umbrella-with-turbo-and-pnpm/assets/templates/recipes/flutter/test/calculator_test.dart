import 'package:example_calculator/features/calculator/calculator_page.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('adds and rejects divide by zero', () {
    final calculator = Calculator();
    expect(calculator.add(2, 3), 5);
    expect(() => calculator.divide(1, 0), throwsArgumentError);
  });
}
