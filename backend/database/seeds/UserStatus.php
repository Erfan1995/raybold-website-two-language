<?php

use Illuminate\Database\Seeder;

class UserStatus extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('user_status')->insert([
            [
                'status' => 'suspended',

            ],
            [
                'status' => 'active',

            ],
            [
                'status' => 'rejected',

            ]

        ]);
    }
}
