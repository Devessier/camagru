<?php

use Iceman\Filter;
use Iceman\Response;

class FiltersController {

    public static function all () {
        if (!Filter::load()) {
            return Response::make()->internalError();
        }

        return Response::make()->json(Filter::$filters);
    }

}
