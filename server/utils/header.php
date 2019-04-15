<?php

function redirect ($path) {
	header('Location: ' . $path);
}

function content_type($file) {
	$mimetypes = [
		'css' => 'text/css',
		'html' => 'text/html',
		'png' => 'image/png',
	];
	$dots = explode('.', $file);
	$type = $mimetypes[end($dots)];
	header('Content-Type: ' . ($type === '' ? 'text/html' : $type));
}
