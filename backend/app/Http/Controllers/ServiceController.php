<?php

namespace App\Http\Controllers;

use App\FileModel;
use App\ProjectFilesModel;
use App\ServiceCategoryModel;
use App\ServiceDetailsFilesModel;
use App\ServiceDetailsModel;
use App\ServiceInfoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    //
    public function listServiceInfo()
    {
        try {
            $data = ServiceInfoModel::select('services.title', 'services.language', 'services.id', 'service_category_id', 'service_category.title as service_category')
                ->join('service_category', 'services.service_category_id', '=', 'service_category.id')
                ->latest('services.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function addServiceInfo(Request $request)
    {
        $this->serviceInfoValidator($request->all())->validate();
        try {
            $insertedData = ServiceInfoModel::create([
                'title' => $request->get('title'),
                'language' => $request->get('language'),
                'service_category_id' => $request->get('service_category_id')
            ]);
            return response()->json([
                'title' => $insertedData->title,
                'language' => $insertedData->language,
                'id' => $insertedData->id,
                'service_category_id' => $insertedData->service_category_id
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function editServiceInfo(Request $request)
    {
        try {
            $serviceCategory = ServiceInfoModel::find($request->get('id'));
            $serviceCategory->title = $request->get('title');
            $serviceCategory->language = $request->get('language');
            $serviceCategory->service_category_id = $request->get('service_category_id');
            $serviceCategory->save();
            return response()->json($serviceCategory);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function deleteServiceInfo(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = ServiceDetailsModel::select('subtitle', 'service_id', 'content', 'path as file_path', 'services_details.id as content_id', 'files.id as file_id')
                ->leftJoin('services_details_files', 'services_details.id', '=', 'services_details_files.service_details_id')
                ->leftJoin('files', 'services_details_files.files_id', '=', 'files.id')
                ->where('services_details.service_id', '=', $request->get('id'))
                ->get();
            if (count($data) > 0) {
                for ($i = 0; $i < count($data); $i++) {
                    if ($data[$i]->file_path !== null) {
                        ServiceDetailsFilesModel::where('services_details_files.service_details_id', $data[$i]->content_id)->delete();
                        ServiceDetailsModel::where('id', $data[$i]->content_id)->delete();
                        FileModel::where('id', $data[$i]->file_id)->delete();
                    } else {
                        ServiceDetailsModel::where('id', $data[$i]->content_id)->delete();
                    }
                }
            }
            ServiceInfoModel::where('id', $request->get('id'))->delete();
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

    private function serviceInfoValidator(array $data)
    {
        return Validator::make($data, [
            'title' => ['string']
        ]);
    }

    ///============================================================================================
    ///
    ///
    /// Website

    public function listHeaderServices($lang)
    {
        try {
            DB::beginTransaction();
            $serviceCategories = ServiceCategoryModel::select('title', 'id')
                ->where('service_category.language', '=', $lang)
                ->get();
            $jsonResult = array();
            for ($i = 0; $i < count($serviceCategories); $i++) {
                $jsonResult[$i]['service_category_name'] = $serviceCategories[$i]->title;
                $jsonResult[$i]['category_id'] = $serviceCategories[$i]->id;
                $jsonResult[$i]['services'] = ServiceInfoModel::select('title', 'id as service_id')
                    ->where([
                        ['services.service_category_id', '=', $serviceCategories[$i]->id],
                        ['services.language', '=', $lang]
                    ])
                    ->get();
            }
            DB::commit();
            return response()->json($jsonResult);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listServicesForWebsite($lang, $categoryId)
    {
        try {
            $data = ServiceInfoModel::select('services.title', 'services.id as service_id', 'service_category_id',
                'service_category.title as service_category_name', 'content', 'path', 'subtitle')
                ->join('services_details', 'services.id', '=', 'services_details.service_id')
                ->join('services_details_files', 'services_details.id', '=', 'services_details_files.service_details_id')
                ->join('files', 'services_details_files.files_id', '=', 'files.id')
                ->join('service_category', 'services.service_category_id', '=', 'service_category.id')
                ->where([
                    ['services_details_files.is_main_file', '=', 1],
                    ['service_category_id', '=', $categoryId],
                    ['services.language', '=', $lang]
                ])
                ->latest('services.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listAllServicesForWebsite($lang)
    {
        try {
            $data = ServiceInfoModel::select('services.title', 'services.id as service_id', 'service_category_id',
                'service_category.title as service_category_name', 'content', 'path', 'subtitle')
                ->join('services_details', 'services.id', '=', 'services_details.service_id')
                ->join('services_details_files', 'services_details.id', '=', 'services_details_files.service_details_id')
                ->join('files', 'services_details_files.files_id', '=', 'files.id')
                ->join('service_category', 'services.service_category_id', '=', 'service_category.id')
                ->where([
                    ['services_details_files.is_main_file', '=', 1],
                    ['services.language', '=', $lang]
                ])
                ->latest('services.created_at')->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function listProjectServices($lang)
    {
        try {
            $data = ServiceInfoModel::select('title', 'id as service_id')
                ->where('services.language', '=', $lang)
                ->get();
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }
}
