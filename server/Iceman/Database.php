<?php

namespace Iceman\DB;

require_once __DIR__ . '/../../config/setup.php';

class Database {

	public $error = false;

	private $pdo;

	public function __construct () {
		try {
			$this->pdo = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch (PDOException $e) {
			$this->error = true;
		}
	}

}
