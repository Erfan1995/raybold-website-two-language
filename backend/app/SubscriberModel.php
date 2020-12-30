<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubscriberModel extends Model
{
    //
    protected $table = "subscribers";
    protected $fillable = [
        'email',
    ];
}
