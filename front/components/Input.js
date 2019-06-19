/**
 * An InputCounter component :-)
 * @param {Object} props
 * @param {string} props.value The **value** property holds the content of the input
 * @param {Object} options
 * @param {number} [options.maximum=120] The max size of the input
 * @param {string} [options.placeholder] The placeholder for the input
 * @param {Function} [options.onkeydown] Handler to call when keydown event is triggered
 */
function InputCounter (props, options) {
    const h = Maverick.link(props)

    const maximum = options.maximum || 120
    const placeholder = options.placeholder || false
    const keydownHandler = options.onkeydown || (() => {})

    const count = props.value.length

    return h`
        <div>
            <input
                    placeholder="${ placeholder }"

                    value="${ props.value }"
                    oninput="${ e => { props.value = e.target.value } }"
                    onkeydown="${ keydownHandler }"

                    class="py-2 border-b w-full text-grey-darker font-light"
            />
            <div class="flex flex-col items-end mt-1 text-xs text-grey-darker font-thin">
                <div>
                <span class="${ count > maximum ? 'text-red' : '' }">${ count }</span> / <span>${ maximum }</span>
                </div>
            </div>
        </div>
    `
}
