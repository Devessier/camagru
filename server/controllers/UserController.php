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

            $users = DB::select('SELECT username, email, created_at, type, verified FROM users WHERE id = :id', [
                'id' => $id
            ]);

            if (is_array($users) && isset($users[0])) {
                [ $user ] = $users;
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

}
