@extends('layouts.home')

<?php
    $user = Auth::user();
?>

@section('script')

<script>
    function setPassword() {
        const new_password = $('#new_password').val();
        const new_password_confirmation = $('#confirm_password').val();
        $.ajax({
            type: 'PUT',
            url: '/set-password',
            contentType: 'application/json',
            data: JSON.stringify({
                new_password,
                new_password_confirmation,
            }),
            dataType: 'json',
            success: function (data) {
                cancelForm();
            },
            error: function(data) {
                const {errors = {}} = data.responseJSON;
                let error = Object.values(errors)[0] ?? [];
                let error_msg = error[0];
                const msg = error_msg ?? data.responseJSON.message;
                toastr["error"](msg);
            }
        });
    }

    function cancelForm(){
        window.history.back();
    }

</script>

@endsection


@section('content')
    <h1>בחר סיסמא חדשה</h1>
    <div class="flex-direction-start">
        @csrf

        <div class="form-group row">
            <label for="username" class="col-xs-4 col-form-label text-md-right">{{ __('Username') }}</label>
            <div class="col-md-6">
                <input id="username" type="text" class="form-control" name="username" value="{{$user->username}}" disabled>
            </div>
        </div>

        <div class="form-group row">
            <label for="new_password" class="col-md-4 col-form-label text-md-right">{{ __('New Password') }}</label>

            <div class="col-md-6">
                <input id="new_password" type="password" class="form-control" name="new_password" required autofocus>
            </div>
        </div>
        <div class="form-group row">
            <label for="confirm_password" class="col-md-4 col-form-label text-md-right">{{ __('Confirm Password') }}</label>

            <div class="col-md-6">
                <input id="confirm_password" type="password" class="form-control" name="confirm_password" required>
            </div>
        </div>


        <div class="form-group row mb-0">
            <div class="col-md-8 offset-md-4">
                <button class="btn btn-sm btn-secondary" onclick="cancelForm()" >ביטול</button>
                <button type="submit" class="btn btn-sm btn-danger" onclick="setPassword()" >שנה סיסמה</button>
            </div>
        </div>
    </div>

@endsection
