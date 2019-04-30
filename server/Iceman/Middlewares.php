<?php

namespace Iceman;

class Middlewares {

    private const ACCEPTED_MIDDLEWARES = [ 'json' ];
    
    public static function resolve (array $middlewares) {
        $data = [];

        foreach ($middlewares as &$middleware) {
            if (is_callable($middleware)) {
                $result = $middleware();

                if ($result === false) {
                    break;
                } else {
                    if (is_array($result)) {
                        $data = array_merge($data, $result);
                    } else if ($result) {
                        array_push($data, $result);
                    }
                }
            }
        }

        return $data;
    }

    private static function json () {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            if (($content = @file_get_contents('php://input')) && ($json = @json_decode($content))) {
                return [
                    'body' => $json
                ];
            }
        }
    }

    public static function bind ($method, ...$args) {
        if (in_array($method, self::ACCEPTED_MIDDLEWARES)) {
            return function () use ($method, $args) {
                return self::$method(...$args);
            };
        }
    }

}