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

    public static function sendResetPasswordEmail ($email, $userID) {
        try {
            DB::connect();

            $token = uuid();

            $link = "http://localhost:8001/password-reset/confirm/$token";

            $text = <<<EOF
Bonjour,\n\r
Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :\n\r
$link\n\r
EOF;

            $result = mail(
                $email,
                utf8_decode('Camagru - Réinitialisation du mot de passe'),
                wordwrap($text, 70, "\r\n"),
                [
                    'From' => 'no-reply@camagru.fr'
                ]
            );

            if (!$result)
                return false;

            DB::insert("INSERT INTO tokens(token, user_id, type) VALUES(:token, :user_id, 'RESET')", [
                'token' => $token,
                'user_id' => $userID
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function sendResetPasswordEmailAnonymous ($email) {
        try {
            $text = <<<EOF
Bonjour,\n\r
Camagru a reçu une demande de réinitilisation de mot de passe concernant votre adresse mail.\n\r
Si vous n'avez pas effectué cette demande, ignorez ce mail.\n\r
\n\r
A bientôt sur Camagru !\n\r
EOF;

            return mail(
                $email,
                utf8_decode('Camagru - Demande de réinitialisation du mot de passe'),
                $text,
                [
                    'From' => 'no-reply@camagru.fr'
                ]
            );
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function passwordResetConfirm (Request $request, $token) {
        try {
            DB::connect();

            $tokens = DB::select("SELECT id FROM tokens WHERE token = :token AND type = 'RESET'", [
                'token' => $token
            ]);

            if (!(is_array($tokens) && count($tokens) === 1)) {
                throw new \Exception('invalid token');
            }

            return Response::make()
                    ->redirect("http://localhost:8000/password-reset?token=$token");
        } catch (\Exception $e) {
            return Response::make()
                    ->redirect("http://localhost:8000/401");
        }
    }

}
