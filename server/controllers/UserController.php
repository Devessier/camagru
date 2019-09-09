<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

class UserController {

	public static function me (Request $request) {
        return self::user($request, $request->session('id'));
    }

    public static function user (Request $request, $id) {
        try {
            DB::connect();

            $users = DB::select('SELECT username, email, created_at, type, verified, wants_notifications FROM users WHERE id = :id', [
                'id' => $id
            ]);

            if (is_array($users) && isset($users[0])) {
                [ $user ] = $users;
                $user['wants_notifications'] = $user['wants_notifications'] === '1';
            } else {
                $user = null;
            }

            return Response::make()->json([
                'user' => ($user && $user['verified'] == true) ? $user : null
            ]);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function modify (Request $request) {
        try {
            $id = $request->session('id');

            $body = $request->body();

            $username = $body->username ?? null;
            $password = $body->password ?? null;
            $email = $body->email ?? null;

            $done = false;

            if (is_string($username)) {
                DB::connect();

                DB::update('UPDATE users SET username = :username WHERE id = :id', [
                    'username' => $username,
                    'id' => $id
                ]);

                $done = true;
            } else if (is_string($email) && validEmail($email)) {
                DB::connect();

                DB::update('UPDATE users SET email = :email WHERE id = :id', [
                    'email' => $email,
                    'id' => $id
                ]);

                $done = true;
            }

            return Response::make()
                    ->json([
                        'success' => $done
                    ]);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function posts (Request $request) {
        try {
            $id = $request->session('id');

            $query = <<<EOT
                SELECT
                    posts.id,
                    images.path AS "img"
                FROM
                    posts
                INNER JOIN
                    images
                ON
                    images.id = posts.img_id
                WHERE
                    posts.user_id = :user_id
                ORDER BY
                    posts.created_at DESC
EOT;

            DB::connect();

            $posts = DB::select($query, [
                'user_id' => $id
            ]);

            return Response::make()->json($posts);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function deletePost (Request $request, $postId) {
        try {
            $userId = $request->session('id');

            DB::connect();

            $getImgIdQuery = <<<EOT
                SELECT
                    img_id
                FROM
                    posts
                INNER JOIN
                    images
                ON
                    images.id = posts.img_id
                WHERE
                    posts.id = :post_id
                        AND
                    posts.user_id = :user_id
EOT;

            $imgId = DB::select($getImgIdQuery, [
                'post_id' => $postId,
                'user_id' => $userId
            ]);

            DB::statement('SET foreign_key_checks = 0');

            $deletePostQuery = <<<EOT
                DELETE FROM
                    posts
                WHERE
                    id = :post_id
                        AND
                    user_id = :user_id
EOT;

            DB::delete($deletePostQuery, [
                'post_id' => $postId,
                'user_id' => $userId
            ]);

            $deleteImgQuery = <<<EOT
                DELETE FROM
                    images
                WHERE
                    id = :id
EOT;

            DB::delete($deleteImgQuery, [
                'id' => $imgId
            ]);

            DB::statement('SET foreign_key_checks = 1');

            return Response::make()->json(true);
        } catch (\Exception $e) {
            print_r($e);
            return Response::internalError();
        }
    }

    public static function modifyNotificationsPreferences (Request $request, string $state) {
        try {
            $userId = $request->session('id');

            $query = <<<EOT
                UPDATE
                    users
                SET
                    wants_notifications = :enable
                WHERE
                    id = :user_id
EOT;

            DB::connect();

            DB::update($query, [
                'enable' => $state === 'enable',
                'user_id' => $userId
            ]);

            return Response::make()->json(true);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

}
