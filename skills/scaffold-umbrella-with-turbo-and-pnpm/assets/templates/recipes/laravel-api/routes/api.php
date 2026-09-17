<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/healthz', fn () => ['status' => 'ok']);

Route::get('/value', function () {
    return cache()->get('calculator_value', ['value' => null, 'updatedAt' => null]);
});

Route::put('/value', function (Request $request) {
    $value = $request->validate(['value' => 'required|numeric'])['value'];
    $row = ['value' => $value, 'updatedAt' => now()->utc()->toIso8601String()];
    cache()->forever('calculator_value', $row);
    return $row;
});
