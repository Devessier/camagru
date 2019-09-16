<?php

namespace Iceman;

require_once __DIR__ . '/Image.php';

class Filter extends Image {

    private const FILTER_DIR = __DIR__ . '/../public/filters';

    public $name = '';
    public $extra = [];

    public static $filters = [];

    private function __construct ($content, string $name, array $extra) {
        parent::__construct($content);
        $this->name = $name;
        $this->extra = $extra;
    }

    public static function load () {
        if (count(self::$filters) !== 0) return true;

        try {
            DB::connect();

            $filters = DB::select('SELECT * FROM filters');

            foreach ($filters as $filter) {
                $filter['path'] = '/public/filters/' . $filter['path'];
                self::$filters []= $filter;
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function fromName (string $name, array $extra) {
        try {
            DB::connect();

            [ [ 'path' => $path ] ] = DB::select('SELECT path FROM filters WHERE name = ?', [
                $name
            ]);

            if (empty($path))
                return false;

            $img = imagecreatefrompng(self::FILTER_DIR . "/$path");

            return new self($img, $name, $extra);
        } catch (\Exception $e) {
            return false;
        }
    }

    public function superposeTo (Image $img, int $x, int $y, int $width, int $height) {
        return imagecopyresampled($img->content(), $this->content, $x, $y, 0, 0, $width, $height, imagesx($this->content()), imagesy($this->content()));
    }

}
