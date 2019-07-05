<?php

namespace Iceman;

class Response {

    private $status = 200;
    private $content = '';
    private $setStatus = false;
    private $sent = false;

    private function __construct ($content = '', $status = 200) {
        $this->content = $content;
        $this->status = (int)$status;
        $this->status($this->status);
    }

    public function header ($header, $value) {
        header("$header: $value");
        return $this;
    }

    public function redirect ($page) {
        header("Location: $page");
        return $this;
    }

    public function session ($name, $value) {
        $_SESSION[$name] = $value;
        return $this;
    }

    public function status (int $status) {
        http_response_code($status);
        return $this;
    }

    public function cookie ($name, $value, $minutes = 60, $path = '/', $domain = null, $secure = false, $httpOnly = true) {
        if ($name && $value)
            setcookie($name, $value, time() + $minutes * 60, $path, $domain, $secure, $httpOnly);
        return $this;
    }

    public function json ($json) {
        $this->header('Content-Type', 'application/json');
        $this->content = json_encode($json);
        return $this;
    }

    public function send () {
        if (!$this->sent) {
            echo $this->content . PHP_EOL;
            $this->sent = true;
        }
    }

    public static function make ($content = '', $status = 200) {
        return new self($content, $status);
    }

    public static function unauthorized () {
        $response = new self;

        return $response
                ->status(401)
                ->json([
                    'error' => true,
                    'message' => 'The provided credentials are not correct'
                ]);
    }

    public static function internalError () {
        $response = new self;

        return $response
                ->status(500)
                ->json([
                    'error' => true,
                    'message' => 'An internal error occured, please try latter'
                ]);
    }

    public static function badRequest () {
        $response = new self;

        return $response
                ->status(400)
                ->json([
                    'error' => true,
                    'message' => 'Bad Request'
                ]);
    }

}
