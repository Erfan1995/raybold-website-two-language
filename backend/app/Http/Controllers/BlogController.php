<?php

namespace App\Http\Controllers;

use App\BlogCommentModel;
use App\BlogDetailsFilesModel;
use App\BlogDetailsModel;
use App\BlogModel;
use App\BlogTagModel;
use App\FileModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    //
    public function addBlogInfo(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $insertedData = $this->addBlogInfoFunc($request->all());
            return response()->json([
                'id' => $insertedData['id'],
                'title' => $insertedData['title'],
                'blog_category_id' => $insertedData['blog_category_id'],
                'blog_status_id' => $insertedData['blog_status_id'],
                'blog_resource' => $insertedData['blog_resource'],
                'user_id' => $insertedData['user_id'],
                'created_at' => $insertedData['created_at']
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listBlogInfo($blogListItemRange, $userId)
    {
        try {
            $data = BlogModel::select('title', 'user_id', 'blog_status_id', 'blog_category_id', 'blog_resource', 'created_at', 'id')
                ->take($blogListItemRange)
                ->where('user_id', $userId)
                ->latest('created_at')
                ->limit(10)
                ->offset($blogListItemRange)
                ->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function updateBlogInfo(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $this->updateBlogInfoFunc($request->all());
            return response()->json([
                'title' => $request->get('title'),
                'blog_category_id' => $request->get('blog_category_id'),
                'blog_resource' => $request->get('blog_resource'),
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function deleteBlogInfo(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = BlogDetailsModel::select('title', 'blog_id', 'content', 'path as image_path', 'blog_details.id as content_id', 'files.id as file_id')
                ->leftJoin('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->leftJoin('files', 'blog_details_files.file_id', '=', 'files.id')
                ->where('blog_details.blog_id', '=', $request->get('id'))
                ->get();
            for ($i = 0; $i < count($data); $i++) {
                if ($data[$i]->image_path !== null) {
                    BlogDetailsFilesModel::where('blog_details_files.blog_details_id', $data[$i]->content_id)->delete();
                    BlogDetailsModel::where('id', $data[$i]->content_id)->delete();
                    FileModel::where('id', $data[$i]->file_id)->delete();
                } else {
                    BlogDetailsModel::where('id', $data[$i]->content_id)->delete();
                }
            }
            BlogTagModel::where('blog_id', $request->get('id'))->delete();
            BlogCommentModel::where('blog_id', $request->get('id'))->delete();
            BlogModel::where('id', $request->get('id'))->delete();
            DB::commit();
            return response()->json([
                'id' => $request->get('id')
            ]);

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function updateBlogStatus(Request $request)
    {
        try {
            $blogInfo = BlogModel::find($request->get('id'));
            $blogInfo->blog_status_id = $request->get('blog_status_id');
            $blogInfo->save();
            return response()->json([
                'blog_status_id' => $request->get('blog_status_id')
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
            'title' => ['required'],
            'blog_category_id' => ['required', 'integer'],

        ]);
    }

    private function updateBlogInfoFunc(array $data)
    {
        $blogInfo = BlogModel::find($data['id']);
        $blogInfo->title = $data['title'];
        $blogInfo->blog_category_id = $data['blog_category_id'];
        $blogInfo->blog_resource = $data['blog_resource'];
        return $blogInfo->save();
    }

    private function addBlogInfoFunc(array $data)
    {
        return BlogModel::create($data, [
            'title' => $data['title'],
            'blog_resource' => $data['blog_resource'],
            'blog_category_id' => $data['blog_category_id'],
            'user_id' => $data['user_id'],
            'blog_status_id' => $data['blog_status_id']
        ]);
    }

    ///
    ///
    /// website
    ///
    ///
    public function listLatestBlog()
    {
        try {
            $data = BlogModel::select('blog.title', 'user_id', 'full_name', 'blog_status_id', 'blog_category_id', 'blog_resource', 'blog.created_at',
                'blog.id', 'content', 'path', 'blog_details.title as subtitle')
                ->join('blog_details', 'blog.id', '=', 'blog_details.blog_id')
                ->join('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->join('files', 'blog_details_files.file_id', '=', 'files.id')
                ->join('users', 'blog.user_id', '=', 'users.id')
                ->where([
                    ['blog_details_files.is_main_file', '=', 1],
                    ['blog.blog_status_id', '=', 2]
                ])
                ->limit(3)
                ->latest('created_at')->get();

            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listBlogWithOffset($offset)
    {
        try {
            $data = BlogModel::select('blog.title', 'user_id', 'full_name', 'blog_status_id', 'blog_category_id', 'blog_resource', 'blog.created_at',
                'blog.id', 'content', 'path', 'blog_details.title as subtitle')
                ->join('blog_details', 'blog.id', '=', 'blog_details.blog_id')
                ->join('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->join('files', 'blog_details_files.file_id', '=', 'files.id')
                ->join('users', 'blog.user_id', '=', 'users.id')
                ->where([
                    ['blog_details_files.is_main_file', '=', 1],
                    ['blog.blog_status_id', '=', 2]
                ])
                ->limit(6)
                ->offset($offset)
                ->latest('created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function searchBlog(Request $request)
    {
        try {
            $data = BlogModel::select('blog.title', 'user_id', 'full_name', 'blog_status_id', 'blog_category_id', 'blog_resource', 'blog.created_at',
                'blog.id', 'content', 'path', 'blog_details.title as subtitle', 'blog_tags.name as tag_name')
                ->join('blog_details', 'blog.id', '=', 'blog_details.blog_id')
                ->join('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->join('files', 'blog_details_files.file_id', '=', 'files.id')
                ->join('users', 'blog.user_id', '=', 'users.id')
                ->join('blog_tags', 'blog.id', '=', 'blog_tags.blog_id')
                ->where([
                    ['blog_details_files.is_main_file', '=', 1],
                    ['blog.blog_status_id', '=', 2],
                    ['blog_tags.name', 'like', '%' . $request->get('tag_name') . '%'],


                ])
                ->latest('created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listBlogContentAndTags($blogId)
    {
        try {
            DB::beginTransaction();
            $data = BlogModel::select('blog_details.title', 'blog_id', 'content', 'blog_details_files.is_main_file','full_name','blog.created_at',
                'blog_details_files.id as blog_details_files_id', 'path as image_path', 'blog_details.id as content_id', 'files.id as file_id')
                ->join('blog_details', 'blog.id', '=', 'blog_details.blog_id')
                ->leftJoin('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->leftJoin('files', 'blog_details_files.file_id', '=', 'files.id')
                ->join('users', 'blog.user_id', '=', 'users.id')
                ->where([
                    ['blog_details.blog_id', '=', $blogId],
                ])
                ->get();
            $blogTag = BlogTagModel::select('name', 'blog_id')->where('blog_id', '=', $blogId)->get();
            DB::commit();
            return response()->json([
                'content' => $data,
                'tags' => $blogTag
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listRelatedBlog($categoryId)
    {
        try {
            $data = BlogModel::select('blog.title', 'user_id', 'full_name', 'blog_category_id', 'blog_resource', 'blog.created_at',
                'blog.id', 'content', 'path')
                ->join('blog_details', 'blog.id', '=', 'blog_details.blog_id')
                ->join('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->join('files', 'blog_details_files.file_id', '=', 'files.id')
                ->join('users', 'blog.user_id', '=', 'users.id')
                ->where([
                    ['blog_details_files.is_main_file', '=', 1],
                    ['blog.blog_status_id', '=', 2]
                ])
                ->where('blog.blog_category_id', '=', $categoryId)
                ->limit(5)
                ->latest('created_at')->get();

            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }
}
