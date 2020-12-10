<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectFilesModel extends Model
{
    //
    protected $table = "project_files";
    protected $fillable = [
        'projects_id',
        'files_id'
    ];
}
