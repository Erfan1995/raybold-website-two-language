<?php

use Illuminate\Database\Seeder;

class LanguageSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('language')->insert([
            [
                'name' => 'da',
            ],
            [
                'name' => 'en',
            ]

        ]);

    }
}
