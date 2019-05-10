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
				password: true,
				visible: false
			}
        ],
        onclick: () => {
			const username = data.inputs[0].value
			const email = data.inputs[1].value
			const password = data.inputs[2].value

			data.inputs[0].value = ''
			data.inputs[1].value = ''
			data.inputs[2].value = ''
			data.loading = true

			fetch('http://localhost:8001/sign-up', {
				method: 'POST',
				body: JSON.stringify({
					username: username,
					email: email,
					password: password
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
				.then(res => res.json())
				.then((res) => {
					if (res.error) {
						data.error = res.message
					} else {
						data.error = false
						data.message = res.message
						GLOBAL_STATE.user = res.user
						router.replace('/me')
					}
				})
				.catch((err) => {
					data.error = err
				})
				.finally(() => {
					data.loading = false
				})
		},
		signup: true,
		loading: false
	}

	function render (h, props) {
		return SignOnComponent(h, props)
	}

	return new Page('Camagru - Inscription', data, render)

})()
