<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProjectModel extends Model
{
    //
    protected $table = "projects";
    protected $fillable = [
        'link',
        'title',
        'service_id',
    ];
}
