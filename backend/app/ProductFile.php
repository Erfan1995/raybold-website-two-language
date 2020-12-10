<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductFile extends Model
{
    protected $table = "product_files";
    protected $fillable = [
        'product_id',
        'files_id',
        'isMainFile',
    ];
}
