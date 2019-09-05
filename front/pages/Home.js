const Home = (() => {

	const data = {
		paginationIndex: -1,
		posts: [],
		loading: false,
		user: {}
	}

	const format = (() => {
		if (Intl && 'RelativeTimeFormat' in Intl) {
			const intl = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto', style: 'long' })
			const day = 3600 * 24 | 0

			return (timestamp) => {
				if (!timestamp)
					return ''

				const now = new Date
				const date = new Date(timestamp)

				const diffTime = Math.abs(now.getTime() - date.getTime())
				const seconds = Math.ceil(diffTime / 1000)

				if (seconds > day) {
					return intl.format(Math.ceil(-(seconds / day)), 'day')
				}
				const minutes = Math.ceil(-(seconds / 60))

				if (minutes === 0)
					return 'maintenant'
				return intl.format(minutes, 'minute')
			}
		} else if (Intl && 'DateTimeFormat' in Intl) {
			const intl = new Intl.DateTimeFormat('fr-FR', {})

			return (timestamp) => {
				if (!timestamp)
					return ''
				return intl.format(new Date(timestamp))
			}
		}
		return (date) => {
			return (date && typeof date.toDateString === 'function') ? date.toDateString() : date.toString()
		}
	})()

	function loadMorePosts (_start, _end) {
		const url = 'http://localhost:8001/posts' + (data.paginationIndex === -1 ? '' : ('/' + data.paginationIndex))

		return fetch(url, { credentials: 'include' })
			.then(res => res.json())
			.then((posts) => {
				if (!Array.isArray(posts))
					throw new Error('No posts')

				return posts
					.map(post => Object.assign(
						post,
						{
							url: 'http://localhost:8001/' + post.url,
							loadComments: false,
							newComment: '',
							focusComment: false
						}
					))
			})
			.then((posts) => {
				data.posts.push.apply(data.posts, posts)

				if (Array.isArray(posts) && posts.length > 0) data.paginationIndex = posts[posts.length - 1].id
			})
			.catch(() => {})
	}

	function likePost (props) {
		if (!isAuthenticated())
			return

		props.liked ^= 1

		fetch('http://localhost:8001/post/' + props.id + '/' + (!props.liked ? 'unlike' : 'like'), {
			credentials: 'include',
			method: 'PUT'
		})
			.catch(() => {})
	}

	/**
	 * This function saves a written comment through a HTTP call made with Fetch API
	 * @param {Object} props 
	 */
	function saveComment (props) {
		fetch('http://localhost:8001/add/comment/' + props.id, {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({
				comment: props.newComment
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.catch(() => {})

		const comment = {
			user: {
				id: GLOBAL_STATE.user.id,
				name: GLOBAL_STATE.user.username,
				avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
			},
			text: props.newComment,
			createdAt: new Date
		}

		if (!Array.isArray(props.comments))
			props.comments = [ comment ]
		else
			props.comments.push(comment)
		props.loadComments = true
		props.newComment = ''
	}

	function comment (render, props) {
		return render`
			<article class="flex space-around mx-1 mb-4">
				<div class="flex flex-grow flex-wrap">
					<img src="${ props.user.avatar }" width="20px" height="20px" class="rounded-full hover:shadow-md transition mr-1" />
					<p class="font-medium mr-1">${ props.user.name }</p>
					<p class="font-light">${ props.text }</p>
				</div>
				<p class="text-sm font-thin">${ format(props.createdAt) }</p>
			</article>
		`
	}

	function loadCommentsButton (render, props) {
		const hasComments = Array.isArray(props.comments) && props.comments.length > 0

		return hasComments && !props.loadComments ?
			render`
				<button
						class="${ 'text-purple-light py-2 px-2 border-purple-light rounded mb-4' + (hasComments ? ' border' : '') }"
						onclick="${ () => { props.loadComments = true } }"
				>${
					hasComments ? 'Voir les commentaires' : 'Aucun commentaire'
				}</button>
			` : render``
	}

	function post (render, props, index) {
        const userLink = '/user/' + props.user.id
		const date = format(props.createdAt)
		const id = 'input-home-' + index
		const disabled = !isAuthenticated()

		return render`
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
                        >${
							props.user.name
						}</a>
					</div>
					<p class="text-sm font-thin">${ date }</p>
				</header>

				<section>
					<img
							src="${ props.url }"
							alt="${ 'Post de ' + props.user.name }"
							class="w-full"
					/>

					<p class="px-1 pt-2 pb-3 font-light">${
						props.comment
					}</p>
                </section>

				<footer class="flex flex-col pb-2 px-1">
					<div class="flex items-center mb-2">
						<button
								class="mr-1"
								onclick="${ () => { likePost(props) } }"
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

	function posts (props) {
		const render = Maverick.link(props.posts)

		return render`
			<section class="container flex flex-col items-center">${
				props.posts.length > 0 ?
					props.posts.map((p, i) => post(Maverick.link(p), p, i)) :
					"<p class=\"mt-2\">Aucune image n'a été postée</p>"
			}</section>
		`
	}

	function render (render, props) {
		if (isAuthenticated()) {
			return render`
				<div class="flex justify-center items-center md:mx-10">${
					posts(props)
				}</div>
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
		return render`
			<div class="flex justify-center items-center md:mx-10">${
				posts(props)
			}</div>
		`
	}

	let htmlTag = null
	let fetching = false

	/**
	 * 
	 * @param {Event} e 
	 */
	function infiniteScroll (e) {
		if (!htmlTag) {
			htmlTag = document.querySelector('html')
		}

		const DELTA = 25 | 0

		if (!fetching && e.pageY >= document.body.clientHeight - htmlTag.clientHeight - DELTA) {
			// load
			console.log('load')
			fetching = true
			loadMorePosts()
				.then(() => {
					setTimeout(() => {
						fetching = false
					}, 100)
				})
		}
	}

	return new Page('Camagru - Accueil', data, render, {
		created: function created () {
			loadMorePosts()
				.then(() => {
					window.addEventListener('scroll', infiniteScroll, { passive: true })
				})
		},
		bye: function bye () {
			window.removeEventListener('scroll', infiniteScroll)
		}
	})

})()
