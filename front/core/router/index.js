'use strict'

const Router = (() => {
	let currentRoute = '/'
	
	const routes = [
		{
			path: '/',
			name: 'Home'
		}
	]

	function push (route) {
		if (!(route.name || route.path))
			throw new Error('Specify either the route path or the route name')
	}
	
	return {
		
	}
})()