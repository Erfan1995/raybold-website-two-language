<?php

namespace App\Http\Controllers;

use App\File;
use App\AboutUs;
use App\AboutUsFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AboutUsController extends Controller
{

    public function store(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $insertedData = AboutUs::create($request->all());
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
            'about_us_id' => ['required', 'numeric'],
            'path' => ['required', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
        ]);
    }

    public function storeAboutUsFiles(Request $request)
    {
        $data = json_decode($request->get('integratedFormData'));
        $this->fileValidator(
            [
                'about_us_id' => $data->about_us_id,
                'path' => $request->file('file')
            ])->validate();
        $aboutUsFile = $request->file('file');
        Storage::makeDirectory('aboutUsFiles');
        $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $aboutUsFile->getClientOriginalExtension();
        try {
            DB::beginTransaction();
            $file = File::create([
                'path' => $filePath
            ]);
            $insertedData = AboutUsFile::create([
                'about_us_id' => $data->about_us_id,
                'files_id' => $file->id
            ]);

            Storage::disk('local')->put('aboutUsFiles/' . $filePath, \Illuminate\Support\Facades\File::get($aboutUsFile));
            DB::commit();
            return response()->json([
                'id' => $insertedData->files_id,
                'about_us_id' => $insertedData->about_us_id,
                'path' => $filePath
            ]);
        } catch (\Exception $exception) {
            if ($request->hasFile('file')) {
                Storage::delete('aboutUsFiles/' . $filePath);
            }
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }


    }

    public function update(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $data = AboutUs::findOrFail($request->get('id'));
            $data->title = $request->get('title');
            $data->content = $request->get('content');
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
            $data = AboutUs::findOrFail($id);

            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function deleteFile($id)
    {
        try {
            $data = File::findOrFail($id);
            if ($data) {
                Storage::delete('aboutUsFiles/' . $data->path);
                $data->delete();
            }
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'content' => ['required', 'string', 'min:3'],
        ]);
    }


    public function aboutUsList()
    {
        $data = AboutUs::latest('created_at')->get();
        return response()->json($data);
    }

    public function listAboutUsFiles($aboutUsId)
    {
        $data = File::select('files.path', 'files.id')
            ->join('about_us_files', 'about_us_files.files_id', '=', 'files.id')
            ->where('about_us_files.about_us_id', $aboutUsId)
            ->latest('about_us_files.created_at')
            ->get();
        return response()->json($data);
    }

    public function aboutUsInfo()
    {
        try {
            $data = AboutUs::select('title', 'content', 'path')
                ->join('about_us_files', 'about_us.id', '=', 'about_us_files.about_us_id')
                ->join('files', 'about_us_files.files_id', '=', 'files.id')
                ->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }
}
