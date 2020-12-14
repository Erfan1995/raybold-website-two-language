<?php

namespace App\Http\Controllers;

use App\FileModel;
use App\Product;
use App\ProductDetailsFilesModel;
use App\ProductDetailsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    //

    public function store(Request $request)
    {

        $this->validator($request->all())->validate();
        try {
            $insertedData = Product::create($request->all());
            return response()->json($insertedData);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    protected function fileValidator(array $data)
    {
        return Validator::make($data, [
            'product_id' => ['required', 'numeric'],
            'isMainFile' => ['required', 'boolean'],
            'path' => ['required', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
        ]);
    }


    public function update(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $data = Product::findOrFail($request->get('id'));
            $data->title = $request->get('title');
            $data->link = $request->get('link');
            $data->language = $request->get('language');
            $data->save();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            DB::beginTransaction();
            $data = ProductDetailsModel::select('title', 'product_id', 'content', 'path as file_path', 'product_details.id as content_id',
                'files.id as file_id')
                ->leftJoin('product_details_files', 'product_details.id', '=', 'product_details_files.product_details_id')
                ->leftJoin('files', 'product_details_files.files_id', '=', 'files.id')
                ->where('product_details.product_id', '=', $id)
                ->get();
            for ($i = 0; $i < count($data); $i++) {
                if ($data[$i]->file_path !== null) {
                    ProductDetailsFilesModel::where('product_details_files.product_details_id', $data[$i]->content_id)->delete();
                    ProductDetailsModel::where('id', $data[$i]->content_id)->delete();
                    FileModel::where('id', $data[$i]->file_id)->delete();
                } else {
                    ProductDetailsModel::where('id', $data[$i]->content_id)->delete();
                }
            }
            Product::where('id', $id)->delete();
            DB::commit();
            return response()->json([
                'id' => $id
            ]);

        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }

    }


    protected function validator(array $data)
    {
        return Validator::make($data, [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'link' => ['required', 'string', 'min:3', 'max:255'],
            'language' => ['string'],

        ]);
    }


    public function productList()
    {
        $data = Product::latest('created_at')->get();
        return response()->json($data);
    }

    public function listAllProducts()
    {
        try {
            $data = Product::select('link', 'products.id as product_id', 'products.title', 'content', 'path',
                'files.id', 'product_details_files.is_main_file')
                ->join('product_details', 'product_details.product_id', '=', 'products.id')
                ->join('product_details_files', 'product_details.id', '=', 'product_details_files.product_details_id')
                ->join('files', 'files.id', '=', 'product_details_files.files_id')
                ->where('product_details_files.is_main_file', '=', 1)
                ->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listProductsForWebsite()
    {
        try {
            $data = Product::select('products.title', 'products.id as products_id',
                'content', 'path', 'product_details.title as subtitle')
                ->join('product_details', 'products.id', '=', 'product_details.product_id')
                ->join('product_details_files', 'product_details.id', '=', 'product_details_files.product_details_id')
                ->join('files', 'product_details_files.files_id', '=', 'files.id')
                ->where([
                    ['product_details_files.is_main_file', '=', 1],
                ])
                ->latest('products.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }
}
