'use strict';

const Observer = (() => {

    function def (object, property, value) {
        Object.defineProperty(object, property, {
            value
        })
    }

    function observe (value) {
        if (typeof value !== 'object')
            return
        if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer)
            return value.__ob__
        return new Observer(value)
    }
    
    function defineReactive (object, key) {
        const val = object[key]

        let childOb = observe(val)

        Object.defineProperty(object, key, {
            get: function reactiveGetter () {
                return val
            },
            set: function reactiveSetter (newVal) {
                console.log('set', val, newVal)
                if (val === newVal)
                    return
                console.log('hi')
                val = newVal
                //childOb = observe(newVal)
                console.log('yolo')
                console.log(val)
            }
        })
    }

    /**
     * Observer constructor - Setups the reactive getters and setters for a given variable
     * @param {*} value The value to which bind a reactive getter and setter
     */
    function Observer (value) {
        this.value = value
        def(value, '__ob__', this)

        this.walk(value)
    }

    Observer.prototype.walk = function walk (value) {
        const keys = Object.keys(value)
        for (let key of keys) {
            defineReactive(value, key)
        }
    }

    return Observer

})()
