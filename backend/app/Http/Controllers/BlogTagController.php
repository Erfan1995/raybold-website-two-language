<?php

namespace App\Http\Controllers;

use App\BlogTagModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BlogTagController extends Controller
{
    //
    public function addBlogTag(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $insertedData = $this->addBlogTagFunc($request->all());
            return response()->json([
                'id' => $insertedData['id'],
                'name' => $insertedData['name'],
                'blog_id' => $insertedData['blog_id'],
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listBlogTag($blogId)
    {
        try {
            $data = BlogTagModel::select('name', 'blog_id', 'created_at', 'id')
                ->where('blog_tags.blog_id', '=', $blogId)
                ->latest('created_at')->get();
            Log::info($data);
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function updateBlogTag(Request $request)
    {
        Log::info($request->all());
        $this->validator($request->all())->validate();
        try {
            $this->updateBlogTagFunc($request->all());
            return response()->json([
                'name' => $request->get('name'),
                'id' => $request->get('id'),
                'blog_id' => $request->get('blog_id')
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function deleteBlogTag(Request $request)
    {
        Log::info($request->all());
        try {
            BlogTagModel::where('id', $request->get('id'))->delete();
            return response()->json([
                'id' => $request->get('id')
            ]);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    private function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required'],
        ]);
    }

    private function addBlogTagFunc(array $data)
    {
        return BlogTagModel::create($data, [
            'name' => $data['name'],
            'blog_id' => $data['blog_id'],
        ]);
    }

    private function updateBlogTagFunc(array $data)
    {
        $blogTag = BlogTagModel::find($data['id']);
        $blogTag->name = $data['name'];
        return $blogTag->save();
    }
}
