const Home = (() => {

	const data = {
		posts: [
			{
				id: 0,
				url: 'https://cdn.pixabay.com/photo/2017/01/13/14/06/james-handley-1977361_640.jpg',
				text: 'Hi !',
				user: {
					id: 0,
					name: 'Baptiste',
					avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
				},
				comments: [
					{
						user: {
							name: 'Baptiste'
						},
						text: 'Sacrée photo !'
					}
				],
				createdAt: +new Date
			},
			{
				id: 1,
				url: 'https://cdn.pixabay.com/photo/2017/01/13/14/06/james-handley-1977361_640.jpg',
				text: 'Hi !',
				user: {
					id: 0,
					name: 'Baptiste',
					avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
				},
				comments: [
					{
						user: {
							name: 'Baptiste'
						},
						text: 'Sacrée photo !'
					}
				],
				createdAt: +new Date
			}
		],
		loading: false,
		user: {}
	}

	function post (h, props) {
		const format = (() => {
			const f = new Intl.DateTimeFormat('fr-FR', {

			})

			return timestamp => f.format(new Date(timestamp))
		})()

        const userLink = '/user/' + props.user.id
        const date = format(props.createdAt)

		return h`
			<article class="flex flex-col mb-4 bg-grey-lighter">
				<header class="flex justify-between items-center py-2 px-1">
					<div class="flex items-center">
                        <a
                                href="${ userLink }"
                                onclick="${ router.click(userLink) }"
                        >
							<img src="${ props.user.avatar }" width="40px" height="40px" class="rounded-full hover:shadow-md transition" />
						</a>
                        <a
                                class="block ml-2 hover:underline"
                                href="${ userLink }"
                                onclick="${ router.click(userLink) }"
                        >
                            ${ props.user.name }
                        </a>
					</div>
					<p>${ date }</p>
				</header>

				<section>
					<img src="${ props.url }" class="w-full" />
                </section>

                <footer class="flex justify-center items-center">
                </footer>
			</article>
		`
	}

	function render (h, props) {
		return h`
			<div class="flex justify-center items-center mx-10">
				<section class="flex flex-col items-center">${
					props.posts.map(p => post(Maverick.link(p), p))
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
