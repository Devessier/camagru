<?php

require_once __DIR__ . '/MailController.php';
require_once __DIR__ . '/../utils.php';

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

class AuthController {

	public static function login (Request $request) {
		try {
			$body = $request->body();

			if (!isset($body))
				return Response::unauthorized();

			$username = $body->username;
			$password = $body->password;

			if (!($username && $password))
				return Response::unauthorized();

			DB::connect();

			[ $user ] = DB::select('SELECT * FROM users WHERE username = ?', [ $username ]);
			
			if (!isset($user))
				return Response::unauthorized();

			$user = (object)$user;

			if (!(isset($user) && password_verify($password, $user->password) && $user->verified))
                return Response::unauthorized();

			return Response::make()
					->session('id', $user->id)
					->json([
						'message' => 'Successfully signed-in',
						'user' => [
							'id' => $user->id,
							'username' => $user->username,
							'email' => $user->email,
							'type' => $user->type,
							'createdAt' => $user->created_at
						]
					]);
		} catch (\Exception $e) {
			return Response::internalError();
		}
	}

	public static function signup (Request $request) {
		try {
			$body = $request->body();

			if (!isset($body))
				return Response::unauthorized();

			$username = $body->username;
			$password = $body->password;
			$email = $body->email;

			if (!($username && $password && $email))
				return Response::unauthorized();

			if (!validEmail($email)) {
				return Response::make()
						->status(400)
						->json([
							'error' => true,
							'message' => 'The provided email is not correct'
						]);
			}

			DB::connect();

			try {
				$userID = DB::insert("INSERT INTO users(username, password, email) VALUES(:username, :password, :email)", [
					'username' => $username,
					'password' => password_hash($password, PASSWORD_BCRYPT),
					'email' => $email
				]);

				$token = uuid();

				DB::insert("INSERT INTO tokens(token, user_id, type) VALUES(:token, :user_id, 'SIGN-UP')", [
					'token' => $token,
					'user_id' => $userID
				]);

				MailController::sendSignUpEmail($email, $username, $token);

				return Response::make()
						->json([
							'error' => false,
							'message' => "Un email de confirmation vous a été envoyé à l'adresse '$email'."
						]);
			} catch (\PDOException $e) {
				if ($e->getCode() === '23000') {
					return Response::make()
							->status(403)
							->json([
								'error' => true,
								'message' => "Nom d'utilisateur et/ou mot de passe incorrect(s)."
							]);
				}
				return Response::internalError();
			}
		} catch (\Exception $e) {
			return Response::internalError();
		}
	}

	public static function logout () {
		return Response::make()->session('id', null);
	}

	public static function passwordReset (Request $request) {
		try {
			$body = $request->body();

			if (!isset($body))
				return Response::badRequest();

			$email = $body->email;

			DB::connect();

			try {
				$result = DB::select('SELECT id FROM users WHERE email = ?', [
					$email
				]);

				if (isset($result) && isset($result[0])) {
					[ [ 'id' => $userID ] ] = $result;
				} else {
					throw new \Exception('Fck');
				}
			} catch (\Exception $e) {
				MailController::sendResetPasswordEmailAnonymous($email);

				return Response::make()
						->json([
							'done' => true
						]);
			}

			if (!MailController::sendResetPasswordEmail($email, $userID)) {
				return Response::internalError();
			}

			return Response::make()
					->json([
						'done' => true
					]);
		} catch (\Exception $e) {
			return Response::internalError();
		}
	}

	public static function modifyPassword (Request $request) {
		try {
			$body = $request->body();

			$token = $body->token;
			$password = $body->password;

			DB::connect();

			$result = DB::select('SELECT users.id FROM tokens INNER JOIN users ON tokens.user_id = users.id WHERE tokens.token = :token', [
				'token' => $token
			]);

			if (empty($result) || empty($result[0])) {
				return Response::badRequest();
			}

			[ [ 'id' => $userID ] ] = $result;

			if (empty($userID)) {
				return Response::badRequest();
			}

			DB::update('UPDATE users SET password = :password WHERE id = :id', [
				'password' => password_hash($password, PASSWORD_BCRYPT),
				'id' => $userID
			]);

			return Response::make()
					->json([
						'done' => true
					]);
		} catch (\Exception $e) {
			return Response::internalError();
		}
	}

}
