export function getSummaryMsg(position: number, isOurTournament = false) {
    let title: string, msg: string
    if (isOurTournament){
        switch (position){
            case 1:
                title = "אלוף האלופים!!";
                msg =`
                ברכות על הזכיה 🏆 יא מלך 🤑 \n
                נכנסת לדפי ההיסטוריה בענק! \n
                שמך נחרט ברגעים אלו על הקיר המרכזי במוזיאון הרשמי של פיפ"א. \n
                תהנה מהכסף והתהילה, זה מגיע לך 😏
                `;
                break;
            case 2:
                title = "ברכות יא תותח!";
                msg =`
                זכית בכסף! (תרתי משמע🥈) \n
                כל הכבוד💪 הישג מרשים! \n
                אז תקנה לך משהו יפה 👗 \n
                ואל תאמין לאלו שאומרים שאף אחד לא זוכר את מספר 2, אצלינו תמיד תישאר בסטטיסטיקה
                `;
                break;
            case 3:
                title = "שלום לך🥉!";
                msg =`
                זכית במקום השלישי ובפרס נאה... 💲💲 \n
                אז אולי לא תגשים את כל החלומות שלך, אבל בואנ'ה זה אחלה כסף! \n
                \n
                העבודה הקשה השתלמה בסוף, מזל טוב!
                `;
                break;
            case 4:
                title = "Break Even";
                msg =`
                אפשר להירגע, להתקשר לבנקאי ולבטל את המשכנתא על הדירה 🏠 \n
                סיימת במקום הרביעי וזכית בכל כספך בחזרה 💵 \n
                זה היה מותח, זה לא היה פשוט, אבל בסוף עשית זאת!
                `;
                break;
            case 5:
                title = "כמעט נוגע במזומנים";
                msg =`
                היית כל כך קרוב להגיע למקום שיזכה אותך בפרס,\n
                הכסף ממש חמק לך מבין האצבעות 💸\n
                ואתה נשארת רק עם המחמאות...\n
                בכל זאת נכנסת לחמשת הגדולים, טפח לעצמך על השכם!
                `;
                break;
            case 6:
            case 7:
                title = "לא רחוק מהישג";
                msg =`
                היית קרוב, אבל לא הצלחת לשים ידך על אחד הפרסים... \n\n
                החדשות הטובות: \n
                היורו מתחיל בעוד פחות משנתיים! \n
                זו ההזדמנות שלך להחזר את הכסף שהפסדת פה... \n
                ויותר 😏
                `;
                break;
            case 8:
            case 9:
                title = "מקום טוב באמצע 😑";
                msg = `לא לקחת כסף, \n
                לא ירדת ליגה, \n
                בינוני... \n
                אין שום דבר מעניין להגיד עלייך \n
                תמשיך להיות ממוצע, אוהבים אותך כמו שאתה!
                `;
                break;
            case 10:
            case 11:
            case 12:
            case 13:
                title = "לא הטורניר שלך";
                msg = `אתה בחצי התחתון של הטבלה, זה לא משהו... \n
                אבל במונדיאל כזה מפתיע, זה יותר מעיד על השיפוט הקטארי מאשר על הכישרון שלך \n\n
                לך עם האמת שלך 🎤
                `;
                break;
            case 14:
                title = "העיקר שאתה לא אחרון אחי";
                msg = `לא משנה כמה פספסת, \n
                תמיד תזכור שהיה מישהו יותר גרוע ממך... \n
                לעולם אל תהיה זנב לשועלים!
                🦊
                \n
                אבל שנה הבאה כדאי שילך לך יותר טוב, חבל על הכסף 😏`;
                break;
            case 15:
                title = "אחרון מוסיף המון";
                msg = `סיימת אחרון, \n
                אבל הוכחת שאתה יותר חכם מהקוף 🙈, זה גם משהו!
                \n
                אולי נצליח בשנה הבאה...`;
                break;
            default:
                title = "you are not the winner";
                msg = "cheer up mate";
        }
    } else {
        switch (position){
            case 1:
                title = "ברכות!!";
                msg =`
                סיימת במקום הראשון! 🏆 \n
                שמך נחרט ברגעים אלו על הגביע הנחשק, ולעד יישאר חקוק בהיכל התהילה. \n
                כל הכבוד 👏👏
                `;
                break;
            default:
                title = "You are not the winner";
                msg = "Cheer up, mate";
        }
    }
    return {title, msg};
}