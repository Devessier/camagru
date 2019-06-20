<?php

require_once __DIR__ . '/../utils.php';

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
