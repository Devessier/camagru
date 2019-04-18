'use strict';

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
		]
	}

	setTimeout(() => {
		data.articles = [
			{
				title: 'BYE',
				text: "CIAO"
			}
		]
	}, 5000)

	function article (render, props) {
		console.log('render article')
		return render`<article>
			<h1>${props.title}</h1>
			<p>${props.text}</p>
			<button onclick="${ () => { props.text = 'deleteddddddd' } }">Change text</button>
		</article>`
	}

	function update (render, props) {
		console.log('render update')
		render`<section>${ props.articles.map(obj => article(Maverick.create(), obj)) }</section>`
	}

	return new Page('Camagru - Accueil', data, update)

})()