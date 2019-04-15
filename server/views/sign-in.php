<?php

require_once __DIR__ . '/../layout/head.php';

?>
<!DOCTYPE html>
<html>
	<?php html_head('Minishop - Connexion', [ '/sign-on.css' ]) ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<main class="form-sign-on">
			<div>
				<h1>Connexion</h1>

				<form method="POST" action="/sign-in">
					<?php
					if (!empty($error)) {
						?>
						<div class="error"><?= $error ?></div>
						<?php
					}
					?>
					<input name="username" type="text" placeholder="Votre identifiant"/>
					<input name="password" type="password" placeholder="Mot de passe"/>

					<input name="submit" type="submit" value="Me connecter"/>
				</form>
			</div>
		</main>
		<script>
		</script>
	</body>
</html>
