<?php

function html_head($title, $styles = []) {
	if (!in_array('/style.css', $styles))
		$styles[] = '/style.css';
	$style_tags = '';
	foreach ($styles as $style) {
		$style_tags .= "<link rel=\"stylesheet\" type=\"text/css\" href=\"$style\">\n";
	}
	echo <<<EOT
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>$title</title>
$style_tags
</head>
EOT;
}
?>