<?php

namespace App\Http\Controllers;

use App\BlogDetailsFilesModel;
use App\BlogDetailsModel;
use App\BlogModel;
use App\FileModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BlogContentController extends Controller
{
    //
    public function addBlogContent(Request $request)
    {
        if ($request->file('file')) {
            $data = json_decode($request->get('integratedFormData'));
            $this->blogContentValidator([
                'blog_id' => $data->blog_id,
                'title' => $data->title,
                'content' => $data->content,
                'is_main_file' => $data->is_main_file,
                'image_path' => $request->file('file')
            ])->validate();
            $image = $request->file('file');
            Storage::makeDirectory('blogContentFile');
            $imagePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $image->getClientOriginalExtension();
            try {
                DB::beginTransaction();
                $data->image_path = $imagePath;
                $insertedContentData = $this->addBlogContentFunc([
                    'title' => $data->title,
                    'blog_id' => $data->blog_id,
                    'content' => $data->content
                ]);
                $insertedImage = FileModel::create([
                    'path' => $data->image_path
                ]);
                $blogDetailsFiles = BlogDetailsFilesModel::create([
                    'blog_details_id' => $insertedContentData->id,
                    'file_id' => $insertedImage->id,
                    'is_main_file' => $data->is_main_file
                ]);
                Storage::disk('local')->put('blogContentFile/' . $imagePath, File::get($image));

                DB::commit();
                return response()->json([
                    'title' => $insertedContentData->title,
                    'content' => $insertedContentData->content,
                    'content_id' => $insertedContentData->id,
                    'blog_id' => $insertedContentData->blog_id,
                    'image_path' => $insertedImage->path,
                    'file_id' => $insertedImage->id,
                    'is_main_file' => $blogDetailsFiles->is_main_file,
                    'blog_details_files_id' => $blogDetailsFiles->id
                ]);
            } catch (\Exception $exception) {
                if ($request->hasFile('file')) {
                    Storage::delete('blogContentFile/' . $data->image_path);
                }
                DB::rollBack();
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        } else {
            try {
                $insertedContentData = $this->addBlogContentFunc([
                    'title' => $request->get('title'),
                    'blog_id' => $request->get('blog_id'),
                    'content' => $request->get('content'),
                ]);
                return response()->json([
                    'title' => $insertedContentData->title,
                    'content' => $insertedContentData->content,
                    'blog_id' => $insertedContentData->blog_id,
                    'content_id' => $insertedContentData->id,
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }


    }

    public function updateBlogContent(Request $request)
    {
        $file_id = null;
        if ($request->file('file')) {
            $data = json_decode($request->get('integratedFormData'));
            $this->blogContentValidator([
                'blog_id' => $data->blog_id,
                'title' => $data->title,
                'content' => $data->content,
                'is_main_file' => $data->is_main_file,
                'image_path' => $request->file('file')
            ])->validate();
            $image = $request->file('file');
            Storage::makeDirectory('blogContentFile');
            $imagePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $image->getClientOriginalExtension();
            try {
                DB::beginTransaction();
                $data->image_path = $imagePath;
                $this->updateBlogContentFunc([
                    'content_id' => $data->content_id,
                    'title' => $data->title,
                    'blog_id' => $data->blog_id,
                    'content' => $data->content
                ]);
                if ($data->former_image_path === null) {
                    $insertedImage = FileModel::create([
                        'path' => $data->image_path
                    ]);
                    $file_id = $insertedImage->id;
                    $blogDetailsFiles = BlogDetailsFilesModel::create([
                        'blog_details_id' => $data->content_id,
                        'file_id' => $insertedImage->id,
                        'is_main_file' => $data->is_main_file
                    ]);
                } else {
                    $this->updateFile([
                        'file_id' => $data->file_id,
                        'image_path' => $data->image_path
                    ]);
                    $this->updateBlogDetailsFile([
                        'is_main_file' => $data->is_main_file,
                        'blog_details_files_id' => $data->blog_details_files_id
                    ]);
                    $file_id = $data->file_id;
                }

                Storage::disk('local')->put('blogContentFile/' . $imagePath, File::get($image));

                DB::commit();
                return response()->json([
                    'blog_id' => $data->blog_id,
                    'title' => $data->title,
                    'content' => $data->content,
                    'content_id' => $data->content_id,
                    'image_path' => $data->image_path,
                    'is_main_file' => $data->is_main_file,
                    'file_id' => $file_id
                ]);
            } catch (\Exception $exception) {
                if ($request->hasFile('file')) {
                    Storage::delete('blogContentFile/' . $data->image_path);
                }
                DB::rollBack();
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        } else {
            try {
                if ($request->get('former_image_path') !== null) {
                    BlogDetailsFilesModel::where('blog_details_files.blog_details_id', $request->get('content_id'))->delete();
                    FileModel::where('id', $request->get('file_id'))->delete();
                }
                $this->updateBlogContentFunc([
                    'content_id' => $request->get('content_id'),
                    'title' => $request->get('title'),
                    'blog_id' => $request->get('blog_id'),
                    'content' => $request->get('content'),
                ]);
                return response()->json([
                    'title' => $request->get('title'),
                    'content' => $request->get('content'),
                    'content_id' => $request->get('content_id'),
                    'blog_id' => $request->get('blog_id'),
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }

    }

    public function listBlogContent($blogId)
    {
        try {
            $data = BlogDetailsModel::select('title', 'blog_id', 'content', 'blog_details_files.is_main_file',
                'blog_details_files.id as blog_details_files_id', 'path as image_path', 'blog_details.id as content_id',
                'files.id as file_id')
                ->leftJoin('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->leftJoin('files', 'blog_details_files.file_id', '=', 'files.id')
                ->where('blog_details.blog_id', '=', $blogId)
                ->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function deleteBlogContent(Request $request)
    {

        try {
            DB::beginTransaction();
            if ($request->get('image_path' === null)) {
                BlogDetailsModel::where('id', $request->get('content_id'))->delete();
                DB::commit();
                return response()->json([
                    'content_id' => $request->get('content_id')
                ]);
            } else {
                BlogDetailsFilesModel::where('blog_details_files.blog_details_id', $request->get('content_id'))->delete();
                BlogDetailsModel::where('id', $request->get('content_id'))->delete();
                FileModel::where('id', $request->get('file_id'))->delete();
                DB::commit();
                return response()->json([
                    'content_id' => $request->get('content_id')
                ]);
            }

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listAllBlog($offset)
    {
        try {
            $data = BlogModel::select('blog.title', 'user_id', 'full_name', 'blog_status_id', 'blog_category_id', 'blog_resource', 'status',
                'blog.created_at', 'blog_details_files.is_main_file',
                'blog.id', 'content', 'path', 'blog_details.title as subtitle')
                ->leftJoin('blog_details', 'blog.id', '=', 'blog_details.blog_id')
                ->leftJoin('blog_details_files', 'blog_details.id', '=', 'blog_details_files.blog_details_id')
                ->leftJoin('files', 'blog_details_files.file_id', '=', 'files.id')
                ->leftJoin('users', 'blog.user_id', '=', 'users.id')
                ->join('blog_status', 'blog.blog_status_id', '=', 'blog_status.id')
                ->where([
                    ['blog_details_files.is_main_file', '=', 1],
                ])
                ->limit(8)
                ->offset($offset)
                ->latest('created_at')->get();
            return response()->json($data);

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    private function addBlogContentFunc(array $data)
    {
        return BlogDetailsModel::create($data, [
            'title' => $data['title'],
            'blog_id' => $data['blog_id'],
            'content' => $data['content'],
        ]);
    }

    private function updateBlogContentFunc(array $data)
    {
        $blogContent = BlogDetailsModel::find($data['content_id']);
        $blogContent->title = $data['title'];
        $blogContent->content = $data['content'];
        $blogContent->blog_id = $data['blog_id'];
        return $blogContent->save();
    }

    private function updateFile(array $data)
    {
        $contentImage = FileModel::find($data['file_id']);
        $contentImage->path = $data['image_path'];
        return $contentImage->save();
    }

    private function updateBlogDetailsFile(array $data)
    {
        $updateMainFile = BlogDetailsFilesModel::find($data['blog_details_files_id']);
        $updateMainFile->is_main_file = $data['is_main_file'];
        return $updateMainFile->save();
    }

    protected function blogContentValidator(array $data)
    {
        return Validator::make($data, [
            'title' => [],
            'blog_id' => ['required', 'numeric'],
            'content' => ['required', 'string'],
            'image_path' => [],
            'is_main_file' => []
        ]);
    }
}
