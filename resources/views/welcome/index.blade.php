<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <title>ליגה ב'</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <script>
        function goToLogin(){
            window.location.href = '/login';
        }
        function goToRegister(){
            window.location.href = '/register';
        }
        (function (){
            const searchParams = new URLSearchParams(window.location.search);
            const redirectPath = searchParams.get('redirectTo');
            if (redirectPath) {
                sessionStorage.setItem('LigaBet-redirectAfterLogin', JSON.stringify({
                    path: redirectPath,
                    timestamp: new Date(),
                }));
            }
        })()
    </script>
    <style>
        html {
            height: 100%;
        }
        body {
            margin: 0;
            background-image: url(https://www.pcclean.io/wp-content/uploads/2020/4/i26beu.jpg);
            box-shadow: inset 0 0 0 1000px rgb(0 67 131 / 21%);
            background-position-x: 60%;
            background-position-y: center;
            background-size: cover;
            height: 100%;
            color: white;
            text-shadow: -3px 2px 8px black;

        }
        html body * {
            font-family: "Open Sans", sans-serif;
        }
        body .main {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
            overflow: auto;
        }
        .header {
            position: fixed;
            z-index: 10;
            top: 0;
            right: 0;
            width: 100%;
            height: 80px;
            background: linear-gradient(45deg, #42a5f5 0%, #1565c0 100%);
            box-shadow: rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px;
        }
        .buttonsContainer {
            margin: auto;
            max-width: 100%;
            width: 500px;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .linkButton {
            margin: 12px 24px;
            padding: 8px 16px;
            font-size: 16px;
            border: none;
            cursor: pointer;
            border-radius: 12px;
            background: rgb(240,240,240);
            box-shadow: rgb(60 64 67 / 30%) 0px 3px 2px 0px, rgb(60 64 67 / 15%) 0px 2px 6px 5px;
        }
        .linkButton:hover {
            filter: brightness(93%);
        }
        .linkButton:active {
            filter: brightness(88%);
        }
        .content {
            position: relative;
            padding-top: 80px;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .helloSection {
            margin: 24px;
            max-width: 960px;
        }
        .rightPadding {
            padding-right: 24px;
        }
        .examples {
            background: rgba(255,255,255, 0.9);
            border-radius: 12px;
            padding: 16px;
            display: block;
        }
        .examples .flexBox {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: end;
        }
        .example {
            display: flex;
            align-items: center;
            flex-direction: column;
            margin: 24px 12px;
            flex-direction: column;
        }
        .example > h4 {
            margin: 0;
            color: black;
            text-shadow: none;
            max-width: fit-content;
            text-align: center;
        }
        .example > img {
            border-radius: 12px;
            margin-top: 12px;
        }
        @media (max-width: 600px){
            .examples {
                padding: 8px;
            }
            .example {
                margin: 24px 10px;
            }
            .example > img {
                width: 170px;
            }
        }
        .footer {
            margin-top: auto;
        }
        .footer-bg {
            display: flex;
            justify-content: center;
            width: 100%;
            position: relative;
            background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65%, rgba(255, 255, 255, 0) 100%);
        }
        .footer-img {
            max-width: 100%;
            width: 600px;
        }

        
    </style>
</head>
<body dir="rtl">
    <div class="main">
        <div class="header">
            <div class="buttonsContainer">
                <button class="linkButton" onclick="goToRegister()">
                    הרשמה
                </button>
                <button class="linkButton" onclick="goToLogin()">
                    התחברות
                </button>
            </div>
        </div>
        <div class="content">
            <div class="helloSection">
                <h1>
                    ברוכים הבאים למשחק הניחושים של ליגה ב'!
                </h1>
                <h2>
                    פתחו טורניר עם חברים ונחשו את תוצאות המונדיאל
                </h2>
                <h4>
                    כל מה שצריך לעשות זה:
                </h4>
                <div class='rightPadding'>
                    <h4>
                        להירשם
                    </h4>
                    <h4>
                        ליצור טורניר
                    </h4>
                    <h4>
                        להזמין חברים
                    </h4>
                    <h4>
                        ולהתחיל לנחש!
                    </h4>
                </div>
                <div class="examples">
                    <div class="flexBox">
                        <div class="example">
                            <h4 style="margin: 0;">
                                נחש תוצאות משחקים
                            </h4>
                            <img src="/img/example-games.jpg">
                        </div>
                        <div class="example">
                            <h4 style="margin: 0;">
                                נחש זוכה, מלך שערים והימורים מיוחדים נוספים
                            </h4>
                            <img src="/img/example-special-bet.jpg">
                        </div>
                        <div class="example">
                            <h4 style="margin: 0;">
                                נחש דירוגי בתים
                            </h4>
                            <img src="/img/example-group-bet.jpg">
                        </div>
                        <div class="example">
                            <h4 style="margin: 0;">
                                הגדר ניקוד לפי טעמך
                            </h4>
                            <h4 style="margin: 0;">
                                (לא חובה)
                            </h4>
                            <img src="/img/example-score-config.jpg">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="footer-bg">
                <img class="footer-img" src="/img/icon-no-bg.svg">
            </div>
        </div>
        
    </div>
</body>

</html>
