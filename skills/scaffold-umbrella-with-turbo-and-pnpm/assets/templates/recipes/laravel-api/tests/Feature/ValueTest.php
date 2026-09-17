<?php

namespace Tests\Feature;

use Tests\TestCase;

class ValueTest extends TestCase
{
    public function test_empty_get(): void
    {
        $this->getJson('/api/value')
            ->assertOk()
            ->assertJson(['value' => null, 'updatedAt' => null]);
    }

    public function test_put(): void
    {
        $this->putJson('/api/value', ['value' => 12])
            ->assertOk()
            ->assertJsonPath('value', 12);
    }
}
