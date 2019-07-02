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

            $users = DB::select('SELECT username, email, created_at, type FROM users WHERE id = :id', [
                'id' => $id
            ]);

            return Response::make()->json([
                'user' => count($users) === 0 ? null : $users[0]
            ]);
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function posts (Request $request, $id) {
        try {
            if (!$id)
                $id = $request->session('id');
            if (!$id)
                return Response::unauthorized();

            DB::connect();

            $posts = DB::select('SELECT posts.id, posts.text AS comment, posts.created_at AS createdAt, images.path AS url, users.id AS author_id, users.username AS author_username FROM posts INNER JOIN images ON posts.img_id = images.id INNER JOIN users ON users.id = posts.user_id ORDER BY posts.created_at DESC');

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

            /*return Response::make()
                    ->json([
                        'posts' => [
                            [
                                'id' => 76,
                                'url' => 'https://cdn.pixabay.com/photo/2017/10/22/13/17/malham-2877845_640.jpg',
                                'user' => [
                                    'id' => 0,
                                    'name' => 'Baptiste',
                                    'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                                ],
                                'comment' => 'Magnifique photo de vacances',
                                'comments' => [],
                                'createdAt' => time()
                            ],
                            [
                                'id' => 76,
                                'url' => 'https://cdn.pixabay.com/photo/2018/04/03/07/49/house-3286172_640.jpg',
                                'user' => [
                                    'id' => 0,
                                    'name' => 'Baptiste',
                                    'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                                ],
                                'comment' => 'Magnifique photo de vacances',
                                'comments' => [],
                                'createdAt' => time()
                            ],
                            [
                                'id' => 76,
                                'url' => 'https://cdn.pixabay.com/photo/2017/10/22/13/17/malham-2877845_640.jpg',
                                'user' => [
                                    'id' => 0,
                                    'name' => 'Baptiste',
                                    'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                                ],
                                'comment' => 'Magnifique photo de vacances',
                                'comments' => [],
                                'createdAt' => time()
                            ],
                            [
                                'id' => 76,
                                'url' => 'https://cdn.pixabay.com/photo/2017/10/22/13/17/malham-2877845_640.jpg',
                                'user' => [
                                    'id' => 0,
                                    'name' => 'Baptiste',
                                    'avatar' => 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
                                ],
                                'comment' => 'Magnifique photo de vacances',
                                'comments' => [],
                                'createdAt' => time()
                            ]
                        ]
                    ]);*/
        } catch (\Exception $e) {
            return Response::internalError();
        }
    }

    public static function modify (Request $request) {
        try {
            $id = $request->session('id');
            if ($id === null)
                return Response::unauthorized();

            $body = $request->body();

            $username = $body->username ?? null;
            $password = $body->password ?? null;
            $email = $body->email ?? null;
            $avatar = $body->avatar ?? null;

            DB::connect();

            if (is_string($username)) {
                DB::update('UPDATE users SET username = :username WHERE id = :id', [
                    'username' => $username,
                    'id' => $id
                ]);
            }

            if (is_string($password)) {
                DB::update('UPDATE users SET password = :password WHERE id = :id', [
                    'password' => password_hash($password, PASSWORD_BCRYPT),
                    'id' => $id
                ]);
            }

            if (is_string($email) && validEmail($email)) {
                DB::update('UPDATE users SET email = :email WHERE id = :id', [
                    'email' => $email,
                    'id' => $id
                ]);
            }

            return Response::make()
                    ->json([
                        'success' => true
                    ]);
        } catch (\Exception $e) {
            echo "e : $e\n";
            return Response::internalError();
        }
    }

}
