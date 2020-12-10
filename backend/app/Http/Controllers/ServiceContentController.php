<?php

namespace App\Http\Controllers;

use App\FileModel;
use App\ServiceDetailsFilesModel;
use App\ServiceDetailsModel;
use App\ServiceInfoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ServiceContentController extends Controller
{
    //

    public function addServiceContent(Request $request)
    {
        if ($request->file('file')) {
            $data = json_decode($request->get('integratedFormData'));
            $this->serviceContentValidator([
                'service_id' => $data->service_id,
                'subtitle' => $data->subtitle,
                'content' => $data->content,
                'is_main_file' => $data->is_main_file,
                'file_path' => $request->file('file')
            ])->validate();
            $file = $request->file('file');
            Storage::makeDirectory('serviceContentFile');
            $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $file->getClientOriginalExtension();
            try {
                DB::beginTransaction();
                $data->file_path = $filePath;
                $insertedContentData = $this->addServiceContentFunc([
                    'subtitle' => $data->subtitle,
                    'service_id' => $data->service_id,
                    'content' => $data->content
                ]);
                $insertedFile = FileModel::create([
                    'path' => $data->file_path
                ]);
                $serviceDetailsFiles = ServiceDetailsFilesModel::create([
                    'service_details_id' => $insertedContentData->id,
                    'files_id' => $insertedFile->id,
                    'is_main_file' => $data->is_main_file
                ]);
                Storage::disk('local')->put('serviceContentFile/' . $filePath, File::get($file));

                DB::commit();
                return response()->json([
                    'subtitle' => $insertedContentData->subtitle,
                    'content' => $insertedContentData->content,
                    'content_id' => $insertedContentData->id,
                    'service_id' => $insertedContentData->service_id,
                    'file_path' => $insertedFile->path,
                    'file_id' => $insertedFile->id,
                    'is_main_file' => $serviceDetailsFiles->is_main_file
                ]);
            } catch (\Exception $exception) {
                if ($request->hasFile('file')) {
                    Storage::delete('serviceContentFile/' . $data->file_path);
                }
                DB::rollBack();
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        } else {
            try {
                $insertedContentData = $this->addServiceContentFunc([
                    'subtitle' => $request->get('subtitle'),
                    'service_id' => $request->get('service_id'),
                    'content' => $request->get('content'),
                ]);
                return response()->json([
                    'subtitle' => $insertedContentData->subtitle,
                    'content' => $insertedContentData->content,
                    'service_id' => $insertedContentData->service_id,
                    'content_id' => $insertedContentData->id,
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }
    }

    public function updateServiceContent(Request $request)
    {
        $file_id = null;
        if ($request->file('file')) {
            $data = json_decode($request->get('integratedFormData'));
            $this->serviceContentValidator([
                'service_id' => $data->service_id,
                'subtitle' => $data->subtitle,
                'content' => $data->content,
                'is_main_file' => $data->is_main_file,
                'file_path' => $request->file('file')
            ])->validate();
            $file = $request->file('file');
            Storage::makeDirectory('serviceContentFile');
            $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $file->getClientOriginalExtension();
            try {
                DB::beginTransaction();
                $data->file_path = $filePath;
                $this->updateServiceContentFunc([
                    'content_id' => $data->content_id,
                    'subtitle' => $data->subtitle,
                    'service_id' => $data->service_id,
                    'content' => $data->content
                ]);
                if ($data->former_file_path === null) {
                    $insertedFile = FileModel::create([
                        'path' => $data->file_path
                    ]);
                    $file_id = $insertedFile->id;
                    $serviceDetailsFiles = ServiceDetailsFilesModel::create([
                        'service_details_id' => $data->content_id,
                        'files_id' => $insertedFile->id,
                        'is_main_file' => $data->is_main_file
                    ]);
                } else {
                    $this->updateFile([
                        'file_id' => $data->file_id,
                        'file_path' => $data->file_path
                    ]);
                    $this->updateServiceDetailsFile([
                        'is_main_file' => $data->is_main_file,
                        'service_details_files_id' => $data->service_details_files_id
                    ]);
                    $file_id = $data->file_id;
                }

                Storage::disk('local')->put('serviceContentFile/' . $filePath, File::get($file));
                DB::commit();
                return response()->json([
                    'service_id' => $data->service_id,
                    'subtitle' => $data->subtitle,
                    'content' => $data->content,
                    'content_id' => $data->content_id,
                    'file_path' => $data->file_path,
                    'file_id' => $file_id,
                    'is_main_file' => $data->is_main_file
                ]);
            } catch (\Exception $exception) {
                if ($request->hasFile('file')) {
                    Storage::delete('serviceContentFile/' . $data->file_path);
                }
                DB::rollBack();
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        } else {
            try {

                if ($request->get('former_file_path') !== null) {
                    ServiceDetailsFilesModel::where('services_details_files.service_details_id', $request->get('content_id'))->delete();
                    FileModel::where('id', $request->get('file_id'))->delete();
                }
                $this->updateServiceContentFunc([
                    'content_id' => $request->get('content_id'),
                    'subtitle' => $request->get('subtitle'),
                    'service_id' => $request->get('service_id'),
                    'content' => $request->get('content'),
                ]);
                return response()->json([
                    'subtitle' => $request->get('subtitle'),
                    'content' => $request->get('content'),
                    'content_id' => $request->get('content_id'),
                    'service_id' => $request->get('service_id'),
                ]);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }
    }

    public function listServiceContent($serviceId)
    {
        try {
            $data = ServiceDetailsModel::select('subtitle', 'service_id', 'content', 'path as file_path',
                'services_details_files.id as service_details_files_id', 'services_details_files.is_main_file',
                'services_details.id as content_id', 'files.id as file_id')
                ->leftJoin('services_details_files', 'services_details.id', '=', 'services_details_files.service_details_id')
                ->leftJoin('files', 'services_details_files.files_id', '=', 'files.id')
                ->where('services_details.service_id', '=', $serviceId)
                ->latest('services_details.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function deleteServiceContent(Request $request)
    {
        try {
            DB::beginTransaction();
            if ($request->get('file_path' === null)) {
                ServiceDetailsModel::where('id', $request->get('content_id'))->delete();
                DB::commit();
                return response()->json([
                    'content_id' => $request->get('content_id')
                ]);
            } else {
                ServiceDetailsFilesModel::where('services_details_files.service_details_id', $request->get('content_id'))->delete();
                ServiceDetailsModel::where('id', $request->get('content_id'))->delete();
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

    public function listAllServices()
    {
        try {
            DB::beginTransaction();
            $serviceData = ServiceInfoModel::select('id', 'title', 'service_category_id', 'created_at')->get();
            $jsonResult = array();
            for ($i = 0; $i < count($serviceData); $i++) {
                $jsonResult[$i]['title'] = $serviceData[$i]->title;
                $jsonResult[$i]['service_category_id'] = $serviceData[$i]->service_category_id;
                $jsonResult[$i]['service_id'] = $serviceData[$i]->id;
                $jsonResult[$i]['created_date'] = $serviceData[$i]->created_at;
                $serviceId = $serviceData[$i]->id;
                $jsonResult[$i]['service_details'] = ServiceDetailsModel::select('subtitle', 'service_id', 'content', 'path as file_path',
                    'services_details.id as content_id', 'services_details_files.is_main_file', 'files.id as file_id')
                    ->leftJoin('services_details_files', 'services_details.id', '=', 'services_details_files.service_details_id')
                    ->leftJoin('files', 'services_details_files.files_id', '=', 'files.id')
                    ->where('services_details.service_id', '=', $serviceId)
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

    private function addServiceContentFunc(array $data)
    {
        return ServiceDetailsModel::create($data, [
            'subtitle' => $data['subtitle'],
            'service_id' => $data['service_id'],
            'content' => $data['content'],
        ]);
    }

    protected function serviceContentValidator(array $data)
    {
        return Validator::make($data, [
            'subtitle' => [],
            'service_id' => ['required', 'numeric'],
            'content' => ['required', 'string'],
            'file_path' => ['mimes:mp4,mov,flv,ogg,jpg,png,jpeg'],
            'is_main_file' => []
        ]);
    }

    private function updateServiceContentFunc(array $data)
    {
        $serviceContent = ServiceDetailsModel::find($data['content_id']);
        $serviceContent->subtitle = $data['subtitle'];
        $serviceContent->content = $data['content'];
        $serviceContent->service_id = $data['service_id'];
        return $serviceContent->save();
    }

    private function updateFile(array $data)
    {
        $contentFile = FileModel::find($data['file_id']);
        $contentFile->path = $data['file_path'];
        return $contentFile->save();
    }

    private function updateServiceDetailsFile(array $data)
    {
        $updateMainFile = ServiceDetailsFilesModel::find($data['service_details_files_id']);
        $updateMainFile->is_main_file = $data['is_main_file'];
        return $updateMainFile->save();
    }
}
