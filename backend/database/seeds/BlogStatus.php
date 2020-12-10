<?php

use Illuminate\Database\Seeder;

class BlogStatus extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('blog_status')->insert([
            [
                'status' => 'suspended',

            ],
            [
                'status' => 'accepted',

            ],
            [
                'status' => 'rejected',

            ]

        ]);
    }
}
