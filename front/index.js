/* 0 */

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

function loadImage (obj, srcKey, baseUrl) {
    if (!srcKey)
        srcKey = 'path'
    if (!baseUrl)
        baseUrl = 'http://localhost:8001'

    return new Promise((resolve, reject) => {
        const img = new Image

        img.onload = function onload () {
            console.log(obj)
            obj[srcKey] = this.src
            resolve(obj)
        }
        img.onerror = reject

        img.src = baseUrl + obj[srcKey]
    })
}
