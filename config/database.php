#!/usr/bin/env php
<?php

require './setup.php';

try {
	$db = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
	$db->setAttribute(PDO::ERRMODE_EXCEPTION);

	if (($setup = @file_get_contents('./schema.sql')) !== false) {
		$db->exec($setup);

		// fake data

		if (($fake = @file_get_contents('./fake.sql')) !== false) {
			$db->exec($fake);
		}

	}
} catch (PDOException $e) {
	die();
}
