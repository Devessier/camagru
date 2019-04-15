<?php

require_once __DIR__ . '/../router/middlewares.php';

// TODO: replace links when authenticated
$isAuthenticated = authenticated();

?>
<header class="shop-header">
	<div class="search-bar">
		<input type="text" placeholder="Rechercher" />
	</div>
	<h1>
		<a href="/" class="shop-header-index">Minishop</a>
	</h1>
	<div class="shop-header-links">
		<a href="/sign-in" title="Connexion">Connexion</a>
		<a href="/sign-up" title="Inscription">Inscription</a>
	</div>
</header>
