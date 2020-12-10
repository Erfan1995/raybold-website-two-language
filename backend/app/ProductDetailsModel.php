<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductDetailsModel extends Model
{
    //
    protected $table = "product_details";
    protected $fillable = [
        'title',
        'product_id',
        'content'
    ];
}
