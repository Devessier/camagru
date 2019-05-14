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
		data.filter.path = props.path
		data.filter.name = props.name
		data.filter.width = props.width
		data.filter.height = props.height
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
			<button
					onclick="${ () => { take(props) } }"
					class="p-5 bg-purple-light rounded-full text-white shadow"
			>
				<svg class="w-8 h-8 xl:w-10 xl:h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
			</button>
		` : h`
			<button
					onclick="${ () => { cancel(props) } }"
					class=""
			>
				Annuler
			</button>
		`
	}

	let move = false

	let rect
	let diff = {
		x: 0,
		y: 0
	}

	function handleMouseDown (e, props) {
		if (props.filter.block)
			return
		if (!rect)
			rect = document.getElementById('eh').getBoundingClientRect()
		diff.x = e.clientX - rect.left - props.filter.position.x | 0
		diff.y = e.clientY - rect.top - props.filter.position.y | 0
		move = true
	}

	function handleMouseMove (e, props) {
		if (!move || props.filter.block)
			return

		const x = e.clientX - rect.left - diff.x | 0
		const y = e.clientY - rect.top - diff.y | 0

		if (x < 0)
			props.filter.position.x = 0
		else if ((x + props.filter.width) > rect.width)
			props.filter.position.x = rect.width - props.filter.width
		else
			props.filter.position.x = x

		if (y < 0)
			props.filter.position.y = 0
		else if ((y + props.filter.height) > rect.height)
			props.filter.position.y = rect.height - props.filter.height
		else
			props.filter.position.y = y
	}

	function handleMouseUp () {
		move = false
	}

	function render (h, props) {
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
						<video width="640" height="480" id="video" class="${ props.photo.url ? 'hidden' : 'rounded' }"></video>
						<img id="photo" class="${ props.photo.url ? 'h-full w-full rounded flash' : 'hidden' }" src="${ props.photo.url }" />

						<img
								src="${ props.filter && props.filter.path }"
								class="${ props.filter ? 'absolute pin-t pin-l' : 'hidden' }"
								style="${ style }"

								ondragstart="${ () => false }"
								onmousemove="${ e => { handleMouseMove(e, props) } }"
								onmouseup="${ handleMouseUp.bind(null, props) }"
								onmousedown="${ e => { handleMouseDown(e, props) } }"

								width="${ props.filter.width + 'px' }"
								height="${ props.filter.height + 'px' }"
						/>
					</article>

					<div class="overflow-auto overflow-y-hidden w-full relative" style="height: 140px;">
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
					.catch((err) => {
						$toast(this.state, 'Caméra', 'Une erreur est survenue lors du lancement de la caméra', 2e3)
					})
			}
		},
		bye: function bye () {
			const video = document.getElementById('video')
			video && (video.src = '')
			this.state.photo.url = ''
		}
	})

})()
