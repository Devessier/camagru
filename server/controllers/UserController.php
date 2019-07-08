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

            [ $user ] = DB::select('SELECT username, email, created_at, type, verified FROM users WHERE id = :id', [
                'id' => $id
            ]);

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
