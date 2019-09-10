function Img (props, options) {
	const WIDTH = 150
	const MIN_TIMEOUT = 1000

	const height = options.height || '100px'
	const marginRight = options.marginRight || '0'
	const objectFit = options.objectFit

	const render = Maverick.link(props)

	if (!props.loaded && !props.isLoading) {
		const image = new Image
		const src = 'http://localhost:8001/' + props.path

		image.onload = (e) => {
			setTimeout(() => {
				props.isLoading = false
				props.loaded = true
				props.src = src
			}, MIN_TIMEOUT)
		}

		image.src = src
		props.isLoading = true
		props.loaded = false

		props.src = 'http://localhost:8001/public/images/preview.png'
	}

	const cssClasses = 'rounded-lg hover:shadow-lg transition bg-grey-light' + (!props.loaded ? ' blur' : '') + (' ' + objectFit || '')

	return render`
		<img
				src="${ props.src }"

				style="${ 'width: ' + WIDTH + 'px; height: ' + height + '; margin-right: ' + marginRight }"
				class="${ cssClasses.trim() }"
		>
	`
}
