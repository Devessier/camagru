<?php

require_once __DIR__ . '/../models/products.php';
require_once __DIR__ . '/../utils/header.php';

function index () {
	if (($products = get_products()) === FALSE)
		return redirect('/500');
	require __DIR__ . '/../views/index.php';
}
