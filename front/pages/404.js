'use strict';

const _404 = (() => {

	function update (render) {
		render`<h1>Page not found !</h1>`
	}

	return new Page('404', {}, update)
})()
