<?php

require_once __DIR__ . '/../models/auth.php';
require_once __DIR__ . '/../utils/header.php';

function index () {
	if ($_POST['submit'] === 'Me connecter') {
		switch (sign_in()) {
		case -1:
		case -3:
			$error = "Les données saisies sont incorrectes";
			break;
		case -2:
			$error = "Veuillez réessayer ultérieurement";
			break;
		case 0:
			return redirect('/home');
		}
	}
	require __DIR__ . '/../views/sign-in.php';
}
