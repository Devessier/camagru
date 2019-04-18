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
            console.log('has handler : ', blacklist.has(handler))
            !blacklist.has(handler) && handler()
        }
    }

    Dep.prototype.freeze = function freeze (fn) {
        console.log('freeze ' + blacklist.size, fn, [...blacklist])
        blacklist.add(fn)
    }

    Dep.prototype.recover = function recover (fn) {
        console.log('recover ' + blacklist.size, fn, [...blacklist])
        console.log(blacklist.delete(fn))
    }

    return Dep

})()
