<?php

require_once __DIR__ . '/../layout/head.php';

// can access $products containing an array of the products in this file

?>
<!DOCTYPE html>
<html>
	<?php html_head('Minishop') ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<main>
			<?php print_r($products) ?>
		</main>
	</body>
</html>
