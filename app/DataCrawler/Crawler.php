<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 16/06/18
 * Time: 14:26
 */

namespace App\DataCrawler;

use \Guzzle\Http\Client as HttpClient;
class Crawler
{
    const URL = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json";

    protected $data = null;

    public function getData($key = null, $default = null)
    {
        return data_get($this->data, $key, $default);
    }

    /**
     * Crawler constructor.
     */
    public function __construct()
    {
        $this->queryData();
    }

    private function queryData()
    {
        $client = new HttpClient();
        $res = $client->get('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json')->send();
        $this->data = json_decode($res->getBody());
    }
}