#!/usr/bin/env php
<?php

require './database.php';

try {
	$db = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if (($setup = @file_get_contents('./schema.sql')) !== false) {
		$db->exec($setup);
	}

} catch (PDOException $e) {
	die();
}
