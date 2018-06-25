<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 12/05/18
 * Time: 15:17
 */

namespace App\Exceptions;

use Illuminate\Contracts\Support\Jsonable;
use Illuminate\Http\JsonResponse;

class JsonException extends \Exception
{

    /**
     * Convert the object to its JSON representation.
     *
     * @param  int $options
     *
     * @return string
     */
    public function render($options = 0)
    {
        return new JsonResponse(["status" => 1, "code" => $this->code, "message" => $this->message], 500);
}}