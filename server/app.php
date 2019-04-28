<?php

session_start();

require __DIR__ . '/Iceman/autoload.php';

use Iceman\Route;
use Iceman\Middlewares;

Route::get('/^\/?$/', 'UserController@test', Middlewares::bind('json'));
Route::post('/^\/?$/', 'UserController@test');

Route::get('/^\/user\/([^\/]+)\/?$/', 'UserController@user');
