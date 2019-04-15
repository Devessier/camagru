<?php

require_once __DIR__ . '/../layout/head.php';

// can access $product containing the selected product in this file

?>
<!DOCTYPE html>
<html>
	<?php html_head("Minishop - Produit " . $product['id']) ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<main>
			<?php print_r($product) ?>
		</main>
	</body>
</html>
