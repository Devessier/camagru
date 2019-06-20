<?php

namespace Iceman;

class Image {

    protected $content;
    protected $width;
    protected $height;

    protected function __construct ($content) {
        $this->content = $content;
        [ $this->width, $this->height ] = [ imagesx($content), imagesy($content) ];
    }

    public function content () {
        return $this->content;
    }

    public function width () {
        return $this->width;
    }

    public function height () {
        return $this->height;
    }

    public static function fromBase64 ($base64) {
        $data = explode(',', $base64);

        $payload = count($data) === 1 ? $data[0] : $data[1];

        if (!($decoded = base64_decode($payload))) {
            return false;
        }

        if (!($img = @imagecreatefromstring($decoded))) {
            return false;
        }

        return new self($img);
    }

}
