<?php

/**
 * Named congrats-animation presets for the end-of-tournament celebration screen.
 *
 * Each preset is a full CongratsAnimationConfig (enabled / lang / ranks / default) matching the
 * shape validated in AdminController@updateCongratsAnimation. Apply one to a tournament with the
 * SetCongratsAnimationConfig action, e.g. from tinker:
 *
 *   (new \App\Actions\SetCongratsAnimationConfig)->handle(\App\Tournament::find(5), 'carefam_cup_en');
 *
 * Animation `type` values must be one of Tournament::CONGRATS_ANIM_TYPES:
 *   confetti | two_bags | one_bag | single_dollar | none
 */

return [

    // Tournament 1 — Carefam Cup (English)
    'carefam_cup_en' => [
        'enabled' => true,
        'lang'    => 'en',
        'ranks'   => [
            [
                'rank'  => 1,
                'type'  => 'confetti',
                'title' => "You Are The Champion!",
                'msg'   => "You did it — you're the champion of the Carefam Cup! 🏆\n\nYour name goes straight into the family hall of fame, engraved forever, and you'll forever hold the right to brag about it.\n\nEnjoy the glory (and the prize), you earned every bit of it 😏",
            ],
            [
                'rank'  => 2,
                'type'  => 'one_bag',
                'title' => "You're in the money! 💰",
                'msg'   => "Second place — and a real prize to go with it! 💰\n\nSolid work 💪 you turned your predictions into cash.\n\nGo treat yourself to something nice 🎁",
            ],
            [
                'rank'  => 3,
                'type'  => 'none',
                'title' => "No prize, but a major honor! 🥉",
                'msg'   => "You finished in the top 3! You should be proud of yourself💪\n\nYou've fought like a lion, but eventually the prize slipped right through your fingers 💸 — you were this close!\n\nStill, a top finish. Next time it's yours 😏",
            ],
            [
                'rank'  => 4,
                'type'  => 'none',
                'title' => "So close to the prize",
                'msg'   => "You finished just outside the money zone 😩\n\nThe prize slipped right through your fingers 💸 — you were this close!\n\nStill, a top finish. Next time it's yours 😏",
            ],
        ],
        'default' => [
            'type'  => 'none',
            'title' => "It wasn't your day!",
            'msg'   => "No prize this time, but your effort is appreciated! \n\nThanks for being part of the Carefam Cup 🙌\n\nBetter luck next time — you'll get 'em next round 💪",
        ],
    ],

    // Tournament 2 — Family Tournament (Hebrew)
    'family_tournament_he' => [
        'enabled' => true,
        'lang'    => 'he',
        'ranks'   => [
            [
                'rank'  => 1,
                'type'  => 'confetti',
                'title' => "אלוף הטורניר המשפחתי! 🏆",
                'msg'   => "ניצחת! אתה אלוף הטורניר המשפחתי 🏆\n\nלקחת את הגביע ואת הפרס 🤑\n\nהשם שלך נחרט בהיסטוריה המשפחתית לתמיד. תיהנה מהתהילה, מגיע לך! 😏",
            ],
            [
                'rank'  => 2,
                'type'  => 'none',
                'title' => "זה כמעט היה שלך! 🥈",
                'msg'   => "מקום שני מכובד! 🥈\n\nאין פרס כספי הפעם, אבל יש כבוד גדול ומדליית כסף שתירשם בספרי ההיסטוריה.\n\nהיית ממש קרוב לפסגה — כל הכבוד על הקרב! 💪",
            ],
            [
                'rank'  => 3,
                'type'  => 'none',
                'title' => "מקום שלישי ומכובד! 🥉",
                'msg'   => "נלחמת כמו אריה, אבל בסוף לא לקחת את התואר והגעת למקום השלישי! 🥉\n\nבלי פרס כספי, אבל עם המון כבוד — עלית על הפודיום!\n\nהישג יפה, תהיה גאה בעצמך 👏",
            ],
            [
                'rank'  => 15,
                'type'  => 'none',
                'title' => "אחרונה חביבה ❤️",
                'msg'   => "סיימת אחרונה, אבל מישהו חייב להחזיק את התחתית 😄\n\nהעיקר שהשתתפת — ובלעדיך הטורניר לא אותו דבר!\n\nבטוח שבטורניר הבא תצליחי יותר 💪",
            ],
        ],
        'default' => [
            'type'  => 'none',
            'title' => "לא זכית בטורניר, אבל סחטיין על מאמץ כביר!",
            'msg'   => "יצאת בלי פרס הפעם, אבל נלחמת יפה מאוד 💪\n\nהטבלה הזו לא מסכמת את הכישרון שלך.\n\nבפעם הבאה זה שלך — בהצלחה! 😏",
        ],
    ],

    // Tournament 3 — Classic World Cup style (Hebrew), same copy as master
    'classic_he' => [
        'enabled' => true,
        'lang'    => 'he',
        'ranks'   => [
            [
                'rank'  => 1,
                'type'  => 'confetti',
                'title' => "ברכות ולא ניחוסים לתותח שבתותחים!!",
                'msg'   => "איזו זכיה הבאת פה 🏆 יא מלך, כל הכבוד! 🤑 \n\nנכנסת לדפי ההיסטוריה ובסטייל! \n\nאם מסי לא לקח השנה, אז לפחות הכפיל שלו כן. \n\nזה היה שלך לאורך כל הדרך - פשוט נתת תצוגה מרשימה! תהנה מהפרס ומהתהילה, זה מגיע לך 😏",
            ],
            [
                'rank'  => 2,
                'type'  => 'two_bags',
                'title' => "זכית בכסף!🥈",
                'msg'   => "המקום השני והמכובד הוא שלך! והגעת אליו בכבוד ובנחישות, כל הכבוד💪 הישג מרשים! \n\nעוד פודיום לאוסף, נקווה שנשאר לך מקום בארון 😉 \n\nואל תדאג, גם מסי סיים את הטורניר הזה שני בהכל, אז אפשר להגיד שאתם באותו מקום. תהיה גאה בעצמך!",
            ],
            [
                'rank'  => 3,
                'type'  => 'one_bag',
                'title' => "שלישי פעמיים כי טוב🥉!",
                'msg'   => "זכית במקום השלישי ובפרס נאה... 💲💲 \n\nעם כמה הימורים מרשימים, עשית את שלך וחזרת לפודיום! \n\nהעבודה הקשה השתלמה בסוף, מזל טוב!",
            ],
            [
                'rank'  => 4,
                'type'  => 'single_dollar',
                'title' => "Break Even",
                'msg'   => "אפשר להרגיע את האישה, לא הפסדת את כל הכסף בהימורים 😮‍💨 \n\nסיימת במקום הרביעי וכיסית את ההשקעה 💵 \n\nזה לא היה פשוט, אבל במאני טיים - אתה היית שם! אתה ולא ישראכארט",
            ],
            [
                'rank'  => 5,
                'type'  => 'none',
                'title' => "במרחק נגיעה מפרס 💸",
                'msg'   => "בעולם מקביל זה היה שלך... היית כל כך קרוב לקבל קצת כסף, אבל בסוף נשארת רק עם המחמאות...\n\nאך... כמה הפכפך הוא הטורניר שלנו, זה ממש היה נראה כאילו הפודיום שלך השנה, אבל כשאתה לא פוגע בתוצאה ב6-4 של אנגליה על צרפת, למה כבר אפשר לצפות...\n\n בסך הכל היית מצוין! תמשיך ככה ותגיע רחוק!\n\n better luck next time 😏",
            ],
            [
                'rank'  => 6,
                'type'  => 'none',
                'title' => "לא היית רחוק חביבי",
                'msg'   => "לא הצלחת לשים ידך על אחד הפרסים, אבל אתה ממש במרחק יריקה (של איל) מהפודיום \n\n עוד קצת מזל או שכל ואתה כבר היית שם \n\n זה טוב, אבל לא מצוין... \n\nבטורניר הבא עוד שנתיים תהיה מצויין, בסדר? 😏",
            ],
            [
                'rank'  => 7,
                'type'  => 'none',
                'title' => "לא היית רחוק חביבי",
                'msg'   => "לא הצלחת לשים ידך על אחד הפרסים, אבל אתה ממש במרחק יריקה (של איל) מהפודיום \n\n עוד קצת מזל או שכל ואתה כבר היית שם \n\n זה טוב, אבל לא מצוין... \n\nבטורניר הבא עוד שנתיים תהיה מצויין, בסדר? 😏",
            ],
            [
                'rank'  => 8,
                'type'  => 'none',
                'title' => "לא היית רחוק חביבי",
                'msg'   => "לא הצלחת לשים ידך על אחד הפרסים, אבל אתה ממש במרחק יריקה (של איל) מהפודיום \n\n עוד קצת מזל או שכל ואתה כבר היית שם \n\n זה טוב, אבל לא מצוין... \n\nבטורניר הבא עוד שנתיים תהיה מצויין, בסדר? 😏",
            ],
            [
                'rank'  => 13,
                'type'  => 'none',
                'title' => "גם לא אחרון זה סוג של ניצחון 😅",
                'msg'   => "נכון, זה לא היה הטורניר של חייך... \n\nאבל תמיד תזכור שהיה מישהו שסיים אפילו מתחתיך, וזו נחמה קטנה 😏 \n\nלעולם אל תהיה שועל לאריות 🦊! או קוף🐒 לתמנונים 🐙! \n\nאבל בטורניר הבא תבוא חד יותר (או פרשן יותר) — חבל על הכסף 😏",
            ],
            [
                'rank'  => 14,
                'type'  => 'none',
                'title' => "גם לא אחרון זה סוג של ניצחון 😅",
                'msg'   => "נכון, זה לא היה הטורניר של חייך... \n\nאבל תמיד תזכור שהיה מישהו שסיים אפילו מתחתיך, וזו נחמה קטנה 😏 \n\nלעולם אל תהיה שועל לאריות 🦊! או קוף🐒 לתמנונים 🐙! \n\nאבל בטורניר הבא תבוא חד יותר (או פרשן יותר) — חבל על הכסף 😏",
            ],
            [
                'rank'  => 15,
                'type'  => 'none',
                'title' => "אחרון חביב - בני יהודה תל אביב",
                'msg'   => "סיימת אחרון, לא נעים \n\nאבל השנה גם ואלוורדה הודח בבתים! 😱\n\nמה נאמר על טורניר שכזה? \n\n פשוט נקווה שבשנה הבאה תתפוס תוצאות, והרבה!",
            ],
        ],
        'default' => [
            'type'  => 'none',
            'title' => "מקום טוב באמצע 😑",
            'msg'   => "לא לקחת כסף, \n\nלא ירדת ליגה, \n\nבינוני... \n\nאין שום דבר מעניין להגיד עליך \n\nתמשיך להיות ממוצע, אוהבים אותך כמו שאתה!",
        ],
    ],

];
