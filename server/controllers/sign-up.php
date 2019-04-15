<?php

require_once __DIR__ . '/../models/auth.php';
require_once __DIR__ . '/../utils/header.php';

function index () {
	if ($_POST['submit'] === "M'inscrire") {
		switch (sign_up()) {
		case -1:
			$error = "Les informations entrées sont incorrectes";
			break;
		case -2:
			$error = "Une erreur s'est produite, veuillez réessayer ultérieurement";
			break;
		case 0:
			return redirect('/home');
		}
	}
	require __DIR__ . '/../views/sign-up.php';
}
