<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlogModel extends Model
{
    //
    protected $table = "blog";
    protected $fillable = [
        'title',
        'user_id',
        'blog_resource',
        'blog_status_id',
        'blog_category_id',
        'language'
    ];
}
