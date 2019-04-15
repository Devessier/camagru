<?php

require_once 'db.php';

/**
 * sign_up function signs up a user
 * The user must provide a login, an email and a password. He has to repeat its password in order to be sure he didn't mistyped it.
 * 
 * @return int
 * -1 => bad input
 * -2 => db error
 * 0 => OK
 */

function sign_up () {

	list($username, $email, $password, $password_confirmation) = array_map('map_post_var', [ 'username', 'email', 'password', 'password_confirmation' ]);
	
	if (empty($username) || empty($email) || empty($password) || ($password !== $password_confirmation))
		return -1;

	if (empty($db_connection = db_connect()))
		return -2;
	
	if (!($stmt = mysqli_prepare($db_connection, 'INSERT INTO users(username, email, password, user_group) VALUES (?, ?, ?, \'user\')')))
		return -2;

	mysqli_stmt_bind_param($stmt, 'sss', $username, $email, password_hash($password, PASSWORD_BCRYPT));
	mysqli_stmt_execute($stmt);
	mysqli_stmt_close($stmt);

	create_sign_in_cookies($username, $email);

	return 0;
}

/**
 * sign_in function signs in a user
 * The user must provide its username and its password
 * 
 * @return int
 * -1 => bad input
 * -2 => DB error
 * -3 => Password isn't correct
 * 0 => OK
 */

function sign_in () {
	list($username, $password) = array_map('map_post_var', [ 'username', 'password' ]);

	if (empty($username) || empty($password))
		return -1;

	if (empty($db_connection = db_connect()))
		return -2;

	if (!($stmt = mysqli_prepare($db_connection, 'SELECT email, password, user_group FROM users WHERE username=?')))
		return -2;

	mysqli_stmt_bind_param($stmt, 's', $username);
	mysqli_stmt_execute($stmt);

	if (!mysqli_stmt_bind_result($stmt, $email, $password_hashed, $user_group) || !mysqli_stmt_fetch($stmt) || empty($email) || empty($user_group))
		return -1;

	mysqli_stmt_close($stmt);

	if (password_verify($password, $password_hashed)) {
		create_sign_in_cookies($username, $email, $user_group);
		return 0;
	}
	return -3;
}

function create_sign_in_cookies ($username, $email, $group = 'user') {
	$_SESSION['username'] = $username;
	$_SESSION['email'] = $email;
	$_SESSION['group'] = $group;
}

function map_post_var ($item) {
	return $_POST[$item];
}
