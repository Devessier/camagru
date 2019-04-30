<?php

session_start();

require __DIR__ . '/Iceman/autoload.php';

use Iceman\Route;
use Iceman\Middlewares;

Route::get('/^\/?$/', 'HomeController@welcome');

Route::post('/^\/sign-up\/?$/', 'UserController@signup', Middlewares::bind('json'));
Route::post('/^\/sign-in\/?$/', 'AuthController@login', Middlewares::bind('json'));

Route::get('/^\/me\/?$/', 'UserController@me');

Route::get('/^\/user\/([^\/]+)\/?$/', 'UserController@user');
