<?php

namespace App\Http\Controllers;

use App\FileModel;
use App\Product;
use App\ProductDetailsFilesModel;
use App\ProductDetailsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductContentController extends Controller
{
    //

    public function addProductContent(Request $request)
    {
        if ($request->file('file')) {
            $data = json_decode($request->get('integratedFormData'));
            $this->productContentValidator([
                'product_id' => $data->product_id,
                'title' => $data->title,
                'content' => $data->content,
                'language' => $data->language,
                'is_main_file' => $data->is_main_file,
                'file_path' => $request->file('file')
            ])->validate();
            $file = $request->file('file');
            Storage::makeDirectory('productFiles');
            $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $file->getClientOriginalExtension();
            try {
                DB::beginTransaction();
                $data->file_path = $filePath;
                $insertedContentData = $this->addProductContentFunc([
                    'title' => $data->title,
                    'product_id' => $data->product_id,
                    'content' => $data->content,
                    'language' => $data->language,
                ]);
                $insertedFile = FileModel::create([
                    'path' => $data->file_path
                ]);
                $productDetailsFiles = ProductDetailsFilesModel::create([
                    'product_details_id' => $insertedContentData->id,
                    'files_id' => $insertedFile->id,
                    'is_main_file' => $data->is_main_file
                ]);
                Storage::disk('local')->put('productFiles/' . $filePath, File::get($file));

                DB::commit();
                return response()->json([
                    'title' => $insertedContentData->title,
                    'content' => $insertedContentData->content,
                    'content_id' => $insertedContentData->id,
                    'product_id' => $insertedContentData->product_id,
                    'file_path' => $insertedFile->path,
                    'file_id' => $insertedFile->id,
                    'is_main_file' => $productDetailsFiles->is_main_file
                ]);
            } catch (\Exception $exception) {
                if ($request->hasFile('file')) {
                    Storage::delete('productFiles/' . $data->file_path);
                }
                DB::rollBack();
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        } else {
            try {
                $insertedContentData = $this->addProductContentFunc([
                    'title' => $request->get('title'),
                    'product_id' => $request->get('product_id'),
                    'content' => $request->get('content'),
                    'language' => $request->get('language'),
                ]);
                return response()->json([
                    'title' => $insertedContentData->title,
                    'content' => $insertedContentData->content,
                    'product_id' => $insertedContentData->product_id,
                    'content_id' => $insertedContentData->id,
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }
    }

    public function updateProductContent(Request $request)
    {
        $file_id = null;
        if ($request->file('file')) {
            $data = json_decode($request->get('integratedFormData'));
            $this->productContentValidator([
                'product_id' => $data->product_id,
                'title' => $data->title,
                'content' => $data->content,
                'is_main_file' => $data->is_main_file,
                'file_path' => $request->file('file')
            ])->validate();
            $file = $request->file('file');
            Storage::makeDirectory('productFiles');
            $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $file->getClientOriginalExtension();
            try {
                DB::beginTransaction();
                $data->file_path = $filePath;
                $this->updateProductContentFunc([
                    'content_id' => $data->content_id,
                    'title' => $data->title,
                    'product_id' => $data->product_id,
                    'content' => $data->content
                ]);
                if ($data->former_file_path === null) {
                    $insertedFile = FileModel::create([
                        'path' => $data->file_path
                    ]);
                    $file_id = $insertedFile->id;
                    $serviceDetailsFiles = ProductDetailsFilesModel::create([
                        'product_details_id' => $data->content_id,
                        'files_id' => $insertedFile->id,
                        'is_main_file' => $data->is_main_file
                    ]);
                } else {
                    $this->updateFile([
                        'file_id' => $data->file_id,
                        'file_path' => $data->file_path
                    ]);
                    $this->updateProductDetailsFile([
                        'is_main_file' => $data->is_main_file,
                        'product_details_files_id' => $data->product_details_files_id
                    ]);
                    $file_id = $data->file_id;
                }

                Storage::disk('local')->put('productFiles/' . $filePath, File::get($file));
                DB::commit();
                return response()->json([
                    'product_id' => $data->product_id,
                    'title' => $data->title,
                    'content' => $data->content,
                    'content_id' => $data->content_id,
                    'file_path' => $data->file_path,
                    'file_id' => $file_id,
                    'is_main_file' => $data->is_main_file
                ]);
            } catch (\Exception $exception) {
                if ($request->hasFile('file')) {
                    Storage::delete('productFiles/' . $data->file_path);
                }
                DB::rollBack();
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        } else {
            try {

                if ($request->get('former_file_path') !== null) {
                    ProductDetailsFilesModel::where('product_details_files.product_details_id', $request->get('content_id'))->delete();
                    FileModel::where('id', $request->get('file_id'))->delete();
                }
                $this->updateProductContentFunc([
                    'content_id' => $request->get('content_id'),
                    'title' => $request->get('title'),
                    'product_id' => $request->get('product_id'),
                    'content' => $request->get('content'),
                ]);
                return response()->json([
                    'title' => $request->get('title'),
                    'content' => $request->get('content'),
                    'content_id' => $request->get('content_id'),
                    'product_id' => $request->get('product_id'),
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }
    }

    public function listProductContent($productId, $lan)
    {
        try {
            $data = ProductDetailsModel::select('title', 'product_id', 'content', 'path as file_path',
                'product_details_files.id as product_details_files_id', 'product_details_files.is_main_file',
                'product_details.id as content_id', 'product_details.language', 'files.id as file_id')
                ->leftJoin('product_details_files', 'product_details.id', '=', 'product_details_files.product_details_id')
                ->leftJoin('files', 'product_details_files.files_id', '=', 'files.id')
                ->where('product_details.product_id', '=', $productId)
                ->where('product_details.language', '=', $lan)
                ->latest('product_details.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listProductContentWebsite($lang, $productId)
    {
        try {
            $data = ProductDetailsModel::select('title', 'product_id', 'content', 'path as file_path',
                'product_details_files.id as product_details_files_id', 'product_details_files.is_main_file',
                'product_details.id as content_id', 'product_details.language', 'files.id as file_id')
                ->leftJoin('product_details_files', 'product_details.id', '=', 'product_details_files.product_details_id')
                ->leftJoin('files', 'product_details_files.files_id', '=', 'files.id')
                ->where('product_details.product_id', '=', $productId)
                ->where('product_details.language', '=', $lang)
                ->latest('product_details.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function deleteProductContent(Request $request)
    {
        try {
            DB::beginTransaction();
            if ($request->get('file_path' === null)) {
                ProductDetailsModel::where('id', $request->get('content_id'))->delete();
                DB::commit();
                return response()->json([
                    'content_id' => $request->get('content_id')
                ]);
            } else {
                ProductDetailsFilesModel::where('product_details_files.product_details_id', $request->get('content_id'))->delete();
                ProductDetailsModel::where('id', $request->get('content_id'))->delete();
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

    public function listAllProducts()
    {
        try {
            DB::beginTransaction();
            $productData = Product::select('id', 'title', 'created_at')->get();
            $jsonResult = array();
            for ($i = 0; $i < count($productData); $i++) {
                $jsonResult[$i]['title'] = $productData[$i]->title;
                $jsonResult[$i]['product_id'] = $productData[$i]->id;
                $jsonResult[$i]['created_date'] = $productData[$i]->created_at;
                $productId = $productData[$i]->id;
                $jsonResult[$i]['product_details'] = ProductDetailsModel::select('title', 'product_id', 'content', 'path as file_path',
                    'product_details.id as content_id', 'product_details_files.is_main_file', 'files.id as file_id')
                    ->leftJoin('product_details_files', 'product_details.id', '=', 'product_details_files.product_details_id')
                    ->leftJoin('files', 'product_details_files.files_id', '=', 'files.id')
                    ->where('product_details.product_id', '=', $productId)
                    ->get();
            }
            DB::commit();
            return response()->json($jsonResult);

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    private function addProductContentFunc(array $data)
    {
        return ProductDetailsModel::create($data, [
            'title' => $data['title'],
            'product_id' => $data['product_id'],
            'content' => $data['content'],
            'language' => $data['language'],
        ]);
    }

    protected function productContentValidator(array $data)
    {
        return Validator::make($data, [
            'product_id' => ['required', 'numeric'],
            'content' => ['required', 'string'],
            'language' => ['string'],
            'file_path' => ['mimes:mp4,mov,flv,ogg,jpg,png,jpeg'],
            'is_main_file' => []
        ]);
    }

    private function updateProductContentFunc(array $data)
    {
        $productContent = ProductDetailsModel::find($data['content_id']);
        $productContent->title = $data['title'];
        $productContent->content = $data['content'];
        $productContent->product_id = $data['product_id'];
        return $productContent->save();
    }

    private function updateFile(array $data)
    {
        $contentFile = FileModel::find($data['file_id']);
        $contentFile->path = $data['file_path'];
        return $contentFile->save();
    }

    private function updateProductDetailsFile(array $data)
    {
        $updateMainFile = ProductDetailsFilesModel::find($data['product_details_files_id']);
        $updateMainFile->is_main_file = $data['is_main_file'];
        return $updateMainFile->save();
    }

}
