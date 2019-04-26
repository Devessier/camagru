<?php

namespace Iceman;

require_once __DIR__ . '/autoload.php';

load(__DIR__ . '/../controllers');

class Route {

	private static function handle ($httpMethod, $pattern, $action) {
		$requestUri = $_SERVER['REQUEST_URI'];
		$requestMethod = $_SERVER['REQUEST_METHOD'];

		if (strtoupper($httpMethod) === strtoupper($requestMethod)) {
			list($controller, $method) = explode('@', $action);

			try {
				$instance = new $controller;

				if (method_exists($instance, $method)) {
					$instance->$method();
				}
			} catch (Exception $e) {}
			

			print_r($instance);

			exit();
		}
	}

	public static function get ($pattern, $action) {
		self::handle('get', $pattern, $action);
	}

	public static function post ($pattern, $action) {
		self::handle('post', $pattern, $action);
	}

	public static function put ($pattern, $action) {
		self::handle('put', $pattern, $action);
	}

	public static function delete ($pattern, $action) {
		self::handle('delete', $pattern, $action);
	}

}
