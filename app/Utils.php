<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 15/11/2022
 * Time: 1:56
 */

namespace App;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class Utils
{

    public static function getLastQuery()
    {
        return static::toSql(DB::getQueryLog());
    }

    /**
     * @param Builder|\Illuminate\Database\Eloquent\Builder $query
     * @return string
     */
    public static function queryToSql($query): string
    {
        $query = [
            "query" => $query->toSql(),
            "bindings" => $query->getBindings(),
        ];
        return static::toSql([$query]);
    }

    public static function logDB()
    {
        DB::enableQueryLog();

        DB::listen(function ($query) {
            echo "SQL: " . static::toSql([[
                    "query"    => $query->sql,
                    "bindings" => $query->bindings,
                    "time"     => $query->time,
                ]]);
        });
    }

    /**
     * Attach bindings and return the SQL of the query.
     * Returns only the last query from given queries.
     *
     * @param array $queries
     * @return string
     */
    public static function toSql(array $queries): string
    {
        $lastQuery = end($queries);

        $queryWithBindings = $lastQuery["query"];

        foreach ($lastQuery["bindings"] as $binding) {
            $queryWithBindings = preg_replace('/\?/', "'{$binding}'", $queryWithBindings, 1);
        }

        $time = $lastQuery["time"] ?? null;

        if ($time) {
            $time = " [T:{$time}]";
        }

        return str_replace('`', '', $queryWithBindings) . $time;
    }
}