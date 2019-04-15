'use strict';

const Maverick = (() => {

	let _root
	
	let _elementId = 0
	
	const _functions = []

	function _render (elements) {
		console.log('render')
		const html = Array.prototype.shift.apply(arguments)

		_root.innerHTML = html.reduce((innerHTML, node, index) => {
			const result = innerHTML + node
			if (!(index < arguments.length))
				return result
			const arg = arguments[index]
			if (typeof arg === 'function') {
				let fnName = null
				_functions.forEach(f => {
					if (f.fn === arg)
						return fnName = f.name
				})
				if (!fnName) {
					const name = arg.name + Math.floor(Math.random() * 100000)
					console.log(name)
					_functions.push({
						name,
						fn: arg
					})
					window[name] = arg
					return result + name + '()'
				}
				return result + fnName + '()'
			}
			return result + arg
		}, '')
	}

	/**
	 * The bind function binds to an HTMLElement all the Maverick application
	 * @param {HTMLElement} node - The node to which bind all the application
	 */
	function bind (node) {
		if (!node instanceof HTMLElement)
			throw new Error('Provide an HTMLElement to bind')
		_root = node
		return _render
	}
	
	return {
		bind
	}
})()
