<?php

namespace Iceman;

class Middlewares {

    public const FILES_ILLIMITED = 1 << 3;
    private const ACCEPTED_MIDDLEWARES = [ 'json' ];
    
    public static function resolve (array $middlewares) {
        $data = [];

        foreach ($middlewares as $middleware) {
            if (is_callable($middleware)) {
                $stop = false;

                $middleware(function ($result) use ($stop, $data) {
                    if ($result === false) {
                        $stop = true;
                    } else {
                        if (is_array($result)) {
                            $data = array_merge($data, $result);
                        } else if ($result) {
                            array_push($data, $result);
                        }
                    }
                });

                if ($stop)
                    break;
            }
        }

        return $data;
    }

    private static function json () {
        return function ($next) {
                if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
                return next([
                    'body' => @json_decode(@file_get_contents('php://input'))
                ]);
            }
            next();
        };
    }

    public static function bind ($method, ...$args) {
        if (in_array($method, self::ACCEPTED_MIDDLEWARES)) {
            return function () use ($method, $args) {
                self::$method(...$args);
            };
        }
    }

}