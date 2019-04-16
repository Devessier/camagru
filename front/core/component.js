'use strict';

const MaverickComponent = (() => {

    /**
     * Watch changes for a given property of an object
     * @param {String} prop
     * @param {Function} handler
     */
    function watch (prop, handler) {
        let oldValue = this[prop], newValue = oldValue

        const getter = function get () {
            return newValue
        }
        const setter = function set (value) {
            oldValue = newValue = value
            handler(prop, oldValue, value)
            return value
        }
        if (delete this[prop]) {
            Object.defineProperty(this, prop, {
                get: getter,
                set: setter
            })
        }
    }

    /**
     * Unset watchers
     * @param {String} prop
     */
    function unwatch (prop) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
    }

    /**
     * MaverickComponent constructor
     * @param {String} name
     * @param {String} selector The query selector representing the element to bind the instance to
     * @param {Object} data
     * @param {Function} update
     */
    function MaverickComponent (name, selector, data, update) {
        this.el = Maverick.bind(document.querySelector(selector))
        this.name = name
        this.data = data
        this.update = update

        this._watch(this, [ 'data' ])
    }

    /**
     * Watch given properties
     * @param {Array<String>} properties
     */
    MaverickComponent.prototype._watch = function _watch (self, properties) {
        for (let property of properties) {
            if (typeof this[property] === 'object')
                return this._watch(this[property], Object.keys(this[property]))
            watch.call(self, property, (prop, oldValue, newValue) => {
                this.render()
                return newValue
            })
        }
    }

    MaverickComponent.prototype.render = function render () {
        this.update(this.el, this.data)
    }

    return MaverickComponent

})()
