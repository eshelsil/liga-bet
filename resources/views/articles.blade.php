@extends('layouts.home')

@section('script')
<style>
    .panel-collapse {
        padding: 20px;
    }
    h3 {
        margin-top: 0px;
    }
    .author{
        color: #777;
    }
    .article_content{
        margin-top: 35px;
        margin-bottom: 45px;
        white-space: pre-line;
    }
    a.origin_link::after{
        content: attr(href);
    }
</style>
@endsection

@php
$articles = [
    1 => [
        'date' => '25/6/21-17:51',
        'author' => 'אשל זילברשטיין',
        'title' => 'הקאמבק של רועי?',
        'content_view' => 'roy_knockout'
],
    2 => [
        'date' => '23/6/21-01:29',
        'author' => 'אשל זילברשטיין',
        'title' => 'גלעד מלך הבתים',
        'content_view' => 'gilad_group_bets'
    ]
]
@endphp

@section('content')
    <div class="all-ltr" style="margin-bottom: 30px;">
        <h2 style="text-align: center;">מאמרים</h2>
        @foreach($articles as $id => $article)
        <?php
            $date = DateTime::createFromFormat("d/m/y-H:i", $article['date']);
        ?>
            
        <div class="panel-group" style="margin-bottom: 0;">
            <div class="panel panel-default">
                <div class="panel-heading row" style="margin-right: 0;margin-left: 0;">
                    <div class="col-xs-6 pull-right">
                        <h4 class="panel-title">
                            <a data-toggle="collapse" href="#article-{{$id}}">{{$article['title']}}</a>
                        </h4></div>
                    <div class="col-xs-6 pull-right">
                        {{ $date->format("d/m/Y") }}
                    </div>
                </div>
                <div id="article-{{$id}}" class="panel-collapse collapse">
                    <h3>{{$article['title']}}</h3>
                    <h5 class="author">
                        {{$article['author']}}, {{ $date->format("H:i d/m/Y") }}
                    </h5>
                    <div class="article_content">
                        @include('articles.'.$article['content_view'])
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
@endsection
