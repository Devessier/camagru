<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

use Iceman\Image;
use Iceman\Filter;

class PostController {

    private const MAX_HEIGHT = 480;
    private const MAX_WIDTH = 680;

    public static function file (Request $request) {
        [ 'file' => $file ] = $request->body();

        echo "file\n";
    }

    public static function photo (Request $request) {
        try {
            DB::connect();

            $body = $request->body();

            $photo = $body->photo;
            $message = $body->message;

            $filter_arr = [
                'name' => $body->filter_name,
                'width' => (int)$body->filter_width,
                'height' => (int)$body->filter_height,
                'x' => (int)$body->filter_x,
                'y' => (int)$body->filter_y
            ];

            if (!(
                $photo
                && $message
                && strlen($message) <= 120
                && array_every($filter_arr, function ($item) { return isset($item); })
                && ($filter_arr['x'] + $filter_arr['width']) <= self::MAX_WIDTH
                && ($filter_arr['x'] + $filter_arr['width']) >= 0
                && ($filter_arr['y'] + $filter_arr['height']) <= self::MAX_HEIGHT
                && ($filter_arr['y'] + $filter_arr['height']) >= 0)) {
                return Response::badRequest();
            }

            $filter = Filter::fromName($filter_arr['name'], $filter_arr);
            $image = Image::fromBase64($photo);

            if (!($filter && $image)) {
                return Response::badRequest();
            }

            $resource = $filter->superposeTo($image, $filter_arr['x'], $filter_arr['y']);

            imagedestroy($filter->content());

            header('Content-Type: image/jpeg');
            imagejpeg($resource);

            imagedestroy($resource);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

}
