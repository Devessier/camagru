const MeEdit = (() => {

	let data = {
		username: {
			value: '',
			modifying: false
		},
		email: {
			value: '',
			modifying: false
		},
		password: {
			value: '',
			modifying: false
		},
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

	function modifyButton (props) {
		const render = Maverick.link()

		return render`
			<button
					class="px-4 py-2 border rounded border-purple-lighter text-purple hover:border-purple-light hover:text-purple-dark short-transition"
					onclick="${ () => { props.modifying = true } }"
			>
				Modifier
			</button>
		`
	}

	function saveButton (props, handler) {
		const render = Maverick.link()

		const reset = () => props.modifying = false
		const onSave = () => {
			reset()
			return handler()
		}

		return render`
			<button
					class="px-4 py-2 border rounded border-green-lighter text-green hover:border-green-light hover:text-green-dark short-transition"
					onclick="${ onSave }"
			>
				Sauvegarder
			</button>
			<button
					class="px-4 py-2 border rounded border-grey-lighter text-grey hover:border-grey-light hover:text-grey-dark short-transition"
					onclick="${ reset }"
			>
				Annuler
			</button>
		`
	}

	function profileProperty (props, index, items) {
		const title = props.title || ''
		const placeholder = props.placeholder || ''
		const ref = props.ref

		const render = Maverick.link(ref)

		const isLast = index === items.length - 1
		const modifying = ref.modifying

		return render`
			<div class="${ (!isLast ? 'pb-2 mb-4 border-b border-grey-light ' : '') +  'flex' }">
				<div class="flex flex-col w-1/2">
					<h3 class="mb-3 w-full font-medium">${
						title
					}</h3>

					<input
							value="${ ref.value }"
							oninput="${ event => { ref.value = event.target.value } }"
							placeholder="${ placeholder }"

							class="mb-3 font-light border-purple-lighter focus:border-purple border-b short-transition"
					/>
				</div>

				<div class="flex justify-end items-start w-1/2">${
					modifying ? saveButton(ref, () => {}) : modifyButton(ref)
				}</div>
			</div>
		`
	}

	function h (render, props) {
		const eye = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
		const eye_off = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'

		const items = [
			{
				title: "Votre identifiant",
				placeholder: "Identifiant",
				ref: props.username
			},
			{
				title: "Votre adresse mail",
				placeholder: "Adresse mail",
				ref: props.email
			}
		]

		return render`
			<div class="flex justify-center items-center md:mx-10 mt-10">
				<div class="flex flex-col w-full md:w-3/5">
					<h2 class="pb-3 mb-5 border-b border-grey-light">
						Modification du profil
					</h2>
					<div class="flex flex-col items-stretch">${
						items.map(profileProperty)
					}</div>
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

	return new Page('Camagru - Édition du profil', data, h, {
		created: function created () {
			data.username.value = GLOBAL_STATE.user.username
			data.email.value = GLOBAL_STATE.user.email
		}
	})

})()
