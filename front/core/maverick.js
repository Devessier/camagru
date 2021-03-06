/* 2 */

const Maverick = (() => {

    const LOVE = '#TOPGUN#'
    const UID = LOVE + ((Math.random() * new Date) | 0)
    const UIDC = '<!--' + UID + '-->'
    const BLACK_LIST = {
        '&': '&#38;',
        '<': '&#60;',
        '>': '&#62;',
        '"': '&#34;',
        '\'': '&#39;',
        '/': '&#47;'
    }
    const SANITIZING_REGEX = /&(?!#?w+;)|<|>|"|'|\//g
    const weak = new WeakMap

    /**
     * Parse attributes of node and launch gun fight against bastards
     * @param {Node} aircraft The node
     * @param {Array} weapons The actions
     */
    function attributesGunFight (aircraft, weapons) {
        const attributes = Array.from(aircraft.attributes)
        for (let attribute of attributes) {
            if (attribute.value === UIDC) {
                weapons.push(setWeapon(aircraft, attribute))
            }
        }
    }

    /**
     * Walk throughout the node children
     * @param {HTMLElement} aircraft The node
     * @param {Array} weapons The actions
     */
    function aircraftCarrier (aircraft, weapons) {
        const childNodes = Array.prototype.slice.call(aircraft.childNodes)
        const length = childNodes.length

        for (let entry of childNodes.entries()) {
            const i = entry[0]
            const child = entry[1]
            switch (child.nodeType) {
                case 1:
                    attributesGunFight(child, weapons)
                    aircraftCarrier(child, weapons)
                    break
                case 8:
                    if (length === 1) {
                        weapons.push(randomShoot(aircraft))
                        aircraft.removeChild(child)
                    } else if (childNodes[i - 1].nodeType === 1 && (i + 1 === length || childNodes[i + 1].nodeType === 1)) {
                        weapons.push(virtualShoot(child))
                    } else {
                        const text = aircraft.ownerDocument.createTextNode('')
                        weapons.push(setMissionOrder(text))
                        aircraft.replaceChild(text, child)
                    }
                    break
                case 3:
                    if (aircraft.nodeName === 'STYLE' && child.textContent.includes(UIDC))
                        weapons.push(setMissionOrder(child))
                    break
            }
        }
    }

    /**
     * Set a random value to the node
     * @param {Node} ship The node
     */
    function randomShoot (ship) {
        let old

        return function any (value) {
            if (value === null) value = undefined

            switch (typeof value) {
                case 'string':
                case 'number':
                case 'boolean':
                case 'undefined':
                case 'bigint':
                case 'symbol':
                    // The value is a simple string that
                    // we will put into the element using textContent.
                    // This prevents XSS.
                    if (old !== value) {
                        ship.textContent = value
                        old = value
                    }
                    break
                default:
                    if (Array.isArray(value)) {
                        if (value.length === 1) {
                            any(value[0])
                        } else if (typeof value[0] === 'string') {
                            any(value.join(''))
                        } else {
                            if (!twin(ship.childNodes, value)) {
                                any(populateFragment(
                                    document.createDocumentFragment(),
                                    value
                                ))
                            }
                        }
                    } else {
                        populateShip(ship, value)
                    }
                    break
            }
        }
    }

    function virtualShoot (ship) {
        const fragment = document.createDocumentFragment()
        let childNodes = []

        return function any (value) {
            const parentNode = ship.parentNode
            switch (typeof value) {
                case 'string':
                case 'number':
                case 'boolean':
                    rmRfShips(childNodes)
                    htmlSyringe(fragment, value)
                    childNodes = Array.from(fragment.childNodes)
                    parentNode.insertBefore(fragment, ship)
                    break
                default:
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                            any(value[0])
                        } else if (typeof value[0] === 'string') {
                            any(value.join(''))
                        } else {
                            if (!twin(childNodes, value)) {
                                rmRfShips(childNodes)
                                populateFragment(fragment, value)
                                childNodes = Array.from(fragment.childNodes)
                                parentNode.insertBefore(fragment, ship)
                            }
                        }
                    } else {
                        rmRfShips(childNodes)
                        childNodes = value.nodeType === 11 ? Array.from(value.childNodes) : [value]
                        parentNode.insertBefore(value, ship)
                    }
                    break
            }
        }
    }

    /**
     * Set an attribute of a Node element
     * @param {Node} aircraft
     * @param {Attr} attribute
     */
    function setWeapon (aircraft, attribute) {
        const name = attribute.name
        const isListener = name.indexOf('on') === 0
        const directWrite = /^value$/.test(name)
        const weapons = new Map

        if (isListener) {
            aircraft.removeAttribute(name)

            let attributeName = name
            let modifier = null

            if ([ 'passive', 'prevent', 'once' ].some(modifier => name.endsWith('.' + modifier))) {
                const splits = attributeName.split('.')

                attributeName = splits[0]
                modifier = splits[1]
            }

            const eventName = attributeName.split(/^on/)[1]

            function preventDefaultHandlerMaker (handler) {
                return (event) => {
                    event.preventDefault()

                    handler()
                }
            }

            return function event (value) {
                const old = weapons.get(attributeName)

                if (old === value)
                    return

                if (typeof value !== 'function') {
                    aircraft.removeAttribute(attributeName)
                    weapons.set(attributeName, false)
                    return
                }

                aircraft.removeEventListener(eventName, old)

                if (modifier === 'prevent') {
                    const handler = preventDefaultHandlerMaker(value)

                    aircraft.addEventListener(eventName, handler)
                    weapons.set(attributeName, handler)
                    return
                }

                let options = false
                if (modifier === 'passive') {
                    options = { passive: true }
                } else if (modifier === 'once') {
                    options = { once: true }
                }

                aircraft.addEventListener(eventName, value, options)
                weapons.set(attributeName, value)
            }
        }
        /**
         * The attr function sets a value for a given attribute on aircraft node
         * It takes care of checking if the requested new value is a false boolean and, if this is the case, it simply deletes the attribute
         * It makes possible the use of attributes such as disabled or readonly
         * @param {any} value
         */
        return function attr (value) {
            const old = weapons.get(name)

            if (old === value)
                return

            /**
             * If *value* is a falsy value, remove the attribute and save that the value was *false*.
             * This prevents, for instance, img tags to fetch **undefined** file.
             */
            if (Boolean(value) === false && name !== 'value') {
                aircraft.removeAttribute(name)

                weapons.set(name, false)
            } else {
                if (directWrite) aircraft.value = value
                else aircraft.setAttribute(name, value)

                weapons.set(name, value)
            }
        }
    }

    /**
     * Set the textContent of a Node
     * @param {Node} ship
     */
    function setMissionOrder (ship) {
        let old
        return text => {
            if (text !== old) {
                ship.textContent = text
                old = text
            }
        }
    }

    function htmlSyringe (fragment, html) {
        const template = fragment.ownerDocument.createElement('template')
        template.innerHTML = html
        populateFragment(
            fragment,
            Array.from((template.content || template).childNodes)
        )
    }

    /**
     * Populate a document fragment
     * @param {DocumentFragment} frag
     * @param {Array} aircrafts
     */
    function populateFragment (frag, aircrafts) {
        for (let aircraft of aircrafts)
            frag.appendChild(aircraft)
        return frag
    }

    /**
     * Populate a Node
     * @param {Node} ship
     * @param {Node} trainee
     */
    function populateShip (ship, trainee) {
        switch (trainee.nodeType) {
            case 1:
                const childNodes = ship.childNodes
                const length = childNodes.length
                if (length > 0 && childNodes[0] === trainee) {
                    rmShipsList(childNodes, 1)
                } else {
                    rmRf(ship, trainee)
                }
                break
            case 11:
                if (!twin(ship.childNodes, trainee.childNodes)) {
                    rmRf(ship, trainee)
                }
                break
            case 3:
                ship.textContent = trainee.textContent
                break
        }
    }

    function rmShipsList (list, index) {
        let length = list.length
        while (index < length--) {
            const child = list[length]
            child.parentNode.removeChild(child)
        }
    }

    function rmRfShips (ships) {
        const length = ships.length

        for (let i = 0; i < length; i++) {
            const child = ships[i]
            child.parentNode.removeChild(child)
        }
    }
    
    /**
     * Reset and populate a Node
     * @param {Node} ship
     * @param {Node} trainee
     */
    function rmRf (ship, trainee) {
        ship.textContent = ''
        ship.appendChild(trainee)
    }

    /**
     * Compares two Nodes
     * @param {Node} lol
     * @param {Node} lel
     */
    function twin (lol, lel) {
        if (lol === lel)
            return true
        if (lol.length !== lel.length)
            return false
        for (let index of lol.keys())
            if (lol[index] !== lel[index])
                return false
        return true
    }

    function armAndShoot (node) {
        const children = []
        let child

        for (child of node.childNodes) {
            if (child.nodeType === 1 || child.textContent.trim().length > 0) {
                children.push(child)
            }
        }

        const length = children.length
        if (length < 2) {
            child = length < 1 ? node : children[0]
            return () => child
        }
        return () => children
    }

    function linkContent () {
        let fragment = document.createDocumentFragment()
        let render = Maverick.bind(fragment)
        let templates
        let content
        let setup = true

        return function update (statics) {
            if (templates !== statics) {
                setup = true
                templates = statics
                fragment = document.createDocumentFragment()
                render = Maverick.bind(fragment)
            }
            render.apply(null, arguments)
            if (setup) {
                setup = false
                content = armAndShoot(fragment)
            }
            return content()
        }
    }

    /**
     * Update the template - The template has been cached and this function modifies the DOM only if necessary
     * @param {Array} templates
     */
    function update () {
        const updates = this[LOVE].updates

        for (let i = 1; i < arguments.length; i++)
            updates[i - 1](arguments[i])
        return this
    }

    /**
     * Upgrade the template - The template has been cached, this function refreshes its data (attributes, children, text)
     * @param {*} templates 
     */
    function upgrade (templates) {
        const updates = []
        const html = templates.join(UIDC)
        // The node is a HTML element
        if (this.nodeType === 1) {
            this.innerHTML = html
        } else {
            htmlSyringe(this, html)
        }
        aircraftCarrier(this, updates)
        this[LOVE] = {
            templates,
            updates
        }
        return update.apply(this, arguments)
    }
    
	function Maverick (templates) {
        if (LOVE in this && this[LOVE].templates === templates)
            return update.apply(this, arguments)
        return upgrade.apply(this, arguments)
    }

    Maverick.link = function link (ref) {
        if (!ref)
            return linkContent()
        return weak.get(ref) || (
            weak.set(ref, linkContent()),
            link(ref)
        )
    }

    Maverick.sanitize = function sanitize (html) {
        return html ? html.replace(SANITIZING_REGEX, match => BLACK_LIST[match] || match) : ''
    }

    return Maverick

})()
