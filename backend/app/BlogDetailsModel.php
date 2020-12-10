<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlogDetailsModel extends Model
{
    //
    protected $table = "blog_details";
    protected $fillable = [
        'title',
        'blog_id',
        'content'
    ];
}
