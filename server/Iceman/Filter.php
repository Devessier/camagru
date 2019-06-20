<?php

namespace Iceman;

require_once __DIR__ . '/Image.php';

class Filter extends Image {

    private const FILTER_DIR = __DIR__ . '/../public/filters';

    public static $filters = [];

    public static function load () {
        if (count(self::$filters) !== 0) {
            return true;
        }

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

}
