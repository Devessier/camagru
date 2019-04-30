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

}
