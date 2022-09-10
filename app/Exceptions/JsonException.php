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
    protected $httpCode;

    public function __construct($message = '', $httpCode = 400, $code = 0, \Throwable $previous = null ) {
        $this->httpCode = $httpCode;
        parent::__construct($message, $code, $previous);
    }
    

    /**
     * Convert the object to its JSON representation.
     *
     * @param  int $options
     *
     * @return string
     */
    public function render($options = 0)
    {
        return new JsonResponse(["status" => 1, "code" => $this->code, "message" => $this->message], $this->httpCode);
    }
}