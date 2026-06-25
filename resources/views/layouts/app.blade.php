<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'he' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ app()->getLocale() === 'en' ? 'Liga-Bet' : config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,600" rel="stylesheet" type="text/css">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5R94NY9R3R"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-5R94NY9R3R');
    </script>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <style>
        /* Language switcher — a flag dropdown, right next to the brand (also on mobile). */
        .lb-lang-switcher {
            display: inline-flex;
            align-items: center;
            margin-inline-start: 12px;
            margin-inline-end: auto; /* keep it beside the brand, push the rest away */
        }
        .lb-lang-toggle {
            display: inline-flex;
            align-items: center;
            gap: 0.4em; /* even space between flag and caret in both directions */
            cursor: pointer;
        }
        /* reset Bootstrap's directional caret margin so spacing stays symmetric in RTL/LTR */
        .lb-lang-toggle.dropdown-toggle::after {
            margin: 0;
            vertical-align: middle;
        }
        .lb-lang-toggle img {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
        }
        .lb-lang-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .lb-lang-item img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }

        /* The bundled app.css hard-codes RTL on the auth card. Make these follow
           the document direction instead, so English renders LTR and Hebrew RTL.
           Scoped by [dir] for higher specificity; `start`/`end` resolve per dir. */
        [dir] .card { direction: inherit; }
        [dir] .card .card-header,
        [dir] .card .card-body .alert,
        [dir] .card .card-body .form-group .col-form-label,
        [dir] .card .card-body .form-group .checkbox { text-align: start; }
        [dir] .navbar-collapse .navbar-nav .nav-link { text-align: start; }
    </style>
    @yield('script')
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light navbar-laravel">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ app()->getLocale() === 'en' ? 'Liga-Bet' : config('app.name', 'Laravel') }}
                </a>

                <!-- Language Switcher (dropdown; kept outside the collapse so it stays in the header on mobile) -->
                @php($currentLocale = app()->getLocale())
                <div class="lb-lang-switcher dropdown">
                    <a class="lb-lang-toggle dropdown-toggle" href="#" role="button" id="lbLangDropdown"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Language">
                        <img src="https://hatscripts.github.io/circle-flags/flags/{{ $currentLocale === 'he' ? 'il' : 'gb' }}.svg"
                             alt="{{ $currentLocale === 'he' ? 'עברית' : 'English' }}">
                    </a>
                    <div class="dropdown-menu {{ $currentLocale === 'he' ? 'dropdown-menu-right' : '' }}" aria-labelledby="lbLangDropdown">
                        <a class="dropdown-item lb-lang-item {{ $currentLocale === 'he' ? 'active' : '' }}"
                           href="{{ route('set-locale', ['locale' => 'he']) }}">
                            <img src="https://hatscripts.github.io/circle-flags/flags/il.svg" alt=""><span>עברית</span>
                        </a>
                        <a class="dropdown-item lb-lang-item {{ $currentLocale === 'en' ? 'active' : '' }}"
                           href="{{ route('set-locale', ['locale' => 'en']) }}">
                            <img src="https://hatscripts.github.io/circle-flags/flags/gb.svg" alt=""><span>English</span>
                        </a>
                    </div>
                </div>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                            <li><a class="nav-link" href="{{ route('login') }}">{{ __('התחבר') }}</a></li>
                            <li><a class="nav-link" href="{{ route('register') }}">{{ __('הרשמה') }}</a></li>
                        @else
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>
</body>
</html>
