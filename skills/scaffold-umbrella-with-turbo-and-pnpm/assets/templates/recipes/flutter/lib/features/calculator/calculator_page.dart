import 'package:flutter/material.dart';

class Calculator {
  double add(double left, double right) => left + right;
  double subtract(double left, double right) => left - right;
  double multiply(double left, double right) => left * right;
  double divide(double left, double right) {
    if (right == 0) {
      throw ArgumentError('Cannot divide by zero');
    }
    return left / right;
  }
}

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key});

  @override
  State<CalculatorPage> createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  final _calculator = Calculator();
  final _left = TextEditingController(text: '0');
  final _right = TextEditingController(text: '0');
  double? _result;

  void _run(double Function(double, double) op) {
    setState(() {
      _result = op(double.parse(_left.text), double.parse(_right.text));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          TextField(controller: _left, keyboardType: TextInputType.number),
          TextField(controller: _right, keyboardType: TextInputType.number),
          TextButton(onPressed: () => _run(_calculator.add), child: const Text('Add')),
          if (_result != null) Text('Result: $_result'),
        ],
      ),
    );
  }
}
