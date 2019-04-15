<?php

require_once __DIR__ . '/../layout/head.php';

?>
<!DOCTYPE html>
<html>
	<?php html_head('Minishop - Inscription', [ '/sign-on.css' ]) ?>
	<body>
		<?php require __DIR__ . '/../layout/header.php' ?>
		<main class="form-sign-on">
			<div>
				<h1>Inscription</h1>

				<form method="POST" action="/sign-up">
					<?php
					if (!empty($error)) {
						?>
						<div class="error"><?= $error ?></div>
						<?php
					}
					?>
					<input name="username" type="text" placeholder="Votre identifiant"/>
					<input name="email" type="email" placeholder="Votre email"/>
					<input name="password" type="password" placeholder="Mot de passe"/>
					<input name="password_confirmation" type="password" placeholder="Confirmation du mot de passe"/>

					<input name="submit" type="submit" value="M'inscrire" />
				</form>
			</div>
		</main>
	</body>
</html>
