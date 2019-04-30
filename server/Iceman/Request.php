<?php

namespace Iceman;

class Request {

    private $data = [];
    private $httpMethod = '';
    private $uri = '';
    private $cookies = [];
    private $sessions = [];
    private $files = [];

    private function __construct ($data) {
        $this->data = $data;
        $this->httpMethod = $_SERVER['REQUEST_METHOD'];
        $this->uri = $_SERVER['REQUEST_URI'];
        $this->cookies = $_COOKIE;
        $this->sessions = $_SESSION;
        $this->files = $this->parseFiles();
    }

    private function parseFiles () {
        $files = [];

        foreach ($_FILES as $name => $data) {
            $files[$name] = File::create($name, $data);
        }

        return $files;
    }

    public static function create ($data) {
        return new self($data);
    }

    public function path () {
        return $this->uri;
    }

    public function method () {
        return $this->httpMethod;
    }

    public function isMethod ($method) {
        return $this->httpMethod === $method;
    }

    public function body () {
        return isset($this->data['body']) ? $this->data['body'] : null;
    }

    public function cookie ($name) {
        return $this->cookies[$name];
    }

    public function session ($name) {
        return $this->sessions[$name];
    }

    public function file ($name) {
        return $this->files[$name];
    }

    public function hasFile ($name) {
        return isset($this->files[$name]);
    }

}
