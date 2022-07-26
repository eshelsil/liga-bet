import React from 'react';
import './style.scss';


function Takanon(props) {
    return (
        <div className="all-ltr" style={{marginBottom: 30}}>
            <h2 style={{textAlign: 'center'}}>תקנון משחק יורו חברים 2021</h2>
            <h3 style={{marginBottom: 20}}>שליחת הימורים</h3>
            <div className="text-part">
                <h4>הימורי משחקים</h4>
                <p>כל משחק פתוח להימור עד לשעת תחילת המשחק.<br/>
                    כלל ההימורים נחשפים בתחילת המשחק וניתנים לצפייה בלשונית "צפייה בהימורים".<br/>
                    יש לבחור את התוצאה וללחוץ על "שלח" בסיום
                </p>
            </div>
            <div className="text-part">
                <h4>הימורים מיוחדים והימורי בתים</h4>
                <p>
                    יש למלא את כלל ההימורים המיוחדים והימורי הבתים עד לשריקת הפתיחה של המשחק הראשון בטורניר.<br/>
                    לא ניתן יהיה לערוך או לשנות את ההימורים במהלך הטורניר.
                </p>
            </div>
            <h3 style={{marginBottom: 20}}>ניקוד</h3>

            <div className="text-part">
                <h4>שלב הבתים – 36 משחקים</h4>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>ניקוד</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bold">
                            <td>1X2</td>
                            <td>1</td>
                        </tr>
                        <tr className="bold">
                            <td>תוצאה</td>
                            <td>2</td>
                        </tr>
                        <tr className="divide">
                            <td>סכום למשחק</td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>מקסימום נקודות</td>
                            <td>108</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-part">
                <h4>שלב הנוקאאוט – 15 משחקים</h4>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>ניקוד</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bold">
                            <td>מעפילה</td>
                            <td>2</td>
                        </tr>
                        <tr className="bold">
                            <td>1X2</td>
                            <td>1</td>
                        </tr>
                        <tr className="bold">
                            <td>תוצאה</td>
                            <td>6</td>
                        </tr>
                        <tr className="divide">
                            <td>סכום למשחק</td>
                            <td>9</td>
                        </tr>
                        <tr>
                            <td>מקסימום נקודות</td>
                            <td>108</td>
                        </tr>
                    </tbody>
                </table>
                <ul style={{marginTop: 8}}>
                    <li>במידה וסומנה תוצאת תיקו, יהיה עלייך לבחור מעפילה. אחרת המעפילה נקבעת לפי התוצאה.</li>
                    <li>הימור 1X2 - מחושב לפי תוצאה בתום 90 דק' (כלומר לפני הארכה)</li>
                </ul>
                <h5 className="underlined">דוגמאות</h5>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>תוצאה בפועל</th>
                            <th>ניקוד</th>
                            <th>הסבר</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr>
                        <td>צרפת(1) - ספרד(2)</td>
                        <td className="preline">1-1 בתום 90 דקות
                            ואחרי הארכה ספרד מנצחת 2-1.
                        </td>
                        <td>2</td>
                        <td className="preline">- 2 נק' על מעפילה
                            - 0 נק' על 1X2
                            - 0 על תוצאה
                        </td>
                    </tr>
                    <tr>
                        <td className="preline">צרפת(1) - ספרד(1)
                            וצרפת עולה
                        </td>
                        <td className="preline">1-1 בתום 90 דקות
                            ואחרי הארכה ספרד מנצחת 2-1.
                        </td>
                        <td>7</td>
                        <td className="preline">- 1 נק' על 1X2
                            - 6 נק' על תוצאה מדויקת
                            - 0 נק' על מעפילה                        
                        </td>
                    </tr>
                    <tr>
                        <td>
                            צרפת(1) - ספרד(0)
                        </td>
                        <td className="preline">צרפת מנצחת 4-3
                        </td>
                        <td>3</td>
                        <td className="preline">- 1 נק' על 1X2
                            - 2 נק' על מעפילה
                            - 0 נק' על תוצאה                                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                            צרפת(1) - ספרד(0)
                        </td>
                        <td className="preline">צרפת מנצחת 1-0
                        </td>
                        <td>9</td>
                        <td className="preline">- 1 נק' על 1X2
                            - 2 נק' על מעפילה                                               
                            - 6 נק' על תוצאה מדויקת                                               
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <div className="text-part">
                <h4>דירוג בתים</h4>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>ניקוד</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bold">
                            <td>סידור מושלם</td>
                            <td>6</td>
                        </tr>
                        <tr className="bold">
                            <td>טעות מינימלית</td>
                            <td>3</td>
                        </tr>
                        <tr className="divide">
                            <td>מקסימום נקודות</td>
                            <td>36</td>
                        </tr>
                    </tbody>
                </table>
                <ul style={{marginTop: 8}}>
                    <li>טעות מינימלית = היפוך בין מקומות צמודים (טעות אחת בין מקומות 1,2 או 2,3 או 3,4)</li>
                    <li>* במקרה הנדיר בו 2 קבוצות (או יותר) סיימו במקום זהה (שוויון כולל של נקודות ושערים כך שהמיקום שלהם מוכרע בהטלת מטבע) החישוב יתבצע לטובת המהמרים</li>
                </ul>
                <h5 className="underlined">דוגמאות</h5>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>תוצאה בפועל</th>
                            <th>ניקוד</th>
                            <th>הסבר</th>
                        </tr>
                    </thead>
                <tbody>
                    <tr>
                        <td rowSpan="4" className="preline v-align-center">1. ווילס
                            2. שוויץ
                            3. טורקיה
                            4. איטליה
                        </td>
                        <td className="preline">1. ווילס
                            2. שוויץ
                            3. טורקיה
                            4. איטליה                        
                        </td>
                        <td>6</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="preline">1. ווילס
                            2. טורקיה
                            3. שוויץ
                            4. איטליה                        
                        </td>
                        <td>3</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="preline">1. טורקיה
                            2. ווילס
                            3. שוויץ
                            4. איטליה                                             
                        </td>
                        <td>0</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="preline">1. טורקיה (בשוויון כולל יחד עם וויילס)
                            1. ווילס (בשוויון כולל יחד עם טורקיה)
                            3. שוויץ
                            4. איטליה
                        </td>
                        <td>3</td>
                        <td className="preline">במקרה בו 2 קבוצות סיימו במיקום זהה - החישוב מתבצע לטובת המהמר.
                            כלומר בבית הנ"ל ייבדק כמה נק' יקבל המשתמש על ההימור כשטורקיה היא 
                            במקום 1 ו-ווילס במקום 2 (0 נקודות)
                            וייבדק כמה נק' יקבל המשתמש על ההימור כש-ווילס במקום 1 וטורקיה במקום 2 (3 נקודות).
                            המשתמש יקבל את הניקוד הגבוה מבין האופציות הנ"ל.
                            לכן במקרה זה יקבל ל3 נק'.
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <div className="text-part">
                <h4>הימורים מיוחדים</h4>
                <h5 className="underlined">זוכה וסגנית</h5>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>ניקוד</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bold">
                            <td>העפלת שלב</td>
                            <td>5</td>
                        </tr>
                        <tr className="bold">
                            <td>זכייה</td>
                            <td>15</td>
                        </tr>
                        <tr className="divide">
                            <td>מקסימום נקודות</td>
                            <td>45</td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <table>
                    <thead>
                        <tr>
                            <th>הגעה ל</th>
                            <th>רבע גמר</th>
                            <th>חצי גמר</th>
                            <th>גמר</th>
                            <th>זכייה</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="bold">זוכה</td>
                            <td>5</td>
                            <td>10</td>
                            <td>15</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td className="bold">סגנית</td>
                            <td>5</td>
                            <td>10</td>
                            <td>15</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <h5 className="underlined">מלך שערים</h5>
                <table>
                    <thead>
                        <tr>
                            <th>הימור</th>
                            <th>ניקוד</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>לכל גול</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td>זכייה בתואר</td>
                            <td>4</td>
                        </tr>
                    </tbody>
                </table>
                <ul style={{marginTop: 8}}>
                    <li>כדי להמר על שחקן שלא מופיע ברשימה - אנא פנו לאחד המנהלים כדי שיוסיף את השחקן לרשימה</li>
                    <li>לא ניתן להחליף מלך שערים במהלך הטורניר (גם אם שחקן נפצע)</li>
                    <li>במידה ויש תיקו במלך שערים - כל הימור על אחד מהשחקנים יזכה את המהמר ב4 הנק' על זכייה בתואר</li>
                </ul>
                <br/>
                <h5 className="underlined">מלך בישולים</h5>
                <h5>10 נקודות</h5>
                <ul style={{marginTop: 8}}>
                    <li>יש למלא שם מלא על מנת שיהיה ברור על מי מהמרים (לדוגמה: לא לכתוב רק "סילבה")</li>
                    <li>במקרה של תיקו - כל הימור על אחד מהשחקנים יזכה את המהמר במלוא 10 הנקודות</li>
                </ul>
                <br/>
                <h5 className="underlined">מצטיין הטורניר</h5>
                <h5>10 נקודות</h5>
                <ul style={{marginTop: 8}}>
                    <li>יש למלא שם מלא על מנת שיהיה ברור על מי מהמרים (לדוגמה: לא לכתוב רק "סילבה")</li>
                </ul>
                <br/>
                <h5 className="underlined">ההתקפה החזקה בבתים</h5>
                <h5>5 נקודות</h5>
                <h5>הקבוצה שהבקיעה הכי הרבה שערים בבתים</h5>
                <ul style={{marginTop: 8}}>
                    <li>במקרה של תיקו - כל הימור על אחת מהקבוצות יזכה את המהמר במלוא הנקודות</li>
                </ul>
            </div>

            <br/>
            <h3 style={{marginBottom: 20}}>פרסים וכספים</h3>
            <div className="text-part">
                <h4 className="underlined">דמי כניסה</h4>
                <p>200</p>
            </div>
            <div className="text-part">
                <h4 className="underlined">סכומי זכייה</h4>
                <ul style={{marginTop: 8}}>
                    <li><u>מקום ראשון:</u> 1800</li>
                    <li><u>מקום שני:</u> 800</li>
                    <li><u>מקום שלישי:</u> 400</li>
                    <li><u>מקום רביעי:</u> זוכה בדמי הכניסה (200 ש"ח)</li>
                </ul>
            </div>

            <br/>
            <h3 style={{marginBottom: 20}}>כללי</h3>
            <ul>
                <li>במידה ויש שאלות / מקרים שלא הוסברו בתקנון - אנא פנו לאחד המנהלים כדי שיעדכן את התקנון</li>
                <li>אם יש נושא שאינו מפורט בתקנון - החלטה בנושא תקבע לפי שיקול דעת מנהלי הטורניר</li>
            </ul>
        </div>
    );
};

export default Takanon;