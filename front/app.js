'use strict';

loadScript([ 'core/component.js', 'test.js' ])
	.then(() => {
		const App = {
			html: Maverick.bind(document.getElementById('app')),
			data: {
				message: 'Salut !'
			},
			teub () {
				console.log('this', this)
				//this.data.message = event.target.value
				//this.render()
			},
			render () {
				console.log(this)
				this.html`<p> ${this.data.message}</p>
				<button value="${this.data.message}" onclick="${this.teub}">Text</button>`
			}
		}

		App.render()
	})
