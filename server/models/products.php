<?php

require_once 'db.php';

function get_products() {
	if (empty($db_connection = db_connect()))
		return FALSE;

	if (!($result = mysqli_query($db_connection, 'SELECT * FROM products')))
		return FALSE;

	$products = mysqli_fetch_all($result, MYSQLI_ASSOC);

	mysqli_close($db_connection);
	return $products;
}

function get_product_by_id ($id) {
	if (empty($db_connection = db_connect()))
		return FALSE;

	if (!($stmt = mysqli_prepare($db_connection, 'SELECT * FROM products WHERE id=?')))
		return FALSE;

	mysqli_stmt_bind_param($stmt, 'i', $id);
	mysqli_stmt_execute($stmt);

	if (!mysqli_stmt_bind_result($stmt, $id, $name, $price, $quantity, $image) || !mysqli_stmt_fetch($stmt))
		return FALSE;

	mysqli_stmt_close($stmt);

	return [
		'id' => $id,
		'name' => $name,
		'price' => $price,
		'quantity' => $quantity,
		'image' => $image
	];
}
