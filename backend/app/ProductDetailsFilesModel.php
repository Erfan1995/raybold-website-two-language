<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductDetailsFilesModel extends Model
{
    //
    protected $table = "product_details_files";
    protected $fillable = [
        'product_details_id',
        'is_main_file',
        'files_id'
    ];
}
