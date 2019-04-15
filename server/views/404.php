<?php

require_once __DIR__ . '/../layout/head.php';
require_once __DIR__ . '/../utils/header.php';

http_response_code(404);
content_type('404.html');

?>
<!DOCTYPE html>
<html>
	<?php html_head('Ouppss...') ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<h1>La page que vous cherchez n'existe pas !</h1>
	</body>
</html>
