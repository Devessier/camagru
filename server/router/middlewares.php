<?php

function body_json() {
	if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
		return [
			'body' => json_decode(file_get_contents('php://input'), TRUE)
		];
	}
	return [];
}

function authenticated () {
	return !empty($_SESSION['username']) && !empty($_SESSION['email'] && !empty($_SESSION['group']));
}

function isNotAuthenticated () {
	return !authenticated();
}
