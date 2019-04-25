/* 6 */

const Page = (() => {

	let id = 0

	/**
	 * These are the events a page can handle.
	 * This is mainly used to freeze and then recover the state
	 * of a page to disallow the rendering of a component beeing in background.
	 */
	const events = new Map([
		[ 'unmount', function unmount () {
			this.component.state.freeze(this.component.id)
		} ],
		[ 'mount', function mount () {
			this.component.state.recover(this.component.id)
		} ]
	])
	
	function layout (render, props) {
		render`
		<nav class="flex items-center justify-between bg-grey-light px-12 py-4 mb-4">
            <h1><a href="/">Camagru</a></h1>
            <div>${ (props.user && props.user.logguedIn) ? 'Loggued in' : 'Sign up' }</div>
		</nav>
		<main>${ props.page(Maverick.create(), props) }</main>`
	}

	function Page (title, state, page) {
		this.id = id++
		this.component = new MaverickComponent(state, layout, page)
		this.state = state
		this.title = title
	}

	Page.prototype.setTitle = function setTitle (title) {
		if (document.title !== title)
			document.title = title
	}

	Page.prototype.render = function render () {
		this.setTitle(this.title)
		this.component.render()
	}

	Page.prototype._trigger = function _trigger (event) {
		const fn = events.get(event)
		fn && fn.call(this)
	}

	return Page

})()
