<?php

require_once __DIR__ . '/../utils.php';

function load ($dir) {
	try {
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
	} catch (\Exception $e) {}
}

load (__DIR__);
