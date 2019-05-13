const MeEdit = (() => {

	let data = {
		username: '',
		email: '',
		password: '',
		visible: false,
		toast: {
			title: '',
			text: '',
			open: undefined,
			hide: true
		}
	}

	function reset (props) {
		props.username = GLOBAL_STATE.user.username
		props.email = GLOBAL_STATE.user.email
		props.password = ''
	}

	function save (props) {
		fetch('http://localhost:8001/me/modify', {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify({
				username: props.username,
				password: props.password,
				email: props.email,
				avatar: props.avatar
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then((data) => {
				if (data.success) {
					GLOBAL_STATE.user.username = props.username
					GLOBAL_STATE.user.email = props.email
				}
				$toast(
					props,
					'Édition du profil', 
					data.success ?
						'Votre profil a été modifié avec succès'
						: "Une erreur s'est produite, veuillez réessayer ultérieurement"
				)
			})
			.catch(() => {
				$toast(props, 'Édition du profil', 'Une erreur a eu lieu pendant la mise à jour des données')
			})
	}

	function render (h, props) {
		const eye = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
		const eye_off = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'

		return h`
			<div class="flex justify-center items-center md:mx-10 mt-10">
				<div class="flex flex-col w-full md:w-3/5">
					<div class="flex justify-between flex-wrap">
						<div class="flex flex-col justify-around">
							<div class="flex flex-col">
								<input
										value="${ props.username }"
										oninput="${ event => { props.username = event.target.value } }"
										placeholder="Nom d'utilisateur"

										class="mb-3 text-2xl font-bold border-purple-lighter focus:border-purple border-b-2 short-transition"
								/>
								<input
										value="${ props.email }"
										oninput="${ event => { props.email = event.target.value } }"
										placeholder="Adresse mail"

										class="mb-2 font-normal text-lg border-purple-lighter focus:border-purple border-b-2 short-transition"
								/>
								<div class="flex w-64">
									<input
											value="${ props.password }"
											oninput="${ event => { props.password = event.target.value } }"

											placeholder="Nouveau mot de passe"
											type="${ !props.visible ? 'password' : 'text' }"

											class="font-normal text-lg border-purple-lighter focus:border-purple border-b-2 short-transition"
									/>
									<div
											onclick="${ () => { props.visible ^= 1 } }"
											class="flex justify-center items-center"
									>${ props.visible ? eye_off : eye }</div>
								</div>
							</div>
						</div>
						<div>
							<img src="${ GLOBAL_STATE.avatar }" class="w-32 h-32 rounded-full" />
						</div>
					</div>
					<div class="flex justify-center md:justify-start items-center">
						<button
								onclick="${ () => { reset(props) } }"
								class="text-grey-darker border-grey-light hover:border-grey border-2 rounded px-3 py-2 mr-4 short-transition">
							Annuler
						</button>
						<button
								onclick="${ () => { save(props) } }"
								class="text-purple-dark border-purple-light hover:border-purple border-2 rounded px-3 py-2 short-transition">
							Sauvegarder
						</button>
					</div>
				</div>
			</div>
		`
	}

	return new Page('Camagru - Édition du profil', data, render, {
		created: function created () {
			data.username = GLOBAL_STATE.user.username
			data.email = GLOBAL_STATE.user.email
		}
	})

})()
