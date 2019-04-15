<?php

require_once __DIR__ . '/../layout/head.php';
require_once __DIR__ . '/../utils/header.php';

http_response_code(401);
content_type('401.html');

?>
<!DOCTYPE html>
<html>
	<?php html_head('HALT !') ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<h1>La page que vous cherchez ne vous est pas accessible.</h1>
	</body>
</html>
