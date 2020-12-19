<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceDetailsModel extends Model
{
    //
    protected $table = "services_details";
    protected $fillable = [
        'subtitle',
        'service_id',
        'content',
        'language'
    ];
}
