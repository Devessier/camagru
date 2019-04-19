'use strict';

const Page = (() => {

	let id = 0

	const events = new Map([
		[ 'unmount', function unmount () {
			this.component.state.freeze(this.component.id)
		} ],
		[ 'mount', function mount () {
			this.component.state.recover(this.component.id)
		} ]
	])

	function Page (title, state, page) {
		this.id = id++
		this.component = new MaverickComponent('#app', state, page)
		this.state = state
		this.title = title
	}

	Page.prototype.setTitle = function setTitle (title) {
		if (document.title !== title)
			document.title = title
	}

	Page.prototype.render = function render () {
		console.log('render page !')
		this.setTitle(this.title)
		this.component.render()
	}

	Page.prototype._trigger = function _trigger (event) {
		console.log('trigger event ' + event)
		const fn = events.get(event)
		fn && fn.call(this)
	}

	return Page

})()
