<?php

require __DIR__ . '/Iceman/autoload.php';

use Iceman\Route;

Route::get('/', 'UserController@test');

Route::get('/', 'UserController@surprise');
