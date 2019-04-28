<?php

namespace Iceman;

class Response {

    private $status = 200;
    private $content = '';
    private $setStatus = false;
    private $sent = false;

    private function __construct ($content, $status) {
        $this->content = $content;
        $this->status = (int)$status;
        $this->header('Status', $status);
    }

    public function header ($header, $value) {
        header("$header: $value");
        return $this;
    }

    public function status (int $status) {
        header("Status: $status");
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
            echo $this->content;
            $this->sent = true;
        }
    }

    public static function make ($content = '', $status = 200) {
        return new self($content, $status);
    }

}
