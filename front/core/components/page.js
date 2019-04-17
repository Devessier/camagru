'use strict';

const Page = (() => {

	function Page (title, state, page) {
		this.component = new MaverickComponent('#app', state, page)
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

	return Page

})()
