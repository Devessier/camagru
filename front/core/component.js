'use strict';

const MaverickComponent = (() => {

    let id = 0

    /**
     * MaverickComponent constructor
     * @param {String} selector The query selector representing the element to bind the instance to
     * @param {Object} data
     * @param {Function} update
     */
    function MaverickComponent (selector, data, update) {
        this.id = id++

        this.el = Maverick.bind(document.querySelector(selector))
        this.update = update

        this.state = Observer.apply(data)
        this.state.bind(this.render.bind(this))
    }

    MaverickComponent.prototype.render = function render () {
        this.update(this.el, this.state.value)
    }

    return MaverickComponent

})()
