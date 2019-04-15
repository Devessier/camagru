'use strict';

const Maverick = (() => {

	let _root
	
	let _elementId = 0
	
	const _store = []

	function _render (elements) {
		const html = Array.prototype.shift.apply(arguments)

		_root.innerHTML = html.reduce((innerHTML, node, index) => {
			const result = innerHTML + node
			if (!(index < arguments.length))
				return result
			const arg = arguments[index]
			if (typeof arg === 'function') {
				window[arg.name] = arg
				return result + arg.name + '()'
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
