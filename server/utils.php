<?php

function validEmail ($email) {
	return preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $email);
}

function array_any (array $array, $fn) {
    foreach ($array as $item) {
        if ($fn($item) === true)
            return true;
    }
    return false;
}

function array_every (array $array, $fn) {
    foreach ($array as $item) {
        if ($fn($item) === false)
            return false;
    }
    return true;
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}
