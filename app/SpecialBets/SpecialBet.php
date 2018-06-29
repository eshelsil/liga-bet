<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 26/06/18
 * Time: 02:41
 */

namespace App\SpecialBets;

use App\Bets\BetableInterface;
use \Illuminate\Support\Collection;

class SpecialBet implements BetableInterface
{
    protected $id = null;
    protected $score = null;
    protected $question = [];
    protected $answers = [];

    private static $source = [
        "1" => ["score" => "10", "question" => "ההתקפה החזקה בבתים", "answers" => ["בלגיה"]],
        "2" => ["score" => "10", "question" => "ההגנה החזקה בבתים", "answers" => ["אורוגוואי"]],
        "3" => ["score" => "10", "question" => "הקבוצות שיגיעו לגמר", "answers" => null],
        "4" => ["score" => "25", "question" => "אלופת העולם", "answers" => null],
        "5" => ["score" => "10", "question" => "מלך הבישולים", "answers" => null],
        "6" => ["score" => "20", "question" => "מלך השערים", "answers" => null],
        "7" => ["score" => "10", "question" => "מצטיין הטורניר", "answers" => null],
    ];

    /**
     * Group constructor.
     *
     * @param null  $id
     * @param array $data
     */
    public function __construct($id, array $data)
    {
        $this->id       = $id;
        $this->question = $data["question"];
        $this->answers  = $data["answers"];
        $this->score    = $data["score"];
    }

    public function getID()
    {
        return $this->id;
    }

    public function getScore()
    {
        return $this->score;
    }

    public function getQuestion()
    {
        return $this->question;
    }

    public function getAnswers()
    {
        return $this->answers;
    }

    /**
     * @return Collection|static[]
     */
    public static function all()
    {
        $specialBets = [];
        foreach (self::$source as $id => $data) {
            $specialBets[] = new self($id, $data);
        }

        return Collection::make($specialBets);
    }

    /**
     * @param $id
     *
     * @return static
     */
    public static function find($id)
    {
        $data = array_get(self::$source, $id);
        return new self($id, $data);
    }
}