<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceCategoryModel extends Model
{
    //
    protected $table = "service_category";
    protected $fillable = [
        'title',
        'language'
    ];
}
