<?php

namespace App\Http\Controllers;

use App\File;
use App\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PartnerController extends Controller
{

    public function store(Request $request)
    {
        $data = json_decode($request->get('integratedFormData'));
        $this->validator([
            "title" => $data->title,
            "link" => $data->link,
            "language" => $data->language,
            "files" => $request->file('file'),
        ])->validate();

        $partnerFile = $request->file('file');
        Storage::makeDirectory('partnerFiles');
        $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $partnerFile->getClientOriginalExtension();
        try {
            DB::beginTransaction();
            $file = File::create([
                'path' => $filePath
            ]);
            $data->files_id = $file->id;
            $insertedData = Partner::create([
                "title" => $data->title,
                "link" => $data->link,
                "language" => $data->language,
                "files_id" => $data->files_id,
            ]);
            Storage::disk('local')->put('partnerFiles/' . $filePath, \Illuminate\Support\Facades\File::get($partnerFile));
            DB::commit();
            $insertedData->path = $filePath;
            return response()->json($insertedData);
        } catch (\Exception $exception) {
            if ($request->hasFile('file')) {
                Storage::delete('partnerFiles/' . $filePath);
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
            "language" => $data->language,
            "files" => $request->file('file'),
        ])->validate();

        try {
            DB::beginTransaction();
            $updateData = Partner::findOrFail($data->id);
            $updateData->title = $data->title;
            $updateData->link = $data->link;
            $updateData->save();
            if ($request->hasFile('file')) {
                $partnerFile = $request->file('file');
                $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $partnerFile->getClientOriginalExtension();
                $file = File::findOrFail($data->files_id);
                $preFilePath = $file->path;
                $file->path = $filePath;
                $file->save();
                Storage::disk('local')->put('partnerFiles/' . $filePath, \Illuminate\Support\Facades\File::get($partnerFile));
                Storage::delete('partnerFiles/' . $preFilePath);
                $updateData->path = $filePath;
            }
            DB::commit();

            return response()->json($updateData);
        } catch (\Exception $exception) {
            if ($request->hasFile('file')) {
                Storage::delete('partnerFiles/' . $filePath);
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
            $partnerData = Partner::findOrFail($id);
            if ($partnerData) {
                $data = File::findOrFail($partnerData->files_id);
                $partnerData->delete();
                $data->delete();
                Storage::delete('partnerFiles/' . $data->path);
            }
            DB::commit();
            return response()->json($partnerData);
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
            'files' => ['required', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
            'link' => ['required', 'string', 'min:3', 'max:255'],
            'language' => ['string'],
        ]);
    }

    protected function updateValidator(array $data)
    {
        return Validator::make($data, [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'files' => ['nullable', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
            'link' => ['required', 'string', 'min:3', 'max:255'],
            'language' => ['string'],
        ]);
    }


    public function partnerList()
    {
        $data = File::select('files.path', 'partner.id', 'title', 'language', 'link', 'files_id')
            ->join('partner', 'partner.files_id', '=', 'files.id')
            ->latest('partner.created_at')->get();
        return response()->json($data);
    }


}
