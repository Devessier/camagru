<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

class AuthController {

	public static function login (Request $request) {
		$body = $request->body();

		if (!isset($body))
			return Response::unauthorized();

		$username = $body->username;
		$password = $body->password;

		if (!($username && $password))
			return Response::unauthorized();

		try {
			DB::connect();

			$users = DB::select('SELECT * FROM users WHERE username = ?', [ $username ]);
			if (!(count($users) > 0))
				return Response::unauthorized();

			$user = (object) $users[0];

			if (!(isset($user) && password_verify($password, $user->password)))
                return Response::unauthorized();

			return Response::make()
					->session('id', $user->id)
					->json([
						'message' => 'Successfully signed-in'
					]);
		} catch (\Exception $e) {
			return Response::internalError();
		}
	}

	public static function signup (Request $request) {

	}

}
