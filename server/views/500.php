<?php

require_once __DIR__ . '/../layout/head.php';
require_once __DIR__ . '/../utils/header.php';

http_response_code(500);
content_type('500.html');

?>
<!DOCTYPE html>
<html>
	<?php html_head('Oh god...') ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<h1>Une erreur interne au serveur s'est produite, veuillez réessayer ultérieurement</h1>
	</body>
</html>
