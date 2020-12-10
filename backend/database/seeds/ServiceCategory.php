<?php

use Illuminate\Database\Seeder;

class ServiceCategory extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        DB::table('service_category')->insert([
            [
                'title' => 'دیتابس',
            ]
            ,
            [
                'title' => 'دیزاین وب',
            ],
            [
                'title' => 'اپلیکشن موبایل',
            ]
            ,
            [
                'title' => 'ثبت دومین',
            ],
            [
                'title' => 'هاست وبسایت',
            ]
            ,
            [
                'title' => 'طراحی گرافیک',
            ],
            [
                'title' => 'تولید محتوای تصویری',
            ]
            ,
            [
                'title' => 'بازاریابی الکترونیکی',
            ]


        ]);
    }
}
