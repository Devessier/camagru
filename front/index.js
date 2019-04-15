'use strict'

function loadScript (paths) {
	if (!Array.isArray(paths))
		return Promise.reject('Need to provide an array')
	return Promise.all(paths.map(path => new Promise(resolve => {
		const body = document.head
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.src = path

		script.onreadystatechange = resolve
		script.onload = resolve

		body.appendChild(script)
	})))
}

function mergeObjects () {
	let tmp = {}
	for (let obj of arguments) {
		const keys = Object.keys(obj)
		for (let key of keys) {
			tmp[key] = obj[key]
		}
	}
	return tmp
}

loadScript([ 'app.js' ])
