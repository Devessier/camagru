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

	function save (property) {
		return () => {
			const body = {}
			const value = data[property].value

			body[property] = value

			fetch('http://localhost:8001/me/modify', {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(res => res.json())
				.then((response) => {
					if (response.success) {
						GLOBAL_STATE.user[property] = value
					} else {
						data[property].value = GLOBAL_STATE.user[property]
					}
					$toast(
						data,
						'Édition du profil',
						response.success ?
							'Votre profil a été modifié avec succès'
							: "Une erreur s'est produite, veuillez réessayer ultérieurement"
					)
				})
				.catch(() => {
					$toast(data, 'Édition du profil', 'Une erreur a eu lieu pendant la mise à jour des données')
				})
		}
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

	function saveButton (props, saveHandler, abortHandler) {
		const render = Maverick.link()

		const reset = () => props.modifying = false
		const onAbort = () => {
			reset()
			return abortHandler()
		}
		const onSave = () => {
			reset()
			return saveHandler()
		}

		return render`
			<button
					class="px-4 py-2 mr-2 border rounded border-green-lighter text-green hover:border-green-light hover:text-green-dark short-transition"
					onclick="${ onSave }"
			>
				Sauvegarder
			</button>
			<button
					class="px-4 py-2 border rounded border-grey-lighter text-grey hover:border-grey-light hover:text-grey-dark short-transition"
					onclick="${ onAbort }"
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

		const onAbort = () => {
			ref.value = GLOBAL_STATE.user[props.property || ''] || ''
		}

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
							disabled="${ !modifying }"

							class="mb-3 pb-1 font-light border-purple-lighter focus:border-purple border-b short-transition account-input"
					/>
				</div>

				<div class="flex justify-end items-start w-1/2">${
					modifying ? saveButton(ref, save(props.property), onAbort) : modifyButton(ref)
				}</div>
			</div>
		`
	}

	function h (render, props) {
		const items = [
			{
				title: "Votre identifiant",
				placeholder: "Identifiant",
				ref: props.username,
				property: 'username'
			},
			{
				title: "Votre adresse mail",
				placeholder: "Adresse mail",
				ref: props.email,
				property: 'email'
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
