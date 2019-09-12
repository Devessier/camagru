#!/usr/bin/env php
<?php

require './database.php';

try {
	$db = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if (($fake = @file_get_contents('./fake.sql')) !== false) {
		$db->exec($fake);
	}

} catch (PDOException $e) {
	die();
}
