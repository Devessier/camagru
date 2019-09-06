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

            self::sendMail(
                $email,
                'Camagru - Inscription',
                $text
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

    public static function sendMail (string $email, string $title, string $text) {
        return mail(
            $email,
            utf8_decode($title),
            wordwrap(utf8_decode($text), 70, "\r\n"),
                [
                    'From' => 'no-reply@camagru.fr'
                ]
        );
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

            $result = self::sendMail(
                $email,
                'Camagru - Réinitialisation du mot de passe',
                $text
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

            return self::sendMail(
                $email,
                'Camagru - Demande de réinitialisation du mot de passe',
                $text
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

    public static function postHasBeenLiked (string $username, string $email, string $postText) {
        try {
            $text = <<<EOT
Bonjour $username,\n\r
Votre post "$postText" vient d'être liké !\n\r
A bientôt sur Camagru !\n\r
EOT;

            return self::sendMail(
                $email,
                'Camagru - Un de vos posts a été liké',
                $text
            );
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function postHasBeenCommented (string $username, string $email, string $postText, string $commentAuthor, string $comment) {
        try {
            $text = <<<EOT
Bonjour $username,\n\r
Votre post "$postText" vient de recevoir un nouveau commentaire par $commentAuthor :\n\r
$comment\n\r
A bientôt sur Camagru !\n\r
EOT;

            return self::sendMail(
                $email,
                'Camagru - Un de vos posts a été commenté',
                $text
            );
        } catch (\Exception $e) {
            return false;
        }
    }

}
