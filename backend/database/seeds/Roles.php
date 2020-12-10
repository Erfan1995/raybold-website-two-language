<?php

use Illuminate\Database\Seeder;

class Roles extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('privileges')->insert([
            [
                'title' => 'Super Admin',
                'slug' => 'super_admin',
            ],
            [
                'title' => 'Admin',
                'slug' => 'admin',
            ]
            ,
            [
                'title' => 'Blogger',
                'slug' => 'blogger',
            ]

        ]);
    }
}
