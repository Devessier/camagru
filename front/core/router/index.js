'use strict'

const Router = (() => {

	let created = false

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
		this._routes = []

		this.timeoutID = null

		this._setup(routes)

		/** @member {String} Router.currentRoute The route currently displayed */
		this.replace(window.location.pathname)
		this._currentRouteObj = null
	}

	/**
	 * This function setups the instance by adding an event listener to window to catch popstate (History API) events and filling the _routes property
	 * @param {Array<Object>} routes
	 */
	Router.prototype._setup = function _setup (routes) {
		window.addEventListener('popstate', (event) => {
			this.replace(event.state.route )
		})
		if (Array.isArray(routes)) {
			for (let route of routes) {
				const name = route.name || ''
				const path = route.path
				const component = route.component

				if (!(path && component && component instanceof Page))
					throw new Error('Provide only valid route objects : ' + JSON.stringify(route))
				this._routes.push({
					name,
					path,
					component
				})
			}

			console.log(this._routes)

			let _route

			Object.defineProperty(this, '_currentRoute', {
				get: function reactiveGetter () {
					return _route
				},
				set: function reactiveSetter (newVal) {
					if (newVal === _route)
						return false
					_route = newVal
					this._render()
					return true
				}
			})
		} else {
			throw new Error('`routes` must be an array')
		}
	}

	/**
	 * This function renders the component corresponding to the current route only at the beginning of the next event-loop tick
	 */
	Router.prototype._render = function _render () {
		if (this.timeoutID !== null)
			return
		this.timeoutID = setTimeout(() => {
			for (let route of this._routes) {
				const regex = route.path instanceof RegExp ? route.path : new RegExp('^' + route.path + '$')
				if (regex.test(this._currentRoute)) {
					route.component.render()
					this._currentRouteObj = route
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

	/**
	 * Utility function which moves to the next page, awaits the transformations to be done and then call the handler (either Router.prototype.push or Router.prototype.replace)
	 * @param {String} route
	 * @param {Function} handler
	 */
	function go (route, handler) {
		if (this._currentRoute = route) {
			setTimeout(() => {
				handler()
			}, 0)
		}
	}

	return Router

})()