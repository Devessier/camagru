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
        this.timeoutID = null

        this.el = Maverick.bind(document.querySelector(selector))
        this.update = update

        this.state = Observer.apply(data)
        this.state.bind({
            id: this.id,
            fn: this.render.bind(this)
        })
    }

    /**
     * Render the component only at the start of the next nick
     */
    MaverickComponent.prototype.render = function render () {
        if (this.timeoutID !== null)
            return
        this.timeoutID = setTimeout(() => {
            this.update(this.el, this.state.value)
            this.timeoutID = null
        }, 0)
    }

    return MaverickComponent

})()
