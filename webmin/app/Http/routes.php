<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use App\Http\Controllers\LA\Contact_Datas;

Route::get('/', function () {
    return view('welcome');
});

/* ================== Homepage + Admin Routes ================== */

require __DIR__.'/admin_routes.php';

/*
	TUTS
	https://tutorials.kode-blog.com/laravel-5-rest-api
	https://github.com/connor11528/laravel-api-example
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => 'auth:api'], function() {
	return response()->json(array("FOO"=>"BAR"), 200);
});*/


//Route::get('/api/v1/test', function () {
Route::get('/api/v1/user/{id?}', ['middleware' => 'auth.basic', function($id = null) {
    
    $user = App\User::find($id);
    //$user = null;

	return Response::json(array(
        'error' => false,
        'user'  => $user,
        'status_code' => 200
    ));

}]);

Route::get('/api/v1/getcsrftoken', function(){
    return Response::json(array(
        'success' => true,
        'token'  => csrf_token()
    ));
});


Route::group(['prefix' => 'api', 'middleware' => 'throttle'], function () {
    Route::post('/v1/contact/save', 'LA\Contact_DatasController@save');
    Route::post('/v1/quote/save', 'LA\Quote_My_AppsController@save');
});

/*
$.ajaxSetup({
    headers: {
        'X-XSRF-TOKEN': $('input[name="_token"]').val()
    }
});

*/




