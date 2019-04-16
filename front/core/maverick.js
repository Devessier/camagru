'use strict';

const Maverick = (() => {

    const LOVE = '#TOPGUN#'
    const UID = LOVE + ((Math.random() * new Date) | 0)

    /**
     * Parse attributes of node and launch gun fight against bastards
     * @param {Node} aircraft The node
     * @param {Array} weapons The actions
     */
    function attributesGunFight (aircraft, weapons) {
        for (let attribute of aircraft.attributes) {
            if (attribute.value === UID) {
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

        for (let child of childNodes) {
            switch (child.nodeType) {
                case 1:
                    attributesGunFight(child, weapons)
                    aircraftCarrier(child, weapons)
                    break
                case 3:
                    cruiser(aircraft, child, weapons)
                    break
            }
        }
    }

    /**
     * Walk throughtout text nodes
     * @param {Node} flagship
     * @param {Node} trainee
     * @param {Array} weapons
     */
    function cruiser (flagship, trainee, weapons) {
        const doc = flagship.ownerDocument || document
        const text = trainee.nodeValue
        const textNodes = text.split(UID)

        for (let box of textNodes.entries()) {
            const index = box[0]
            const text = box[1]

            if (index) {
                if (textNodes.length === 2 && (textNodes[0] + textNodes[1]).length < 1) {
                    weapons.push(randomShoot(flagship))
                    break
                } else {
                    weapons.push(setMissionOrder(
                        flagship.insertBefore(
                            doc.createTextNode(''),
                            trainee
                        )
                    ))
                }
            }
            if (text.length > 0) {
                flagship.insertBefore(
                    doc.createTextNode(text),
                    trainee
                )
            }
        }
        flagship.removeChild(trainee)
    }

    /**
     * Set a random value to the node
     * @param {Node} ship The node
     */
    function randomShoot (ship) {
        return function any (value) {
            switch (typeof value) {
                case 'string':
                    ship.innerHTML = value
                    break
                case 'number':
                case 'boolean':
                    ship.textContent = value
                default:
                    if (Array.isArray(value)) {
                        any(populateFragment(
                            document.createDocumentFragment(),
                            value
                        ))
                    } else {
                        populateShip(ship, value)
                    }
                    break
            }
        }
    }

    /**
     * Set an attribute of a Node element
     * @param {Node} aircraft
     * @param {String} attribute
     */
    function setWeapon (aircraft, attribute) {
        const name = attribute.name
        const isListener = name.indexOf('on') === 0

        if (isListener) {
            aircraft.removeAttribute(attribute)
            return function event (value) {
                aircraft[name] = value
            }
        }
        return function attr (value) {
            attribute.value = value
        }
    }

    /**
     * Set the textContent of a Node
     * @param {Node} ship
     */
    function setMissionOrder (ship) {
        return text => {
            ship.textContent = text
        }
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
            case 11:
                if (!twin(ship.childNodes, traine.childNodes)) {
                    rmRf(ship, trainee)
                }
                break
            case 1:
                const childNodes = ship.childNodes
                if (childNodes !== 1 || childNodes[0] !== trainee) {
                    rmRf(ship, trainee)
                }
                break
            case 3:
                ship.textContent = trainee.textContent
                break
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
    
    /**
     * Update the template - The template has been cached and this function modifies the DOM only if necessary
     * @param {Array} templates
     */
    function update (templates) {
        const updates = this[LOVE].updates
        const html = [ templates[0] ]

        for (let i = 1; i < templates.length; i++) {
            const any = arguments[i]
            updates[i - 1](any)
            html.push(any, templates[i])
        }
        return html.join('')
    }

    /**
     * Upgrade the template - The template has been cached, this function refreshes its data (attributes, children, text)
     * @param {*} templates 
     */
    function upgrade (templates) {
        const updates = []
        const html = [ templates[0] ]

        for (let i = 1; i < templates.length; i++)
            html.push(UID, templates[i])
        this.innerHTML = html.join('')
        aircraftCarrier(this, updates)
        this[LOVE] = {
            templates,
            updates
        }
        return update.apply(this, arguments)
    }

	return function Maverick (templates) {
        if (LOVE in this && this[LOVE].templates === templates)
            return update.apply(this, arguments)
        return upgrade.apply(this, arguments)
    }

})()
