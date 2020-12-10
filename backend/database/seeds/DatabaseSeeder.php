<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(BlogCategory::class);
        $this->call(Roles::class);
        $this->call(ServiceCategory::class);
        $this->call(UserStatus::class);
        $this->call(BlogStatus::class);
        $this->call(UserSeeder::class);
        $this->call(LanguageSeed::class);
    }
}
