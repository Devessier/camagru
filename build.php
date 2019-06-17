#!/usr/bin/env php
<?php

include_once __DIR__ . '/babel.php';

echo <<<EOT


Camagru static files generation process



EOT;

$dir = __DIR__ . '/front';

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length === 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function get_js_files ($path, $dep = 0) {
	$paths = [];

	if ($handle = @opendir($path)) {
		while (($entry = @readdir($handle)) !== false) {
			if ($entry[0] !== '.') {
				$filepath = $path . '/' . $entry;

				if (is_dir($filepath)) {
					$paths = array_merge($paths, get_js_files($filepath, $dep + 1));
				} else if (endsWith($entry, '.js')) {
					$paths[] = $filepath;
				}
			}
		}
		@closedir($handle);
	}

	return $paths;
}

function sort_files_and_conc($paths) {
	$files = [];
	$tmp = [];
	$last = null;

	echo <<<EOT
Building JavaScript assets ...


EOT;

	foreach ($paths as $path) {
		echo <<<EOT
Processing $path ...

EOT;

		$file = file_get_contents($path);

		if (@preg_match('/^(?:\/\*(?<ID>[^;\n]*)\*\/){1}/', $file, $matches)) {
			$file = @preg_replace('/^(?:\/\*(?:[^;\n]*)\*\/){1}\n/', '', $file);
			$file = transpile($file);
			$trimmed = trim($matches['ID']);

			if ($trimmed === 'LAST') {
				$last = $file;
			} else {
				$order = (int)$trimmed;
	
				place_file($files, $order, $file);
			}
		} else {
			$tmp[] = $file;
		}
	}

	ksort($files);
	array_push($files, ...$tmp);
	$files[] = $last;
	return "'use strict';\n" . implode('', $files);
}

function place_file (&$files, $pos, $file) {
	if (isset($files[$pos]))
		place_file($files, $pos + 1, $file);
	else {
		$files[$pos] = $file;
	}
}

$paths = get_js_files($dir);

$id = md5(uniqid());

echo <<<EOT
ID of build: $id


EOT;

$dist = __DIR__ . '/dist';

function rmRf ($dir) {
	if ($handle = @opendir($dir)) {
		while (($entry = @readdir($handle)) !== false) {
			if (!($entry === '.' || $entry === '..')) {
				$filepath = $dir . '/' . $entry;

				if (is_dir($filepath)) {
					rmRf($filepath);
					@rmdir($filepath);
				} else {
					@unlink($filepath);
				}
			}
		}
		@closedir($handle);
	}
}

if (file_exists($dist)) {
	if (is_dir($dist)) {
		rmRf($dist);
		@rmdir($dist);
	}
	else
		@unlink($dist);
}

@mkdir($dist);

$mainChunk = "/dist/app-$id.js";

if (@file_put_contents(__DIR__ . $mainChunk, sort_files_and_conc($paths)) === false) {
	echo "ERROR: An error occured while writing " . $mainChunk . " ! Exit" . PHP_EOL;
	exit(1);
}

echo <<<EOT

Wrote JavaScript application chunk to $mainChunk

EOT;

$indexHtml = __DIR__ . '/front/index.html';

function get_css_files ($dir, $base) {
	$files = [];

	$scan = @scandir($dir);
	foreach ($scan as $file) {
		if (!($file === '.' || $file === '..')) {
			$path = $dir . '/' . $file;
			
			if (is_dir($path)) {
				array_push($files, ...get_css_files($path, $base . '/' .  $file));
			} else if (endsWith($file, '.css')) {
				$files[] = $base . '/' . $file;
			}
		}
	}

	return $files;
}

$cssPaths = get_css_files(__DIR__ . '/front/public/css', '/css');

if (file_exists($indexHtml) && ($indexHtmlContent = file_get_contents($indexHtml)) !== false) {
	$distCSS = __DIR__ . '/dist/css';
	rmRf($distCSS);
	@mkdir($distCSS);

	$indexHtmlContent = preg_replace('/{{ APP_CHUNK }}/', "/app-$id.js", $indexHtmlContent);
	$dom = new DOMDocument();
	$dom->loadHTML($indexHtmlContent);
	$head = $dom->getElementsByTagName('head')[0];

	foreach ($cssPaths as $css) {
		$newFileName = explode('.', $css)[0] . "-$id.css";

		echo <<<EOT

Processing $css -> $newFileName
EOT;

		if (substr_count($newFileName, '/') > 2) {
			list(, , $dir) = explode('/', $newFileName);
			@mkdir(__DIR__ . "/dist/css/$dir");
		}

		@copy(__DIR__ . '/front/public' . $css, __DIR__ . '/dist' . $newFileName);

		$tag = $dom->createElement('link');

		$attributes = [
			'rel' => 'stylesheet',
			'type' => 'text/css',
			'href' => $newFileName
		];

		foreach ($attributes as $name => $value) {
			$attr = $dom->createAttribute($name);
			$attr->value = $value;

			$tag->appendChild($attr);
		}

		$head->appendChild($tag);
	}

	if (!$dom->saveHTMLFile(__DIR__ . '/dist/index.html')) {
		echo "ERROR: Couldn't write index.html to dist directory" . PHP_EOL;
	}
} else {
	echo "ERROR: Couldn't find index.html and get its content" . PHP_EOL;
	exit(1);
}

echo <<<EOT


Build step is finished, all files have been processed, exit



EOT;
