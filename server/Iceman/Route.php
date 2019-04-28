<?php

namespace Iceman;

require_once __DIR__ . '/autoload.php';

load(__DIR__ . '/../controllers');

class Route {

	private static function handle ($httpMethod, $pattern, $action, ...$middlewares) {
        $requestUri = $_SERVER['REQUEST_URI'];
		$requestMethod = $_SERVER['REQUEST_METHOD'];

        if (strtoupper($httpMethod) === strtoupper($requestMethod)
            && @preg_match($pattern, $requestUri, $matches)) {
            [ $controller, $method ] = explode('@', $action);
            array_shift($matches);

			try {
				if (method_exists($controller, $method)) {
                    $data = Middlewares::resolve($middlewares);

                    $request = Request::create($data);

                    if (is_string($response = $controller::$method($request, ...$matches))) {
                        $response = Response::make($response, 200);
                    }

                    if ($response && $response instanceof Response)
                        $response->send();
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
