<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceInfoModel extends Model
{
    //
    protected $table = "services";
    protected $fillable = [
        'service_category_id',
        'title',
        'language'
    ];
}
