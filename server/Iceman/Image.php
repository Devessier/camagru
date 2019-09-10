<?php

namespace Iceman;

class Image {

    protected $content;
    protected $width;
    protected $height;

    protected function __construct ($content, $set_size = true) {
        $this->content = $content;

        if ($set_size) {
            [ $this->width, $this->height ] = [ @imagesx($content), @imagesy($content) ];
        }
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

    private static function saver (string $extension) {
        switch ($extension) {
            case 'png':
                return 'imagepng';
            case 'jpeg':
            case 'jpg':
                return 'imagejpeg';
            default:
                return null;
        }
    }

    public function saveTo ($dir = 'images', $extension = 'txt') {
        $id = uuid();
        $path = $dir . '/' . $id . '.' . $extension;
        $externalPath = 'public/' . $path;
        $serverPath = __DIR__ . '/../public/' . $path;

        if (file_exists($serverPath)) {
            return $this->saveTo($dir, $extension);
        }

        $fn = self::saver($extension);

        if ($fn === null)
            return false;

        $fn($this->content, $serverPath);

        return $externalPath;
    }

    public static function fromBase64 ($base64) {
        $data = explode(',', $base64);

        $payload = count($data) === 1 ? $data[0] : $data[1];

        if (!($decoded = @base64_decode($payload))) return false;

        if (!($img = @imagecreatefromstring($decoded))) return false;

        if (!($img = @imagescale($img, 640))) return false;

        imagealphablending($img, true);
        imagesavealpha($img, true);

        return new self($img);
    }


}
