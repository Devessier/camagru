<?php

session_start();

require_once __DIR__ . '/utils.php';
require __DIR__ . '/Iceman/autoload.php';

use Iceman\Route;
use Iceman\Middlewares;

Route::get('/^\/?$/', 'HomeController@welcome');

Route::get('/^\/filters\/all\/?$/', 'FiltersController@all');

Route::post('/^\/sign-up\/?$/', 'AuthController@signup', Middlewares::bind('json'));
Route::post('/^\/sign-in\/?$/', 'AuthController@login', Middlewares::bind('json'));
Route::get('/^\/logout\/?$/', 'AuthController@logout');

Route::get('/^\/me\/?$/', 'UserController@me', Middlewares::bind('authorized'));
Route::put('/^\/me\/modify\/?$/', 'UserController@modify', Middlewares::bind('authorized'), Middlewares::bind('json'));

Route::get('/^\/posts\/(\d+)\/(\d+)\/?$/', 'PostController@posts');

Route::post('/^\/post\/add\/file\/?$/', 'PostController@file', Middlewares::bind('authorized'), Middlewares::bind('body'));
Route::post('/^\/post\/add\/photo\/?$/', 'PostController@photo', Middlewares::bind('authorized'), Middlewares::bind('body'));

Route::get('/^\/user\/([^\/]+)\/?$/', 'UserController@user', Middlewares::bind('authorized'));

Route::get('/^\/public\/(images|filters)\/([^\.\/]+\.[^\.]+)\/?$/', 'PublicController@fetch');
