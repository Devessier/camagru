<?php

use Iceman\Response;

class HomeController {

	public static function welcome () {
		return Response::make()
			->json([
				'msg' => 'Welcome to Camagru REST API'
			]);
	}

}
