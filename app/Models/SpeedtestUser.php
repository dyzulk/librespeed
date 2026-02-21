<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpeedtestUser extends Model
{
    /** @use HasFactory<\Database\Factories\SpeedtestUserFactory> */
    use HasFactory;

    protected $fillable = [
        'ip',
        'ispinfo',
        'extra',
        'ua',
        'lang',
        'dl',
        'ul',
        'ping',
        'jitter',
        'log',
    ];
}
