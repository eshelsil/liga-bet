<div dir="{{ app()->getLocale() === 'he' ? 'rtl' : 'ltr' }}">
    <h1>{{ __('שכחת את הסיסמא?') }}</h1>

    <h4>
        {{ __('לחץ על הלינק כדי לאפס את הסיסמא ולהתחבר לאתר:') }}
    </h4>
    <div>
        <a href="{{ route('reset-password', $token) }}">{{ __('אפס סיסמא') }}</a>
    </div>
</div>
