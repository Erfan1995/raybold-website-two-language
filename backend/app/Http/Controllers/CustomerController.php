<?php

namespace App\Http\Controllers;

use App\File;
use App\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{

    public function store(Request $request)
    {
        $data = json_decode($request->get('integratedFormData'));
        $this->validator([
            "title" => $data->title,
            "link" => $data->link,
            "review" => $data->review,
            "language" => $data->language,
            "files" => $request->file('file'),
        ])->validate();

        $customerFile = $request->file('file');
        Storage::makeDirectory('customerFiles');
        $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $customerFile->getClientOriginalExtension();
        try {
            DB::beginTransaction();
            $file = File::create([
                'path' => $filePath
            ]);
            $data->file_id = $file->id;
            $insertedData = Customer::create([
                "title" => $data->title,
                "link" => $data->link,
                "review" => $data->review,
                "language" => $data->language,
                "file_id" => $data->file_id,
            ]);
            Storage::disk('local')->put('customerFiles/' . $filePath, \Illuminate\Support\Facades\File::get($customerFile));
            DB::commit();
            $insertedData->path = $filePath;
            return response()->json($insertedData);
        } catch (\Exception $exception) {
            if ($request->hasFile('file')) {
                Storage::delete('customerFiles/' . $filePath);
            }
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $data = json_decode($request->get('integratedFormData'));
        $this->updateValidator([
            "title" => $data->title,
            "link" => $data->link,
            "review" => $data->review,
            "language" => $data->language,
            "files" => $request->file('file'),
        ])->validate();

        try {
            DB::beginTransaction();
            $updateData = Customer::findOrFail($data->id);
            $updateData->title = $data->title;
            $updateData->link = $data->link;
            $updateData->review = $data->review;
            $updateData->save();
            if ($request->hasFile('file')) {
                $customerFile = $request->file('file');
                $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $customerFile->getClientOriginalExtension();
                $file = File::findOrFail($data->file_id);
                $preFilePath = $file->path;
                $file->path = $filePath;
                $file->save();
                Storage::disk('local')->put('customerFiles/' . $filePath, \Illuminate\Support\Facades\File::get($customerFile));
                Storage::delete('customerFiles/' . $preFilePath);
                $updateData->path = $filePath;
            }
            DB::commit();

            return response()->json($updateData);
        } catch (\Exception $exception) {
            if ($request->hasFile('file')) {
                Storage::delete('customerFiles/' . $filePath);
            }
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }


    public function delete($id)
    {
        try {
            DB::beginTransaction();
            $customerData = Customer::findOrFail($id);
            if ($customerData) {
                $data = File::findOrFail($customerData->file_id);
                $customerData->delete();
                $data->delete();
                Storage::delete('customerFiles/' . $data->path);
            }
            DB::commit();
            return response()->json($customerData);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'review' => ['required', 'string', 'min:3', 'max:500'],
            'files' => ['required', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
            'link' => ['required', 'string', 'min:3', 'max:255'],
            'language' => ['string'],
        ]);
    }

    protected function updateValidator(array $data)
    {
        return Validator::make($data, [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'review' => ['required', 'string', 'min:3', 'max:500'],
            'files' => ['nullable', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
            'link' => ['required', 'string', 'min:3', 'max:255'],
            'language' => ['string'],

        ]);
    }


    public function customerList()
    {
        $data = File::select('files.path', 'customers.id', 'title', 'review', 'language', 'link', 'file_id')
            ->join('customers', 'customers.file_id', '=', 'files.id')
            ->latest('customers.created_at')->get();
        return response()->json($data);
    }

    public function customerListWebsite($lang)
    {
        $data = File::select('files.path', 'customers.id', 'title', 'review', 'language', 'link', 'file_id')
            ->join('customers', 'customers.file_id', '=', 'files.id')
            ->where('customers.language', '=', $lang)
            ->latest('customers.created_at')->get();
        return response()->json($data);
    }


}
