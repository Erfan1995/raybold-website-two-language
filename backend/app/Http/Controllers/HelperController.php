<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HelperController extends Controller
{
    //
    public function getCommonData()
    {
        $roles = DB::table('privileges')->select('id', 'slug', 'title')->get();
        $blogCategory = DB::table('blog_category')->select('id', 'title')->get();
        $userStatus = DB::table('user_status')->select('id', 'status')->get();
        $serviceCategory = DB::table('service_category')->select('id', 'title')->get();
        $users = DB::table('users')->select('id', 'full_name', 'phone', 'email')->get();
        $blogStatus = DB::table('blog_status')->select('id', 'status')->get();

        return response()->json([
            'roles' => $roles,
            'blogCategory' => $blogCategory,
            'userStatus' => $userStatus,
            'serviceCategory' => $serviceCategory,
            'users' => $users,
            'blogStatus' => $blogStatus
        ]);

    }

    public function getServiceCategory()
    {
        $serviceCategory = DB::table('service_category')->select('id', 'title')->get();
        return response()->json([
            'serviceCategory' => $serviceCategory,
        ]);

    }
}
