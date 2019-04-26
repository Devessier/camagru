<?php

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length === 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function load ($dir) {
	$entries = @scandir($dir);
	foreach ($entries as $entry) {
		if (!($entry === '.' || $entry === '..')) {
			$filepath = $dir . '/' . $entry;

			if (@is_dir($filepath)) {
				load($dir);
			} else if (endsWith($entry, '.php')) {
				include_once $filepath;
			}
		}
	}
}

load (__DIR__);
