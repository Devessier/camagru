'use strict';

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

function copyObject (obj) {
    const newObj = {}
    Object.getOwnPropertyNames(obj).forEach(function (prop) {
        var descriptor = Object.getOwnPropertyDescriptor(obj, prop)
        Object.defineProperty(newObj, prop, descriptor)
    })
    return newObj
}

function mergeObjects () {
    const tmp = typeof arguments[0] === 'object' ? copyObject(arguments[0]) : {}
	for (let i = 1, obj = arguments[i]; i < arguments.length; i++) {
		const keys = Object.keys(obj)
		for (let key of keys) {
			tmp[key] = obj[key]
		}
	}
	return tmp
}

loadScript([ 'app.js' ])
