<?php

namespace Iceman;

function arrayType (array $array) {
    $number = null;

    foreach (array_keys($array) as $key) {
        if ($number === null)
            $number = is_numeric($key);
        if (is_numeric($key)) {
            if (!$number) {
                return false;
            }
        } else if ($number) {
            return false;
        }
        $number = is_numeric($key);
    }
    if ($number === null)
        return 'numeric';
    return $number ? 'numeric' : 'assoc';
}

function rmRf ($dir) {
    if (@is_dir($dir)) {
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
    } else {
        @unlink($dir);
    }
}
