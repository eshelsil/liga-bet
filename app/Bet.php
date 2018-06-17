<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $type
 * @property int $type_id
 * @property int $user_id
 * @property string $data
 * @property int $score
 */
class Bet extends Model
{
    /**
     * Get the phone record associated with the user.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getData($key = null, $default = null)
    {
        return data_get(json_decode($this->data), $key, $default);
    }
}
