<?php

namespace Iceman;

class App {

	private $appName = '';
	private $db;

	public function __construct ($name) {
		$this->appName = $name;
		$this->db = new \DB\Database;
	}

}
