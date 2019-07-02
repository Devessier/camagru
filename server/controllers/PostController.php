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

            if (!$filter->superposeTo($image, $filter_arr['x'], $filter_arr['y'], $filter_arr['width'], $filter_arr['height'])) {
                return Response::internalError();
            }

            if (!($path = $image->saveTo('images', 'png'))) {
                return Response::internalError();
            }

            $imageID = DB::insert('INSERT INTO images(path) VALUES(?)', [
                $path
            ]);
            
            DB::insert('INSERT INTO posts(user_id, img_id, text) VALUES(:user_id, :img_id, :text)', [
                'user_id' => $request->session('id'),
                'img_id' => $imageID,
                'text' => $message
            ]);

            imagedestroy($filter->content());
            imagedestroy($image->content());

            return Response::make()
                    ->json([
                        'path' => $path
                    ]);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function posts (Request $request, $start, $end) {
        try {
            DB::connect();

            $posts = DB::select('SELECT posts.id, posts.text AS comment, posts.created_at AS createdAt, images.path AS url, users.id AS author_id, users.username AS author_username FROM posts INNER JOIN images ON posts.img_id = images.id INNER JOIN users ON users.id = posts.user_id ORDER BY posts.created_at DESC LIMIT ? OFFSET ?', [
                $end - $start,
                $start
            ]);

            foreach ($posts as &$post) {
                $comments = DB::select('SELECT * FROM comments WHERE post_id = :id ORDER BY created_at DESC', [
                    'id' => $post['id']
                ]);

                $post['user'] = [
                    'id' => (int)$post['author_id'],
                    'name' => $post['author_username'],
                    'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                ];

                $post['id'] = (int)$post['id'];

                unset($post['author_id'], $post['author_username']);

                $post['comments'] = $comments ?? [];
            }

            return Response::make()
                    ->json($posts);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

}
