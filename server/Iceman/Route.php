<?php

namespace Iceman;

require_once __DIR__ . '/autoload.php';

load(__DIR__ . '/../controllers');

class Route {

	private static function handle ($httpMethod, $pattern, $action, ...$middlewares) {
		$requestUri = $_SERVER['REQUEST_URI'];
		$requestMethod = $_SERVER['REQUEST_METHOD'];

		if (strtoupper($httpMethod) === strtoupper($requestMethod)) {
            [ $controller, $method ] = explode('@', $action);

			try {
				if (method_exists($controller, $method)) {
                    $data = Middlewares::resolve($middlewares);
					$controller::$method($data);
				}
			} catch (Exception $e) {}

			exit();
		}
	}

	public static function get (...$args) {
		self::handle('get', ...$args);
	}

	public static function post (...$args) {
		self::handle('post', ...$args);
	}

	public static function put (...$args) {
		self::handle('put', ...$args);
	}

	public static function delete (...$args) {
		self::handle('delete', ...$args);
	}

}
