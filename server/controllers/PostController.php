<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

use Iceman\Image;

class PostController {

    public static function file (Request $request) {
        [ 'file' => $file ] = $request->body();

        echo "file\n";
    }

    public static function photo (Request $request) {
        $body = $request->body();

        print_r($body);

        $photo = $body->photo;
        $message = $body->message;

        $filter = (object) [
            'name' => $body->filter_name,
            'width' => $body->filter_width,
            'height' => $body->filter_height,
            'x' => $body->filter_x,
            'y' => $body->filter_y
        ];

        if (!($photo && $message && array_every(function ($item) { return !!$item; }))) {
            return Response::badRequest();
        }

        if (!($image = Image::fromBase64($photo))) {
            return Response::badRequest();
        }

        print_r($image);
    }

}
