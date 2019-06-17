const Home = (() => {

	const data = {
		posts: [
			{
				id: 0,
				url: 'https://cdn.pixabay.com/photo/2017/10/22/13/17/malham-2877845_640.jpg',
				text: 'Hi !',
				user: {
					id: 0,
					name: 'Baptiste',
					avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
				},
				comment: 'Quel paysage magnifique ! Le Yorkshire a tout pour vous faire rêver',
				comments: [],
				liked: true,
				loadComments: false,
				createdAt: +new Date,
				newComment: '',
				focusComment: false,
			},
			{
				id: 1,
				url: 'https://cdn.pixabay.com/photo/2018/04/03/07/49/house-3286172_640.jpg',
				text: 'Hi !',
				user: {
					id: 0,
					name: 'Baptiste',
					avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
				},
				comment: "Dans un village pittoresque, il n'est pas rare de tomber sur des gens formidables. Ici, la maison de Monique, la dernière évangéliste Java de France, rencontrée au marché de Quimper-les-Menhirs",
				comments: [
					{
						user: {
							id: 0,
							name: 'Baptiste',
							avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
						},
						text: "T'es trop beau gosse ! Profite bien gros !",
						createdAt: (+new Date) - 100000000
					},
					{
						user: {
							id: 0,
							name: 'Baptiste',
							avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
						},
						text: 'Sacrée photo !',
						createdAt: (+new Date) - 1000000000
					},
					{
						user: {
							id: 0,
							name: 'Baptiste',
							avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
						},
						text: 'Impressionnant !',
						createdAt: (+new Date) - 1000000000
					}
				],
				liked: false,
				loadComments: false,
				createdAt: +new Date,
				newComment: '',
				focusComment: false,
			},
			{
				id: 2,
				url: 'https://cdn.pixabay.com/photo/2017/10/22/13/17/malham-2877845_640.jpg',
				text: 'Hi !',
				user: {
					id: 0,
					name: 'Baptiste',
					avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
				},
				comment: 'Quel paysage magnifique ! Le Yorkshire a tout pour vous faire rêver',
				/*comments: [
					{
						user: {
							id: 0,
							name: 'Baptiste',
							avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
						},
						text: 'Sacrée photo !',
						createdAt: (+new Date) + 1000
					}
				],*/
				liked: true,
				loadComments: false,
				createdAt: +new Date,
				newComment: '',
				focusComment: false,
			},
		],
		loading: false,
		user: {}
	}

	const format = (() => {
		const f = new Intl.DateTimeFormat('fr-FR', {

		})

		return timestamp => timestamp ? f.format(new Date(timestamp)) : ''
	})()

	function comment (h, props) {
		return h`
			<article class="flex space-around mx-1 mb-4">
				<div class="flex flex-grow flex-wrap">
					<img src="${ props.user.avatar }" width="20px" height="20px" class="rounded-full hover:shadow-md transition mr-1" />
					<p class="font-medium mr-1">${ props.user.name }</p>
					<p class="font-light">${ props.text }</p>
				</div>
				<div>
					<p>${ format(props.createdAt) }</p>
				</div>
			</article>
		`
	}

	function loadCommentsButton (h, props) {
		const hasComments = Array.isArray(props.comments) && props.comments.length > 0

		return hasComments && !props.loadComments ?
			h`
				<button
						class="${ 'text-purple-light py-2 px-2 border-purple-light rounded mb-4' + (hasComments ? ' border' : '') }"
						onclick="${ () => { props.loadComments = true } }"
				>
					${ hasComments ? 'Voir les commentaires' : 'Aucun commentaire' }
				</button>
			` : h``
	}

	function post (h, props, index) {
        const userLink = '/user/' + props.user.id
		const date = format(props.createdAt)
		const id = 'input-home-' + index
		const disabled = !isAuthenticated()

		return h`
			<article class="flex flex-col bg-grey-lighter" style="max-width: 640px">
				<header class="flex justify-between items-center py-2 px-1">
					<div class="flex items-center">
                        <a
                                href="${ userLink }"
                                onclick="${ router.click(userLink) }"
                        >
							<img src="${ props.user.avatar }" width="40px" height="40px" class="rounded-full hover:shadow-md transition" />
						</a>
                        <a
                                class="block ml-2 hover:underline text-black"
                                href="${ userLink }"
                                onclick="${ router.click(userLink) }"
                        >
                            ${ props.user.name }
                        </a>
					</div>
					<p>${ date }</p>
				</header>

				<section>
					<img
							src="${ props.url }"
							alt="${ 'Post de ' + props.user.name }"
							class="w-full"
					/>

					<p class="px-1 pt-2 pb-3 font-light">
						${ props.comment }
					</p>
                </section>

				<footer class="flex flex-col pb-2 px-1">
					<div class="flex items-center mb-2">
						<button
								class="mr-1"
								onclick="${ () => { props.liked ^= 1 } }"
						>
							<svg class="${ (props.liked ? 'fill-current' : 'stroke-current') + ' text-pink transition' }" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
						</button>
						<button
								onclick="${ () => {
									const el = document.getElementById(id)
									!disabled && el && el.focus()
								} }"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
						</button>
					</div>
					<div class="flex justify-center items-center">${
						loadCommentsButton(Maverick.link(), props)
					}</div>
					<section class="${ 'flex flex-col' + (props.comments && props.comments.length > 0 && props.loadComments ? ' pt-1' : '') }">${
						Array.isArray(props.comments) && props.loadComments ? props.comments.map(c => comment(Maverick.link(c), c)) : []
					}</section>
					<div class="flex items-center">
						<div
								class="${ 'flex items-center px-3 py-2 rounded-full border border-grey-light flex-grow short-transition ' + (disabled ? 'bg-grey-light' : 'bg-white') }"
								title="${ disabled && 'Connectez-vous pour pouvoir poster un commentaire' }"
						>
							<input
									id="${ id }"
									placeholder="${ disabled ? 'Connectez-vous !' : 'Écrivez votre commentaire...' }"
									value="${ props.newComment }"
									oninput="${ event => { props.newComment = event.target.value } }"
									class="${ 'font-light text-grey-darker flex-grow short-transition ' + (disabled ? 'bg-grey-light' : 'bg-transparent') }"
									onkeyup="${ event => { event.key === 'Enter' && saveComment(props) } }"
									disabled="${ disabled }"
							/>
							<button
									class="${ 'ml-1 text-sm short-transition ' + (disabled ? 'text-grey' : 'text-purple-light hover:text-purple') }"
									onclick="${ () => { !disabled && saveComment(props) } }"
							>Envoyer</button>
						</div>
					</div>
                </footer>
			</article>
		`
	}

	function render (h, props) {
		if (isAuthenticated()) {
			return h`
				<div class="flex justify-center items-center md:mx-10">
					<section class="container flex flex-col items-center">${
						props.posts.map((p, i) => post(Maverick.link(p), p, i))
					}</section>
				</div>
				<a
						href="/take-a-pick"
						onclick="${ router.click('/take-a-pick') }"
						title="Prendre une photo"

						class="fixed pin-b pin-r flex justify-center items-center m-6 p-4 xl:m-10 xl:p-6 rounded-full bg-purple-light shadow hover:shadow-md short-transition text-white"
				>
					<svg class="w-8 h-8 xl:w-10 xl:h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
				</a>
			`
		}
		return h`
			<div class="flex justify-center items-center md:mx-10">
				<section class="container flex flex-col items-center">${
					props.posts.map((p, i) => post(Maverick.link(p), p, i))
				}</section>
			</div>
		`
	}

	return new Page('Camagru - Accueil', data, render, {
		created: function created () {
			//this.state.loading = true

			/*setTimeout(() => {
				this.state.user.username = 'kikou'
				data.articles = [
					{
						title: 'Hehe !',
						text: "Surprise"
					}
				]
				this.state.loading = false
			}, 15000)*/

			/*fetch('http://localhost:8001/sign-in', {
				method: 'POST',
				body: JSON.stringify({
					username: 'Shakespeare',
					password: 'Hamlet'
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
				.then(res => res.json())
				.then(data => {
					//const error = data.error
					//const user = data.user

					this.state.user = {
						username: "<p>console.log('teub')</p>"
					}
				})
				.catch(console.error)
				.finally(() => {
					this.state.loading = false
				})*/
		}
	})

})()
