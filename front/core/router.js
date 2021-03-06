/* 8 */

const Router = (() => {

	let created = false
	let lastRoute = null

	/**
	 * Router constructor - Takes an array as first parameter which represents all the routes of the application
	 * @class
	 * @param {Array} routes
	 */
	function Router (routes) {
		if (created)
			return

		created = true
		/** @member {Array<Regex>} Router.routes The application routes */
		this._routes = new Map()

		this.timeoutID = null

		this._setup(routes)

		this._currentRoute = null

		try {
			this.replace(decodeURIComponent(window.location.pathname) + window.location.search)
		} catch (e) {}

		/** @member {String} Router._currentRoute The route currently displayed */
		this._currentRouteObj = null
	}

	/**
	 * This function setups the instance by adding an event listener to window to catch popstate (History API) events and filling the _routes property
	 * @param {Array<Object>} routes
	 */
	Router.prototype._setup = function _setup (routes) {
		window.addEventListener('popstate', (event) => {
			this.replace(event.state.route)
		})
		if (Array.isArray(routes)) {
			for (let route of routes) {
				const name = route.name || ''
				const path = route.path
				const component = route.component
				const beforeEnter = route.beforeEnter
				const id = route.component.id

				if (!(path && component && component instanceof Page))
					throw new Error('Provide only valid route objects : ' + JSON.stringify(route))
				this._routes.set(id, {
					id,
					name,
					path,
					component,
					beforeEnter
				})
			}
		} else {
			throw new Error('routes must be an array')
		}
	}

	Router.prototype._setCurrentRoute = function _setCurrentRoute (route, handler) {
		if (this._currentRoute === route)
			return false
		let old = this._currentRoute
		this._currentRoute = route
		this._render((success) => {
			if (success) {
				handler()
			} else {
				if (!old) {
					this.replace('/')
				} else {
					this._currentRoute = old
				}
			}
		})
	}

	/**
	 * This function renders the component corresponding to the current route only at the beginning of the next event-loop tick
	 */
	Router.prototype._render = function _render (done) {
		if (this.timeoutID !== null)
			return
		this.timeoutID = setTimeout(() => {
			for (let route of this._routes.values()) {
				const regex = route.path instanceof RegExp ? route.path : new RegExp('^' + route.path + '$')
				if (regex.test(this._currentRoute)) {
					if (route.beforeEnter && !route.beforeEnter(route, lastRoute)) {
						this.timeoutID = null
						done(false)
					} else {
						this._currentRouteObj && this._currentRouteObj.component._trigger('unmount')

						this._currentRouteObj = route
						route.component._trigger('mount')
						route.component.render()
						done(true)
					}
					break
				}
			}
			this.timeoutID = null
		}, 0)
	}

	/**
	 * The `push` function tells the Router to go to another route
	 * @param {String} route
	 */
	Router.prototype.push = function push (route) {
		go.call(this, route, () => {
			history.pushState({
				route
			}, route, route)
		})
	}

	/**
	 * Try to replace the current route
	 * @param {String} route
	 */
	Router.prototype.replace = function replace (route) {
		go.call(this, route, () => {
			history.replaceState({
				route
			}, route, route)
		})
	}

	Router.prototype.click = function click (route, replace) {
		if (replace === undefined)
			replace = false
		return (event) => {
			if (replace) {
				this.replace(route)
			} else {
				this.push(route)
			}
			event.preventDefault()
		}
	}

	Router.prototype.refresh = function refresh () {
		this._currentRouteObj.component.render()
	}

	/**
	 * Utility function which moves to the next page, awaits the transformations to be done and then call the handler (either Router.prototype.push or Router.prototype.replace)
	 * @param {String} route
	 * @param {Function} handler
	 */
	function go (route, handler) {
		if (route !== this._currentRoute) {
			this._setCurrentRoute(route, () => {
				handler()
			})
		}
	}

	return Router

})()
