const Home = (() => {

	let data = {
		articles: [
			{
				title: 'Hi !',
				text: "Salut ! Je suis le texte de l'article !"
			},
			{
				title: 'Hi !',
				text: "Salut ! Je suis le texte de l'article !"
			},
			{
				title: 'Hi !',
				text: "Salut ! Je suis le texte de l'article !"
			},
			{
				title: 'Hi !',
				text: "Salut ! Je suis le texte de l'article !"
			}
		],
		loading: false,
		user: {}
	}

	function article (render, props) {
		return render`<article>
			<h1>${props.title}</h1>
			<p>${props.text}</p>
			<button onclick="${ () => { props.text = 'deleteddddddd' } }">Change text</button>
		</article>`
	}

	function render (h, props) {
		return (
			h`<input label="focus me">
			<div>${
				props.loading ? 'loading...' : Maverick.sanitize(props.user.username)
			}</div>
			<section>${
				props.articles.map(obj => article(Maverick.link(obj), obj))
			}</section>`
		)
	}

	return new Page('Camagru - Accueil', data, render, {
		created: function created () {
			this.state.loading = true

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
