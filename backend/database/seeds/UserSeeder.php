<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            [
                'full_name' => 'superadmin',
                'password' => Hash::make('superadmin@@786'),
                'privilege_id' => 2,
                'phone' => '0748822362',
                'user_status_id' => 2,
                'email' => 'info@raybold.co',
                'created_at' => \Illuminate\Support\Carbon::now(),
                'updated_at' => \Illuminate\Support\Carbon::now()
            ]

        ]);
    }
}
