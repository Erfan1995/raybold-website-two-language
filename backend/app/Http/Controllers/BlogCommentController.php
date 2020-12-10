<?php

namespace App\Http\Controllers;

use App\BlogCommentModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlogCommentController extends Controller
{
    //
    public function storeBlogComments(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $insertedData = $this->addBlogCommentFunc($request->all());
            return response()->json($insertedData);

        } catch (\Exception $exception) {

        }
    }

    public function listBlogComments($blogId)
    {
        try {
            $data = BlogCommentModel::select('full_name', 'email', 'comment', 'created_at')
                ->where('blog_id', '=', $blogId)
                ->latest('created_at')->get();
            return response()->json($data);

        } catch (\Exception $exception) {

        }
    }

    private function addBlogCommentFunc(array $data)
    {
        return BlogCommentModel::create($data, [
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'comment' => $data['comment'],
            'blog_id' => $data['blog_id']
        ]);
    }

    private function validator(array $data)
    {
        return Validator::make($data, [
            'full_name' => ['required'],
            'email' => [],
            'comment' => ['required'],
            'blog_id' => ['required'],

        ]);
    }

}
