<?php

namespace Tests;

use App\User;
use Faker\Generator as FakerGenerator;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /** @var FakerGenerator */
    protected $faker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->faker = app(FakerGenerator::class);
    }

    protected function generateUser(?int $permission = null): User
    {
        return User::create([
            'email'       => $this->faker->safeEmail,
            'password'    => Hash::make(Str::random(8)),
            'permissions' => $permission ?? User::TYPE_USER
        ]);
    }
}
