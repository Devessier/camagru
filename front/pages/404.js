'use strict';

const _404 = (() => {

	function update (render) {
		console.log('404')
		render`<h1>Page not found !</h1>`
	}

	return new Page('404', {}, update)
})()
