const SignUp = (() => {

	const data = {
		inputs: [
			{
				placeholder: "Nom d'utilisateur",
				value: ''
			},
			{
				placeholder: 'Email',
				value: ''
			},
			{
				placeholder: 'Mot de passe',
				value: ''
			}
		]
	}

	function inputComponent (h, props) {
		return h`
			<input
					placeholder="${ props.placeholder }"
					value="${ props.value }"
					oninput="${ event => { props.value = event.target.value } }"
					class="my-2 py-1 bg-transparent border-b-2 border-grey-light hover:border-purple-lighter focus:border-purple short-transition w-64"
			/>
		`
	}

	function render (h, props) {
		return h`
			<div class="flex justify-center items-center">
				<section class="flex flex-col justify-space-between items-center px-20 py-8 mt-8 bg-grey-lighter">
					<header class="mb-3">
						<h2 class="text-purple-light">Camagru</h2>
					</header>
					<article class="flex flex-col items-center">${
						props.inputs.map(input => inputComponent(
							Maverick.link(input),
							input,
						))
					}</article>
					<footer class="flex justify-around items-center w-full mt-4">
						<a
								href="/sign-in"
								onclick="${ router.click('/sign-in') }"
								class="text-black"
						>Connexion</a>
						<button onclick="${ () => console.log(props.inputs.map(({ value }) => value)) }">M'inscrire</button>
					</footer>
				</section>
			</div>
		`
	}

	return new Page('Camagru - Inscription', data, render)

})()
