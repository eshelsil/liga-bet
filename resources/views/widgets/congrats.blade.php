@if (!is_null($summary_msg))


<style>

@keyframes pop-and-spin-from-center {
  0% {
    height: 0%;
    font-size: 0px;
  }
  100% {
    height: 50%;
    font-size: 14px;
    -webkit-transform: rotate(1082deg);
    transform:rotate(1082deg);
  }
}

@keyframes fold-down {
  0% {
    top: 0%
  }
  100% {
    top: 100%;
  }
}

@keyframes leaf-fall-in {
  0% {
    top: -20%;
    margin-left: 45%;
    -webkit-transform: rotate(-50deg);
    transform:rotate(-50deg);
  }
  10%{
    top: -10%;
    margin-left: calc(45% + 5em);
    -webkit-transform: rotate(-80deg);
    transform:rotate(-80deg);  
  }
  20% {
    top: 0%;
    margin-left: calc(45% - 5em);
    -webkit-transform: rotate(-20deg);
    transform:rotate(-20deg);
  }
  30%{
    top: 10%;
    margin-left: calc(45% + 5em);
    -webkit-transform: rotate(-80deg);
    transform:rotate(-80deg);  
  }
  40% {
    top: 20%;
    margin-left: calc(45% - 5em);
    -webkit-transform: rotate(-20deg);
    transform:rotate(-20deg);
  }
  50%{
    top: 30%;
    margin-left: calc(45% + 5em);
    -webkit-transform: rotate(-80deg);
    transform:rotate(-80deg);  
  }
  60%{
    top: 40%;
    margin-left: calc(45% - 5em);
    -webkit-transform: rotate(-20deg);
    transform:rotate(-20deg);
  }
  70%{
    top: 50%;
    margin-left: calc(45% + 5em);
    -webkit-transform: rotate(-80deg);
    transform:rotate(-80deg);  
  }
  80% {
    top: 60%;
    margin-left: calc(45% - 5em);
    -webkit-transform: rotate(-20deg);
    transform:rotate(-20deg);
  }
  90%{
    top: 70%;
    margin-left: calc(45% + 5em);
    -webkit-transform: rotate(-80deg);
    transform:rotate(-80deg);  
  }
  100% {
    top: 80%;
    margin-left: 45%;
    -webkit-transform: rotate(-50deg);
    transform:rotate(-50deg);
  } 
}
@keyframes fall-in {
  0% {
    top: -10%
  }
  100% {
    top: 80%;
  }
}

@keyframes fall-in-2 {
  0% {
    top: -10%
  }
  50% {
    top: 75%;
  }
  100%{
      top: 75%;
  }
}

@keyframes fall-in-3 {
  0% {
    top: -40%
  }
  50% {
    top: 10%%;
  }
  100%{
    top: 35%;
  }
}

@keyframes left-out {
  0% {
    right: 0%
  }
  100% {
    right: 100%;
  }
}
    #confetti-canvas{
        position: fixed;
        z-index: 100;
        top: -100%;
        transition: top 4s ease-out;
    }

    #confetti-canvas.max-height{
        top: 0%;
    }
    #confetti-canvas.fold-down{
        animation: fold-down 8s linear forwards;
    }

    #summary_container{
        position: relative;
        margin: auto;
        display: none;
    }
    #summary_container.shown{
        display: block;
        animation: pop-and-spin-from-center 1s linear forwards;
    }
    #fix-wrapper{
        display: none;
        position: fixed;
        z-index: 105;
        width: 100%;
        height: 100%;
    }
    .take-price-btn{
        position: fixed;
        z-index: 104;
        right: 40%;
        left: 40%;
        top: 15%;
    }
    .fix-bg-wrapper{
        position: fixed;
        display: none;
        z-index: 101;
        width: 100%;
        height: 100%;
    }
    .fix-bg-wrapper.shown{   
        display: flex;
    }
    #fix-wrapper.shown{
        display: flex;
    }
    .diploma_img{
        height: 100%;
    }
    .diploma-content{
        position: absolute;
        text-align: center;
        top: 0;
        margin: 10%;
        width: 80%;
        height: 80%;
    }
    #diploma-title{
        text-align: center;
        font-size: 1.3em;
        text-decoration: underline;
    }
    #diploma-msg{
        margin-bottom: 5px;
    }
    #diploma-close-wrap{
        text-align: center;
        position: absolute;
        top: 100%;
        right: 0;
        width: 100%;
    }
    #diploma-close{
        cursor: pointer;
        font-size: 0.85em;
        text-decoration: underline;
        color: #666
    }
    span.flag{
        /* For google chrome display */
        display: inline-block;
    }

    #trophy_writing{
        position: relative;
        margin: auto;
        text-align: center;
        font-size: 0.8em;
        color: #231c1082;
        font-weight: 700;
    }

    .money_bag_img{
        display: none;
        position: absolute;
        height: 20%;
    }
    .money_bag_img.shown{
        display: block;
        animation: fall-in 1s ease-in forwards;
    }
    .right-bag{
        left: calc(50% - 1em);
    }
    .left-bag{
        right: calc(50% - 1em);
    }
    .center-wrap{
        margin-right: auto;
        margin-left: auto;
        height: 20%;
        position: relative;
        display: none;
    }
    .center-wrap.shown{
        animation: fall-in-2 1.5s ease-in forwards;
        display: block;
    }
    .center-wrap.dollar-wrap{
        display: block;
    }
    .money_bag_img.center-bag{
        animation: none;
        height: 100%;
        position: relative;
        display: block;
    }
    .center-trophy-wrap{
        margin-right: auto;
        margin-left: auto;
        height: 50%;
        position: relative;
        animation: fall-in-3 0.8s ease-in forwards;
    }
    .center-writing{
        display: flex;
        top: 82%;
        width: 100%;
        position: absolute;
    }
    .trophy_img{
        position: relative;
        height: 100%;
    }
    .center-wrap.dollar-wrap{
        animation: leaf-fall-in 7s ease-in-out forwards;
    }
    .dolar_img{
        height: 100%;
        position: relative;
    }
    .taken-animation{
        animation: left-out 0.5s ease-in forwards;
    }
</style>


<script src="https://cdn.jsdelivr.net/npm/confetti-js@0.0.18/dist/index.min.js"></script>
<canvas id="confetti-canvas"></canvas>

<div id="money_bags_container" class="fix-bg-wrapper"> 
    <img class="money_bag_img right-bag" src="/img/money.png">
    <img class="money_bag_img left-bag" src="/img/money.png">
    <div id="center_money_bag_wrap" class="center-wrap">
        <img class="money_bag_img center-bag" src="/img/money.png">
    </div>
</div>

<div id="trophy_container" class="fix-bg-wrapper">
    <div class="center-trophy-wrap">
        <img class="trophy_img" src="/img/trophy.png">
        <div class="center-writing">
            <p id="trophy_writing">{!! str_replace(" ", "<br>", Auth::user()->name) !!}</p>
        </div>
    </div>
</div>

<div id="dollar_container" class="fix-bg-wrapper">
    <div class="center-wrap dollar-wrap ">
        <img class="dolar_img" src="/img/dollar.png">
    </div>
</div>

<div class="btn btn-warning take-price-btn hidden" onclick="takeTrophy()">קח פרס</div>


<div id="fix-wrapper">
    <div id="summary_container">   
        <img class="diploma_img" src="/img/diploma.jpg">
        <div class="diploma-content">
            <h4 id="diploma-title"></h4>
            <p id="diploma-msg"></p>
            <div id="diploma-close-wrap">
                <span id="diploma-close">טוב אחי</span>
            </div>
        </div>
    </div>
</div>



<script>
    const summary_msg = "{{$summary_msg}}";


    function takeTrophy(){
        $(".fix-bg-wrapper").addClass("taken-animation");
        $(".take-price-btn").remove();
        setTimeout(closeConfetti, 4000)
    }

    function allowTakingPrice(){
        if (["winner", "runner_up", "3rd", "4th"].indexOf(summary_msg) === -1){
            return;
        }
        $(".take-price-btn").removeClass("hidden");
    }

    function closeDiploma(){
        allowTakingPrice()
        $("#fix-wrapper").removeClass('shown');
        $.ajax({
            type: "POST",
            url: "/summary-msg-seen",
            success: function (data) {
            },
            error: function(data) {
            }
        });
    }

    function closeConfetti(){
        if (summary_msg !== "winner"){
            return;
        }
        $("#confetti-canvas").addClass('fold-down');
        setTimeout($("#confetti-canvas").remove, 8000)
    }

    function getSummaryMsg(){
        let title,msg;
        switch (summary_msg){
            case "winner":
                title = "אלוף האלופים!!";
                msg =`
                ברכות על הזכיה 🏆 יא מלך 🤑 <br>
                נכנסת לדפי ההיסטוריה בענק! <br>
                שמך נחרט ברגעים אלו על הקיר המרכזי במוזיאון הרשמי של פיפ"א. <br>
                תהנה מהכסף והתהילה, זה מגיע לך 😏
                `;
                break;
            case "runner_up":
                title = "ברכות יא תותח!";
                msg =`
                זכית בכסף! (תרתי משמע🥈) <br>
                כל הכבוד💪 הישג מרשים! <br>
                אז תקנה לך משהו יפה 👗 <br>
                ואל תאמין לאלו שאומרים שאף אחד לא זוכר את מספר 2, אצלינו תמיד תישאר בסטטיסטיקה
                `;
                break;
            case "3rd":
                title = "שלום לך🥉!";
                msg =`
                זכית במקום השלישי ובפרס נאה... 💲💲 <br>
                אז אולי לא תגשים את כל החלומות שלך, אבל בואנ'ה זה אחלה כסף! <br>
                <br>
                עבדת קשה ובאת על שכרך, ברכות!
                `;
                break;
            case "4th":
                title = "Break Even";
                msg =`
                אפשר להירגע, להתקשר לבנקאי ולבטל את המשכנתא על הדירה 🏠 <br>
                סיימת במקום הרביעי וזכית בכל כספך בחזרה 💵 <br>
                זה היה מותח, זה לא היה פשוט, אבל בסוף עשית זאת!
                `;
                break;
            case "almost_money":
                title = "כמעט נוגע במזומנים";
                msg =`
                היית כל כך קרוב להגיע למקום שיזכה אותך בפרס,<br>
                הכסף ממש חמק לך מבין האצבעות 💸<br>
                ואתה נשארת רק עם המחמאות...<br>
                בכל זאת נכנסת לחמשת הגדולים, טפח לעצמך על השכם!
                `;
                break;
            case "bottom_of_top":
                title = "לא רחוק מהישג";
                msg =`
                היית קרוב, אבל לא הצלחת לשים ידך על אחד הפרסים... <br><br>
                החדשות הטובות: <br>
                המונדיאל מתחיל בעוד פחות משנה! <br>
                זו ההזדמנות שלך להחזר את הכסף שהפסדת פה... <br>
                ויותר 😏
                `;
                break;
            case "middle":
                title = "מקום טוב באמצע 😑";
                msg = `לא לקחת כסף, <br>
                לא ירדת ליגה, <br>
                לפחות אתה נכנס למוקדמות של גביע האינטרטוטו 🏆 <br>
                בהצלחה!
                `;
                break;
            case "top_of_bottom":
                title = "לא הטורניר שלך";
                msg = `אתה בחצי התחתון של ה16, זה לא משהו... <br>
                אבל אתה יודע מי עוד נמצא שם??? <br><br>
                צרפת <span class="flag">🇫🇷</span>, גרמניה <span class="flag">🇩🇪</span> ופורטוגל <span class="flag">🇵🇹</span>
                <br>
                ככה שאתה בחברה טובה!
                `;
                break;
            case "almost_last":
                title = "העיקר שאתה לא אחרון אחי";
                msg = `לא משנה כמה פספסת, <br>
                תמיד תזכור שהיה מישהו יותר גרוע ממך... <br>
                לעולם אל תהיה זנב לשועלים!
                &#129418;
                <br>
                יאללה תתאמן לשנה הבאה`;
                break;
            case "last":
                title = "אחרון מוסיף המון";
                msg = `סיימת אחרון, <br>
                אבל הוכחת שאתה יותר חכם מקוף&#128584;, זה גם משהו!
                <br>
                בהצלחה בשנה הבאה...`;
                break;
            default:
                title = "you are not the winner";
                msg = "cheer up mate";
        }
        return {title, msg};
    }

    function renderDiploma(){
        const {title, msg} = getSummaryMsg();
        $("#diploma-title").html(title);
        $("#diploma-msg").html(msg);
        $("#fix-wrapper").addClass('shown');
        $("#summary_container").addClass('shown');
        setTimeout(()=>{
            $("#diploma-close").click(closeDiploma);
        }, 1000)
    }

    function renderDollar(){
        $("#dollar_container").addClass('shown');
        console.log('aqui');
    }

    function renderCenterMoneyBag(){
        $("#money_bags_container").addClass('shown');
        $("#center_money_bag_wrap").addClass('shown');
    }

    function renderTwoMoneyBags(){
        const container = $("#money_bags_container")
        container.addClass('shown');
        container.find(".right-bag").addClass('shown');
        setTimeout(()=>{
            container.find(".left-bag").addClass('shown');
        }, 500)
    }

    function renderAllTrophies(){
        const bags_container = $("#money_bags_container")
        bags_container.addClass('shown');
        bags_container.find(".right-bag").addClass('shown');
        setTimeout(()=>{
            bags_container.find(".left-bag").addClass('shown');
        }, 1000)
        setTimeout(()=>{
            $("#center_money_bag_wrap").addClass('shown');
        }, 2000)
        setTimeout(()=>{
            $("#trophy_container").addClass('shown');
            setTimeout(renderDiploma,4000);
        }, 3000)
    }

    function renderConfetti(){
        $("#confetti-canvas").addClass('max-height');
        
        const confettiSettings = {
            target: 'confetti-canvas',
            clock: 35,
            max: 150,
            size: 1.6,
            rotate: true,
            props: ['square'],
        };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }

    function renderCongrats(){
        if (summary_msg === "winner"){
            renderConfetti();
            setTimeout(renderAllTrophies, 4000);
        } else if (summary_msg === "runner_up"){
            renderTwoMoneyBags();
            setTimeout(renderDiploma, 2000);
        } else if (summary_msg === "3rd"){
            renderCenterMoneyBag()
            setTimeout(renderDiploma, 2000);
        } else if (summary_msg === "4th"){
            renderDollar()
            setTimeout(renderDiploma, 7000);
        } else {
            renderDiploma();
        }
    }

    document.addEventListener('DOMContentLoaded', (event) => {
        renderCongrats();
    });

</script>


@endif


