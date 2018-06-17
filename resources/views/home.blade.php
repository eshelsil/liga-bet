@extends('layouts.home')

@section('content')
            <h1>טבלה עדכנית</h1>
            <table class="table">
                <thead>
                <tr>
                    <th>מקום</th>
                    <th>שם</th>
                    <th>ניקוד</th>
                </tr>
                </thead>
                <tbody>
                @foreach($table as $row)
                    <tr class="rank-{{$row->rank}}">
                        <td>{{$row->rank}}</td>
                        <td>{{$row->name}}</td>
                        <td>{{$row->total_score}}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
@endsection