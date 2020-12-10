<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AboutUsFile extends Model
{
    protected $table = "about_us_files";
    protected $fillable = [
        'about_us_id',
        'files_id',
    ];
}
