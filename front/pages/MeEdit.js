const MeEdit = (() => {

	let data = {
		username: '',
		email: '',
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
		props.password = GLOBAL_STATE.user.password
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
		return h`
			<div class="flex justify-center items-center md:mx-10 mt-10">
				<div class="flex flex-col w-full md:w-3/5">
					<div class="flex justify-between flex-wrap">
						<div class="flex flex-col justify-around">
							<div class="flex flex-col">
								<input
										value="${ props.username }"
										oninput="${ event => { props.username = event.target.value } }"

										class="mb-3 text-2xl font-bold border-purple-lighter focus:border-purple border-b-2 short-transition"
								/>
								<input
										value="${ props.email }"
										oninput="${ event => { props.email = event.target.value } }"

										class="font-normal text-lg border-purple-lighter focus:border-purple border-b-2 short-transition"
								/>
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
