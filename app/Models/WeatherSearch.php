<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeatherSearch extends Model
{
    protected $fillable = [
        'user_id',
        'city',
        'country',
        'searched_at',
    ];

    protected $casts = [
        'searched_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
