'use strict';

loadScript([ 'core/component.js', 'test.js' ])
	.then(() => {
		const root = Maverick.bind(document.getElementById('app'))
		const array = [ 1, 2 ]

		function callback () {
			console.log('callback')
		}

		root`<div>
			Salut ! ${array.map(el => el * 2)[0]}
			<button onclick=${callback} title="${'lol'}">Text</button>
		</div>`
	})
