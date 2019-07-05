<?php

use Iceman\DB;
use Iceman\Request;
use Iceman\Response;

class MailController {

    public static function sendSignUpEmail ($email, $username, $token) {
        try {
            $link = "http://localhost:8001/email/sign-up/confirmation/$token";

            $text = <<<EOF
Bienvenue sur Camagru, $username !\n\r
Pour confirmer votre inscription, veuillez cliquez sur le lien ci-dessous :\n\r
$link
EOF;

            mail(
                $email,
                'Camagru - Inscription',
                wordwrap($text, 70, "\r\n"),
                [
                    'From' => 'no-reply@camagru.fr'
                ]
            );
        } catch (\Exception $e) {}
    }

    public static function signUpValidate (Request $request, $token) {
        try {
            DB::connect();

            [ [ 'user_id' => $userID ] ] = DB::select('SELECT user_id FROM tokens WHERE token = :token', [
                'token' => $token
            ]);

            if (empty($userID)) {
                throw new Exception('Auth error');
            }

            DB::delete('DELETE FROM tokens WHERE token = :token', [
                'token' => $token
            ]);

            DB::update('UPDATE users SET verified = true WHERE id = :id', [
                'id' => $userID
            ]);

            return Response::make()
                    ->session('id', $userID)
                    ->redirect('http://localhost:8000/me');
        } catch (\Exception $e) {
            echo "error\n";
            return Response::make()
                    ->redirect('http://localhost:8000/401');
        }
    }

}
