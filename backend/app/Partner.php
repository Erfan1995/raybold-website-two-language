<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $table = "partner";
    protected $fillable=[
        'link',
        'title',
        'files_id',
    ];
}
