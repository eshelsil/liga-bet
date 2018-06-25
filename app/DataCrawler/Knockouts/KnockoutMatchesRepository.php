<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 22/06/18
 * Time: 16:19
 */

namespace App\DataCrawler\Knockouts;

use App\DataCrawler\AbstractMatchesRepository;

class KnockoutMatchesRepository extends AbstractMatchesRepository
{
 protected $abstractCrawlerMatch = CrawlerMatch::class;
}
