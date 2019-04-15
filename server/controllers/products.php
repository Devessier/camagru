<?php

require_once __DIR__ . '/../models/products.php';
require_once __DIR__ . '/../utils/header.php';

function id ($matches) {
	if (($product = get_product_by_id($matches[2])) === FALSE)
		return redirect('/500');
	require __DIR__ . '/../views/product.php';
}
