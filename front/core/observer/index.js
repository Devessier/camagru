'use strict';

const Observer = (() => {

    /**
     * Observer constructor - Setups the reactive getters and setters for a given variable
     * @param {*} value The value to which bind a reactive getter and setter
     */
    function Observer (value) {
        this.value = value
        
    }

    return Observer

})()
