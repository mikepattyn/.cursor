package com.umbrella.example

class Calculator {
    fun add(left: Double, right: Double): Double = left + right

    fun subtract(left: Double, right: Double): Double = left - right

    fun multiply(left: Double, right: Double): Double = left * right

    fun divide(left: Double, right: Double): Double {
        require(right != 0.0) { "Cannot divide by zero" }
        return left / right
    }
}
