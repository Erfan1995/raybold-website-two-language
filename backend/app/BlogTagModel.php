<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlogTagModel extends Model
{
    //
    protected $table = "blog_tags";
    protected $fillable = [
        'name',
        'blog_id'
    ];
}
