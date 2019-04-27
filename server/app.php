<?php

require __DIR__ . '/Iceman/autoload.php';

use Iceman\Route;
use Iceman\Middlewares;

Route::get('/', 'UserController@test', Middlewares::bind('json'));
