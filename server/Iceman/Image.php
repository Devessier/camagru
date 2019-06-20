<?php

namespace Iceman;

class Image {

    private $content;

    private function __construct ($content) {
        $this->content = $content;
    }

    public static function fromBase64 ($base64) {
        $data = explode(',', $base64);

        $payload = count($data) === 1 ? $data[0] : $data[1];

        if (!($decoded = base64_decode($payload))) {
            return false;
        }

        if (!($img = imagecreatefromstring($decoded))) {
            return false;
        }

        return new self($img);
    }

}
