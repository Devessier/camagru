<?php

use Iceman\Request;
use Iceman\Response;

class PublicController {

    public static function fetch (Request $request, $dir, $file) {
        try {
            $path = __DIR__ . '/../public/' . $dir . '/' . $file;

            if (endsWith($file, '.png')) {
                $type = 'image/png';
            } else if (endsWith($file, '.jpg') || endsWith($file, '.jpeg')) {
                $type = 'image/jpeg';
            } else {
                $type = 'text/plain';
            }

            return Response::make(file_get_contents($path))->header('Content-Type', $type);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

}
