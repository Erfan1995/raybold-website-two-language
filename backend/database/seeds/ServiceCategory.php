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
                'language' => 'da'
            ]
            , [
                'title' => 'Database',
                'language' => 'en'
            ]
            ,
            [
                'title' => 'دیزاین وب',
                'language' => 'da'

            ], [
                'title' => 'Web Design',
                'language' => 'en'

            ],
            [
                'title' => 'اپلیکشن موبایل',
                'language' => 'da'

            ]
            ,
            [
                'title' => 'Mobile App',
                'language' => 'en'

            ]
            ,
            [
                'title' => 'ثبت دومین',
                'language' => 'da'

            ],
            [
                'title' => 'Domain Registration',
                'language' => 'en'

            ],
            [
                'title' => 'هاست وبسایت',
                'language' => 'da'

            ]
            , [
                'title' => 'Web Hosting',
                'language' => 'en'

            ]
            ,
            [
                'title' => 'طراحی گرافیک',
                'language' => 'da'

            ],
            [
                'title' => 'Graphic Design',
                'language' => 'en'

            ],
            [
                'title' => 'تولید محتوای تصویری',
                'language' => 'da'

            ]
            ,
            [
                'title' => 'Video Content',
                'language' => 'en'

            ]
            ,
            [
                'title' => 'بازاریابی الکترونیکی',
                'language' => 'da'

            ],
            [
                'title' => 'Digital Marketing',
                'language' => 'en'

            ]


        ]);
    }
}
