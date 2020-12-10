<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BlogCommentModel extends Model
{
    //
    protected $table = "blog_comments";
    protected $fillable = [
        'email',
        'blog_id',
        'comment',
        'full_name'
    ];
}
