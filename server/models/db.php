<?php

function db_connect () {
	$connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWD, DB_NAME, DB_PORT);
	if (mysqli_connect_errno())
		return null;
	return $connection;
}
