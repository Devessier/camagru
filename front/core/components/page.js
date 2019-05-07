/* 7 */

const Page = (() => {

	let id = 0

	/**
	 * Page constructor - A Page represents the higher Maverick component being able to be rendered through an unique URL
	 * @param {String} title The title of the page (document.title)
	 * @param {Object} state A reactive object containing the state which we'll be passed to the render function
	 * @param {Function} page The famous render function
	 * @param {Object<String, Function>} hooks An object <String, Function> containing functions which we'll be called at some moments of the life of the component
	 */

	function Page (title, state, page, hooks) {
		this.id = id++
		this.component = new MaverickComponent(state, layout, page)
		this.state = state
		this.title = title

		/**
		 * These are the events a page can handle.
		 * This is mainly used to freeze and then recover the state
		 * of a page to disallow the rendering of a component beeing in background.
		 */
		this.events = new Map([
			[ 'unmount', function unmount () {
				this.component.state.freeze(this.component.id)
			} ],
			[ 'mount', function mount () {
				this.component.state.recover(this.component.id)

				this._trigger('created')
			} ]
		])

		if (typeof hooks === 'object') {
			for (let hook in hooks) {
				this.events.set(hook, hooks[hook])
			}
		}
	}

	Page.prototype.setTitle = function setTitle (title) {
		if (document.title !== title)
			document.title = title
	}

	Page.prototype.render = function render () {
		this.setTitle(this.title)
		this.component.render()

		window[`component-${this.id}`] = this.component.render.bind(this.component)
	}

	Page.prototype._trigger = function _trigger (event) {
		const fn = this.events.get(event)
		fn && fn.call(this)
	}

	return Page

})()
