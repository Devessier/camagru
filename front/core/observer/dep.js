'use strict';

const Dep = (() => {

    let id = 0

    const blacklist = new Set

    function Dep () {
        this.id = id++
        this.handlers = []
    }

    Dep.prototype.bind = function bind (handler) {
        this.handlers.push(handler)
    }

    Dep.prototype.trigger = function trigger () {
        for (let handler of this.handlers) {
            const id = handler.id
            const fn = handler.fn
            !blacklist.has(id) && fn()
        }
    }

    Dep.prototype.freeze = function freeze (id) {
        blacklist.add(id)
    }

    Dep.prototype.recover = function recover (id) {
        blacklist.delete(id)
    }

    return Dep

})()
