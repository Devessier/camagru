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
