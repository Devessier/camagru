/* 4 */

const ArrayObserver = (() => {

	const arrayProto = Array.prototype
	const arrayMethods = Object.create(arrayProto)

	const methods = [
		'push',
		'pop',
		'shift',
		'unshift',
		'splice',
		'sort',
		'reverse'
	]

	for (let method of methods) {
		const original = arrayProto[method]
		def(arrayMethods, method, function mutator () {
			const args = Array.from(arguments)
			const result = original.apply(this, args)
			const ob = this.__ob__
			let inserted
			switch (method) {
				case 'push':
				case 'unshift':
					inserted = args
					break
				case 'splice':
					inserted = args.slice(2)
					break
			}
			if (inserted)
				ob.observeArray(inserted)
			ob.dep.trigger()
			return result
		})
	}

	return {
		arrayMethods: arrayMethods
	}

})()