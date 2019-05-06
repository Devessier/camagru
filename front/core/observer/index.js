/* 4 */

function def (object, property, value) {
    Object.defineProperty(object, property, {
        value: value,
        writable: true,
        configurable: true
    })
}

/**
 * Util function under Object.hasOwnProperty
 * @param {Object} object
 * @param {String} property
 */
function hasOwn (object, property) {
    return object.hasOwnProperty(property)
}

const Observer = (() => {

    const arrayKeys = Object.getOwnPropertyNames(ArrayObserver.arrayMethods)

    Observer.apply = function apply (object) {
        if (hasOwn(object, '__ob__') && object.__ob__ instanceof Observer) {
            object.__ob__.walk(object)
            return object.__ob__
        }
        return new Observer(object)
    }

    /**
     * Observer constructor - Setups the reactive getters and setters for a given variable
     * @param {*} value The value to which bind a reactive getter and setter
     */
    function Observer (value, dep) {
        this.dep = dep instanceof Dep ? dep : new Dep
        this.value = value
        def(value, '__ob__', this)

        if (Array.isArray(value)) {
            copyAugment(value, ArrayObserver.arrayMethods, arrayKeys)
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    /**
     * Walk throughout the entries of the value object
     * @param {Object} value
     */
    Observer.prototype.walk = function walk (value) {
        const keys = Object.keys(value)
        for (let key of keys) {
            defineReactive(value, key, this.dep)
        }
    }

    /**
     * Add a function which will be called if a setter is triggered
     * @param {Object} obj
     */
    Observer.prototype.bind = function bind (obj) {
        this.dep.bind(obj)
    }

    Observer.prototype.freeze = function freeze (fn) {
        this.dep.freeze(fn)
    }

    Observer.prototype.recover = function recover (fn) {
        this.dep.recover(fn)
    }

    /**
     * This function loops over `array` and observes each of its members
     * @param {Array} array
     */
    Observer.prototype.observeArray = function observeArray (array) {
        for (let item of array) {
            observe(item, this.dep)
        }
    }

    /**
     * Setup an observer for a given value
     * @param {*} value
     * @param {Dep} dep
     */
    function observe (value, dep) {
        if (typeof value !== 'object')
            return
        if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer)
            return value.__ob__
        return new Observer(value, dep)
    }
    
    /**
     * This function setups the getter and the setter for a given key of an object
     * @param {Object} object
     * @param {String} key
     * @param {Dep} dep
     */
    function defineReactive (object, key, dep) {
        let val = object[key]

        observe(val, dep)

        const property = Object.getOwnPropertyDescriptor(object, key)
        if (property && !property.configurable)
            return
        
        const getter = property && property.get
        const setter = property && property.set

        Object.defineProperty(object, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter () {
                return getter ? getter.call(object) : val
            },
            set: function reactiveSetter (newVal) {
                const value = getter ? getter.call(object) : val
                if (value === newVal || (getter && !setter))
                    return

                if (setter)
                    setter.call(object, newVal)
                else
                    val = newVal
                observe(newVal, dep)
                dep.trigger()
            }
        })
    }

    function copyAugment (target, src, keys) {
        for (let key of keys) {
            def(target, key, src[key])
        }
    }

    return Observer

})()
