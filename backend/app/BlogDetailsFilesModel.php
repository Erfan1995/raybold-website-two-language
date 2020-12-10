<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlogDetailsFilesModel extends Model
{
    //
    protected $table = "blog_details_files";
    protected $fillable = [
        'blog_details_id',
        'file_id',
        'is_main_file'
    ];
}
