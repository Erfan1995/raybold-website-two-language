<?php

namespace App\Http\Controllers;

use App\FileModel;
use App\ProjectFilesModel;
use App\ProjectModel;
use App\ServiceCategoryModel;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{

    public function store(Request $request)
    {
        try {
            $this->validator($request->all())->validate();
            $insertedData = ProjectModel::create([
                "title" => $request->get('title'),
                "link" => $request->get('link'),
                "language" => $request->get('language'),
                "service_id" => $request->get('service_id'),
            ]);
            return response()->json($insertedData);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $this->updateValidator($request->all())->validate();

        try {
            DB::beginTransaction();
            $updateData = ProjectModel::findOrFail($request->get('id'));
            $updateData->title = $request->get('title');
            $updateData->link = $request->get('link');
            $updateData->language = $request->get('language');
            $updateData->service_id = $request->get('service_id');;
            $updateData->save();
            DB::commit();
            return response()->json($updateData);
        } catch (\Exception $exception) {
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
            $data = ProjectModel::select('projects.id as project_id', 'project_files.id as project_files_id',
                'files.id as file_id')
                ->leftJoin('project_files', 'project_files.projects_id', '=', 'projects.id')
                ->leftJoin('files', 'project_files.files_id', '=', 'files.id')
                ->where('projects.id', '=', $id)
                ->get();
            for ($i = 0; $i < count($data); $i++) {
                if ($data[$i]->file_path !== null) {
                    ProjectFilesModel::where('id', $data[$i]->project_files_id)->delete();
                    FileModel::where('id', $data[$i]->file_id)->delete();
                }
            }
            ProjectModel::where('id', $id)->delete();
            DB::commit();
            return response()->json([
                'id' => $id
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function storeFile(Request $request)
    {
        $data = json_decode($request->get('integratedFormData'));
        $this->fileValidator([
            "project_id" => $data->project_id,
            "files" => $request->file('file'),
        ])->validate();

        $projectFile = $request->file('file');
        Storage::makeDirectory('projectFiles');
        $filePath = date("Y-m-d-h-i-sa") . rand(1, 1000) . "." . $projectFile->getClientOriginalExtension();
        try {
            DB::beginTransaction();
            $file = FileModel::create([
                'path' => $filePath
            ]);
            $data->file_id = $file->id;
            $insertedData = ProjectFilesModel::create([
                "projects_id" => $data->project_id,
                "files_id" => $data->file_id,
            ]);
            Storage::disk('local')->put('projectFiles/' . $filePath, File::get($projectFile));
            DB::commit();
            $file->path = $filePath;
            return response()->json([
                'id' => $file->id,
                'path' => $file->path,
                'project_file_id' => $insertedData->id
            ]);
        } catch (\Exception $exception) {
            if ($request->hasFile('file')) {
                Storage::delete('projectFiles/' . $filePath);
            }
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function deleteProjectFile($id, $projectFileId)
    {
        try {
            DB::beginTransaction();
            $ProjectFile = ProjectFilesModel::findOrFail($projectFileId);
            if ($ProjectFile) {
                $ProjectFile->delete();
                $data = FileModel::findOrFail($id);
                $data->delete();
                Storage::delete('projectFiles/' . $data->path);
            }
            DB::commit();
            return response()->json($id);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listProjectFiles($projectId)
    {
        try {
            $data = FileModel::select('files.id', 'path', 'project_files.id as project_file_id')->join('project_files', 'project_files.files_id', '=', 'files.id')
                ->where('project_files.projects_id', '=', $projectId)
                ->latest('project_files.created_at')->get();
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
            'service_id' => ['required'],
            'language' => ['string'],
            'link' => [],
        ]);
    }

    protected function fileValidator(array $data)
    {
        return Validator::make($data, [
            'files' => ['required', 'mimes:mp4,mp3,mpga,jpeg,png,svg,jpg'],
            'project_id' => ['required']
        ]);
    }

    protected function updateValidator(array $data)
    {
        return Validator::make($data, [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'service_id' => ['required'],
            'language' => ['string'],
            'link' => [],
        ]);
    }


    public function projectList()
    {
        $data = ProjectModel::select('id', 'title', 'service_id', 'link', 'language')
            ->latest('projects.created_at')->get();
        return response()->json($data);
    }

    public function getProjectsByService($lang, $serviceId, $offset)
    {
        try {
            DB::beginTransaction();
            $data = ServiceCategoryModel::select('services.id as service_id', 'projects.link', 'projects.title', 'projects.id as project_id',
                'service_category.id as service_category_id')
                ->join('services', 'service_category.id', '=', 'services.service_category_id')
                ->join('projects', 'services.id', '=', 'projects.service_id')
                ->where([
                    ['services.id', '=', $serviceId],
                    ['projects.language', '=', $lang]
                ])
                ->limit(6)
                ->offset($offset)
                ->get();
            $jsonData = array();
            for ($i = 0; $i < count($data); $i++) {
                $jsonData[$i]['service_id'] = $data[$i]->service_id;
                $jsonData[$i]['link'] = $data[$i]->link;
                $jsonData[$i]['title'] = $data[$i]->title;
                $jsonData[$i]['project_id'] = $data[$i]->project_id;
                $jsonData[$i]['project_file'] = ProjectFilesModel::select('files.path as file_path', 'projects_id', 'files_id')
                    ->join('files', 'files.id', '=', 'project_files.files_id')
                    ->where('project_files.projects_id', '=', $data[$i]->project_id)
                    ->get();
            }
            DB::commit();
            return response()->json($jsonData);
        } catch (\Exception $exception) {
            DB::rollBack();
        }
    }

    public function listProjectWithOffset($lang, $offset)
    {
        try {
            DB::beginTransaction();
            $data = ProjectModel::select('projects.link', 'projects.title', 'projects.id as project_id', 'language')
                ->where('projects.language', '=', $lang)
                ->limit(6)
                ->offset($offset)
                ->latest('created_at')->get();
            $jsonData = array();
            for ($i = 0; $i < count($data); $i++) {
                $jsonData[$i]['link'] = $data[$i]->link;
                $jsonData[$i]['title'] = $data[$i]->title;
                $jsonData[$i]['project_id'] = $data[$i]->project_id;
                $jsonData[$i]['project_file'] = ProjectFilesModel::select('files.path as file_path', 'projects_id', 'files_id')
                    ->join('files', 'files.id', '=', 'project_files.files_id')
                    ->where('project_files.projects_id', '=', $data[$i]->project_id)
                    ->get();
            }
            DB::commit();
            return response()->json($jsonData);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

}
