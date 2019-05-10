<?php

session_start();

require_once __DIR__ . '/utils.php';
require __DIR__ . '/Iceman/autoload.php';

use Iceman\Route;
use Iceman\Middlewares;

Route::get('/^\/?$/', 'HomeController@welcome');

Route::post('/^\/sign-up\/?$/', 'AuthController@signup', Middlewares::bind('json'));
Route::post('/^\/sign-in\/?$/', 'AuthController@login', Middlewares::bind('json'));
Route::get('/^\/logout\/?$/', 'AuthController@logout');

Route::get('/^\/me\/?$/', 'UserController@me');
Route::get('/^\/me\/posts\/?([0-9]*)\/?$/', 'UserController@posts');
Route::put('/^\/me\/modify\/?$/', 'UserController@modify', Middlewares::bind('json'));

Route::get('/^\/user\/([^\/]+)\/?$/', 'UserController@user');
