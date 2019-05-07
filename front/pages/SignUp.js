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
                value: '',
                password: true
			}
        ],
        onclick: () => console.log(data.inputs.map(({ value }) => value)),
        signup: true
	}

	function render (h, props) {
		return SignOnComponent(h, props)
	}

	return new Page('Camagru - Inscription', data, render)

})()
