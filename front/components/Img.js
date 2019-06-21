function Img (props) {
	const WIDTH = 150
	const MIN_TIMEOUT = 1000

	const render = Maverick.link(props)

	if (!props.loaded && !props.isLoading) {
		console.log('hi')
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

	return render`
		<img
				src="${ props.src }"

				style="${ 'width: ' + WIDTH + 'px' }"
				class="${ 'rounded-lg hover:shadow-lg transition bg-grey-light ' + (!props.loaded ? 'blur' : '') }"
		>
	`
}
