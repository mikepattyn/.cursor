package com.umbrella.example

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class CalculatorTest {
    private val calculator = Calculator()

    @Test
    fun adds() {
        assertEquals(5.0, calculator.add(2.0, 3.0))
    }

    @Test
    fun rejectsDivideByZero() {
        assertFailsWith<IllegalArgumentException> { calculator.divide(1.0, 0.0) }
    }
}
