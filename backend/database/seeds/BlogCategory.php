<?php

use Illuminate\Database\Seeder;

class BlogCategory extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('blog_category')->insert([
            [
                'title' => 'سافتویر',
            ],
            [
                'title' => 'گرافیک',
            ]

        ]);
    }
}
