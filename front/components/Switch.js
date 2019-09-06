
/**
 * Switch is a switch component.
 * props must have a **ref** property which is not a primitive to prevent re-renderings.
 * @param {Object} props 
 */
function Switch (props) {
	const render = Maverick.link(props.ref)

	function onclick () {
		props.value = this.checked
	}

	return render`
		<label
				class="${ 'switch-container py-2 px-1 w-12 h-6 rounded-full border-grey-light cursor-pointer flex ' + (props.value === true ? 'switch-on' : 'switch-off') }"
		>
			<input
					type="checkbox"
					checked="${ props.value }"
					onclick="${ onclick }"
					class="absolute w-0 h-0 opacity-0 pointer"
			/>
			<div class="switch h-full flex items-center"></div>
		</label>
	`
}
