<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceDetailsFilesModel extends Model
{
    //
    protected $table = "services_details_files";
    protected $fillable = [
        'service_details_id',
        'files_id',
        'is_main_file'
    ];
}
