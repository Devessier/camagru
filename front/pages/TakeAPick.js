const TakeAPick = (() => {

	const WIDTH = 640
	const HEIGHT = 480

	const data = {
		filters: [
			{
				name: 'Vue.js',
				path: 'https://vuejs.org/images/logo.png',
				width: 200,
				height: 200
			},
			{
				name: 'PHP is perfect',
				path: 'https://whydoesitsuck.com/why-does-php-suck/thumbnail.png',
				width: 300,
				height: 300
			},
			{
				name: 'PHP is perfect',
				path: 'https://whydoesitsuck.com/why-does-php-suck/thumbnail.png',
				width: 300,
				height: 300
			},
			{
				name: 'PHP is perfect',
				path: 'https://whydoesitsuck.com/why-does-php-suck/thumbnail.png',
				width: 300,
				height: 300
			}
		],
		filter: {
			path: '',
			name: '',
			width: 0,
			height: 0,
			position: {
				x: 0,
				y: 0,
				startX: 0,
				startY: 0
			},
			block: false
		},
		photo: {
			url: ''
		},
		file: '',
		toast: {
			title: '',
			text: '',
			open: undefined,
			hide: true
		}
	}

	function take (props) {
		const canvas = document.getElementById('canvas')
		const image = document.getElementById('video')

		canvas.getContext('2d').drawImage(image, 0, 0, WIDTH, HEIGHT)
		props.photo.url = canvas.toDataURL('image/png')
		props.filter.block = true
	}

	function cancel (props) {
		props.filter = {
			path: '',
			name: '',
			width: 0,
			height: 0,
			position: {
				x: 0,
				y: 0,
				startX: 0,
				startY: 0
			},
			block: false
		}
		props.photo.url = '' 
	}

	function pick (props) {
		if (data.filter.block)
			return
		data.filter.path = props.path
		data.filter.name = props.name
		data.filter.width = props.width
		data.filter.height = props.height
	}

	function triggerUploadInput () {
		const input = document.getElementById('upload')
		if (input) {
			input.click()
		}
	}

	/**
	 * Test whether the File instance is correct and can be upload
	 * @param {File} file
	 * @returns {boolean}
	 */
	function isValidFile (file) {
		return true
	}

	function upload (e, props) {
		const input = e.target
		if (input) {
			const file = input.files[0]

			if (isValidFile(file)) {
				const reader = new FileReader
				props.file = file
				props.filter.block = true

				reader.onload = (e) => {
					props.photo.url = e.target.result
				}
				reader.readAsDataURL(file)
			} else {
				$toast(props, 'Fichier incorrect', 'Le fichier sélectionné ne peut être utilisé')
			}

			console.log('upload', props, file)
		}
	}

	function stackableImage (h, props, index) {
		return h`
			<figure style="width: 200px">
				<img
						src="${ props.path }"
						style="object-fit: contain; height: 100px; width: 200px"
						onclick="${ pick.bind(this, props) }"
				/>
				<figcaption class="text-center">${ props.name }</figcaption>
			</figure>
		`
	}

	function button (h, props) {
		return !props.photo.url ?
			h`
				<input
						id="upload"
						type="file"
						accept="image/*"
						class="hidden"
						onchange="${ (e) => { upload(e, props) } }"
				/>
				<button
						onclick="${ triggerUploadInput }"
						class="${ 'p-5 mr-1 rounded-full text-white shadow ' + (props.filter.path ? 'bg-purple-light' : 'bg-grey') }"
				>
					<svg class="w-8 h-8 xl:w-10 xl:h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
				</button>
				<button
						onclick="${ () => { take(props) } }"
						class="${ 'p-5 ml-1 rounded-full text-white shadow ' + (props.filter.path ? 'bg-purple-light' : 'bg-grey') }"
				>
					<svg class="w-8 h-8 xl:w-10 xl:h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
				</button>
			` :
			h`
				<button
						onclick="${ () => { cancel(props) } }"
						class="px-3 py-2 rounded text-white bg-purple-light"
				>
					Annuler
				</button>
			`
	}

	let rect
	let diff = {
		x: 0,
		y: 0
	}

	function handleMouseDown (event, props) {
		if (props.filter.block)
			return
		if (!rect)
			rect = document.getElementById('eh').getBoundingClientRect()
		diff.x = event.clientX - rect.left - props.filter.position.x | 0
		diff.y = event.clientY - rect.top - props.filter.position.y | 0
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)
	}

	function handleMouseMove (event) {
		if (data.filter.block)
			return

		const x = event.clientX - rect.left - diff.x | 0
		const y = event.clientY - rect.top - diff.y | 0

		if (x < 0)
			data.filter.position.x = 0
		else if ((x + data.filter.width) > rect.width)
			data.filter.position.x = rect.width - data.filter.width
		else
			data.filter.position.x = x

		if (y < 0)
			data.filter.position.y = 0
		else if ((y + data.filter.height) > rect.height)
			data.filter.position.y = rect.height - data.filter.height
		else
			data.filter.position.y = y
	}

	function handleMouseUp () {
		window.removeEventListener('mousemove', handleMouseMove)
	}

	function resizeDown (props, event) {
		event.preventDefault()
		window.addEventListener('mousemove', resizeMove)
		window.addEventListener('mouseup', resizeUp)
	}

	function resizeMove (e) {
		if (!rect)
			rect = document.getElementById('eh').getBoundingClientRect()

		const width = e.clientX - rect.left | 0
		const height = e.clientY - rect.top | 0

		console.log(width, height)

		const size = width > height ? width : height

		if (data.filter.position.x + size <= rect.width
			&& data.filter.position.y + size <= rect.height) {
			data.filter.width = size
			data.filter.height = size
		}
	}

	function resizeUp () {
		window.removeEventListener('mousemove', resizeMove)
	}

	function render (h, props) {
		console.log(props.filter, props.filter.block || !Number.isInteger(props.filter.height))
		const style = (props.filter && props.filter.position && ('transform: translate3d(' + props.filter.position.x + 'px,' + props.filter.position.y + 'px, 0px)')) || false

		return h`
			<section class="flex flex-col items-center">
				<header class="flex justify-center items-center my-6">
					<h2 class="text-3xl">Prise de photographie</h2>
				</header>

				<section class="flex flex-col items-center" style="width: 640px">
					<article
							id="eh"

							class="h-full w-full relative"
							style="height: 480px; background: linear-gradient(to right, #9796f0, #fbc7d4);"
					>
						<video width="640" height="480" id="video" class="${ 'max-w-full ' + (props.photo.url ? 'hidden' : 'rounded') }"></video>
						<img id="photo" class="${ props.photo.url ? 'h-full w-full rounded flash' : 'hidden' }" src="${ props.photo.url }" />

						<div
								class="${ props.filter ? 'absolute pin-t pin-l' : 'hidden' }"
								style="${ style }"
						>
							<div class="h-full w-full relative">
								<img
										src="${ props.filter && props.filter.path }"

										ondragstart="${ () => false }"
										onmousedown="${ e => { handleMouseDown(e, props) } }"

										width="${ props.filter.width + 'px' }"
										height="${ props.filter.height + 'px' }"
								/>

								<div
										class="${ (props.filter.block || !props.filter.height) ? 'hidden' : 'absolute' }"
										style="transform: rotate(90deg); bottom: -10px; right: -10px"

										onmousedown="${ resizeDown.bind(null, props) }"
								>
									<svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
								</div>
							</div>
						</div>
					</article>

					<div class="${ props.filter.block ? 'hidden' : 'overflow-auto overflow-y-hidden w-full relative' }" style="height: 140px;">
						<aside class="flex justify-start items-center absolute">${
							props.filters.map((filter, index) => stackableImage(Maverick.link(filter), filter, index))
						}</aside>
					</div>

					<footer class="mt-5">${ button(Maverick.link(), props) }</footer>

					<canvas width="640" height="480" id="canvas" class="hidden"></canvas>
				</section>
			</section>
		`
	}

	return new Page('Camagru - Prise de Photographie optimisée pour Internet Explorer 6', data, render, {
		created: function created () {
			if (!this.state._stream) {
				navigator.mediaDevices.getUserMedia({
					video: true
				})
					.then((stream) => {
						const video = document.getElementById('video')
						this.state._stream = stream
						video.srcObject = stream
						video.onloadedmetadata = video.play
					})
					.catch(() => {
						$toast(this.state, 'Caméra', 'Une erreur est survenue lors du lancement de la caméra', 2e3)
					})
			}
		},
		bye: function bye () {
			const video = document.getElementById('video')
			video && (video.src = '')
		}
	})

})()
