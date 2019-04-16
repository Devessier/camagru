'use strict';

const Dep = (() => {

    let id = 0

    function Dep () {
        this.id = id++
        this.handlers = []
    }

    Dep.prototype.bind = function bind (handler) {
        this.handlers.push(handler)
    }

    Dep.prototype.trigger = function trigger () {
        let i = 0
        for (let handler of this.handlers) {
            handler()
        }
    }

    return Dep

})()
