<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

class UserController {

	public static function me (Request $request) {
        $id = $request->session('id');
        if ($id === null)
            return Response::unauthorized();
        return self::user($request, $id);
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

            return Response::make()
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
                    ]);
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
