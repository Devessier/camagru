<?php

require_once __DIR__ . '/../utils/header.php';

function get_request($middlewares) {
	$url = $_SERVER['REQUEST_URI'];

	$request = [
		'url' => $url == '' ? '/' : $url,
		'method' => $_SERVER['REQUEST_METHOD'],
	];

	if (count($middlewares) > 0) {
		foreach ($middlewares as $middleware) {
			$result = call_user_func($middleware, $request);
			if ($result === FALSE)
				return NULL;
			if (is_array($result))
				$request = array_merge($request, $result);
		}
	}

	return $request;
}

function middleware($url, $page, $middlewares) {
	$request_url = $_SERVER['REQUEST_URI'] === '' ? '/' : $_SERVER['REQUEST_URI'];

	if (@preg_match($url, $request_url, $matches)) {
		if (($request = get_request($middlewares)) === NULL) {
			redirect('/401');
			exit();
		}

		content_type($request['url']);
		if (strpos($page, 'controllers')) {
			$controller = __DIR__ . '/../' . $page;
			if (file_exists($controller)) {
				require $controller;
				if (!function_exists($function = empty($matches[1]) ? 'index' : $matches[1])) {
					redirect('/404');
					exit();
				}
				call_user_func($function, $matches);
				exit();
			}
			redirect('/404');
			exit();
		} else if (count($matches) > 1) {
			$file = __DIR__ . "/../$page" . $matches[0];
			if (file_exists($file))
				readfile($file);
			exit();
		}
		require __DIR__ . "/../$page";
		exit();
	}

}

function get($url, $page, ...$middlewares) {
	if ($_SERVER['REQUEST_METHOD'] === 'GET')
		middleware($url, $page, $middlewares);
}

function post($url, $page, ...$middlewares) {
	if ($_SERVER['REQUEST_METHOD'] === 'POST')
		middleware($url, $page, $middlewares);
}
