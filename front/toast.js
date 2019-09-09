function toast (h, props) {
	const classes = 'flex justify-between items-center max-w-full md:mr-6 px-5 py-3 bg-purple-dark text-white rounded shadow-md absolute'

	return props.toast ? h`
		<div class="${ 'fixed pin-t pin-r justify-center md:justify-end items-center w-full ' + (props.toast.hide ? 'hidden' : 'flex') }">
			<div
					id="toast"
					class="${ classes + ' ' + (props.toast.open ? 'toast-enter' : 'toast-leave') }"

					onanimationend="${ (event) => {
						if (event.animationName === 'slideout') {
							props.toast.hide = true
						}
					} }"
			>
				<div class="flex flex-col items-stretch justify-center w-64">
					<h3 class="mb-2">${ props.toast.title || '' }</h3>
					<p>${ props.toast.text || '' }</p>
				</div>

				<button
						onclick="${ () => { $toastClose(props) } }"
						class="ml-4"
				>
					<svg
							class="text-white"
							xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				</button>
			</div>
		</div>
	` : ''
}

function $toast (props, title, text, timeout) {
	if (typeof timeout !== 'number' || timeout < 0)
		timeout = 3000
	props.toast.hide = false
	props.toast.title = title
	props.toast.text = text
	props.toast.open = true

	clearTimeout(props.toast._timeoutID)

	props.toast._timeoutID = setTimeout(() => {
		props.toast.open = false
	}, timeout)
}

function $toastClose (props) {
	clearTimeout(props.toast._timeoutID)
	props.toast.open = false
}
