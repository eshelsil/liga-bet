<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <title>מונדיאל חברים - {{  \Auth::user()->name }}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" />

    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
    <style>
        /* Remove the navbar's default margin-bottom and rounded borders */
        .navbar {
            margin-bottom: 0;
            border-radius: 0;
        }

        .admin {
            display: none;
        }

        *, th {
            text-align: right;
            direction: rtl;
        }
        /* Set height of the grid so .sidenav can be 100% (adjust as needed) */
        .row.content {height: 450px}

        /* Set gray background color and 100% height */
        .sidenav {
            padding-top: 20px;
            background-color: #f1f1f1;
            height: 100%;
        }

        /* Set black background color, white text and some padding */
        footer {
            background-color: #555;
            color: white;
            padding: 15px;
        }

        /* On small screens, set height to 'auto' for sidenav and grid */
        @media screen and (max-width: 767px) {
            .sidenav {
                height: auto;
                padding: 15px;
            }
            .row.content {height:auto;}
        }

        .rank-1 { background-color: #1c7430!important; color: #ffffff!important; }
        .rank-2 { background-color: #1f3e1a!important; color: #ffffff!important; }
        .rank-3 { background-color: #495057!important; color: #ffffff!important; }
        .rank-4 { background-color: #645b62!important; color: #ffffff!important; }
    </style>
</head>
<body style="direction: rtl;" dir="rtl">

<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header" style="float: right!important;text-align: right">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/home">מונדיאל חברים - {{  \Auth::user()->name }}</a>
        </div>
        <div class="collapse navbar-collapse" style="float: right!important;" id="myNavbar">
            <ul class="nav navbar-nav">
                <li class="{{ Route::currentRouteName() == "update" ? "active" : "" }}"><a href="/admin/complete-all-matches">עדכן</a></li>
                <li class="{{ Route::currentRouteName() == "my-bets" ? "active" : "" }}"><a href="/my-bets">הטופס שלי</a></li>
                <li class="{{ Route::currentRouteName() == "match-list" ? "active" : "" }}"><a href="/today-matches">רשימת משחקים</a></li>
                <li class="{{ Route::currentRouteName() == "open-matches" ? "active" : "" }}"><a href="/open-matches">הימורים פתוחים</a></li>
                <li class="{{ Route::currentRouteName() == "home" ? "active" : "" }}"><a href="/home">טבלת ניקוד</a></li>
            </ul>
            {{--<ul class="nav navbar-nav navbar-right">--}}
                {{--<li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>--}}
            {{--</ul>--}}
        </div>
    </div>
</nav>

<div class="container-fluid text-center">
    <div class="row content">
        <div class="col-sm-2 sidenav">
            <p><a href="#">Link</a></p>
            <p><a href="#">Link</a></p>
            <p><a href="#">Link</a></p>
        </div>
        <div class="col-sm-8 text-left">
            @yield('content')
        </div>
        <div class="col-sm-2 sidenav">
            <div class="well rank-1">
                <p>מקום ראשון<br>1600 ש"ח</p>
            </div>
            <div class="well rank-2">
                <p>מקום שני<br>700 ש"ח</p>
            </div>
            <div class="well rank-3">
                <p>מקום שלישי<br>300 ש"ח</p>
            </div>
            <div class="well rank-4">
                <p>מקום רביעי<br>150 ש"ח</p>
            </div>
        </div>
    </div>
</div>

<footer class="container-fluid text-center">
    <p>Footer Text</p>
</footer>

</body>
<script>
    $(function () {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    })
</script>
</html>
