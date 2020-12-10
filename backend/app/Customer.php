<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = "customers";
    protected $fillable=[
        'link',
        'title',
        'file_id',
        'review',
    ];
}
