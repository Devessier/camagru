const TakeAPick = (() => {

	const WIDTH = 640
	const HEIGHT = 480

	const POST_COMMENT_MAX = 120

	const data = {
		_stream: undefined,
		loadingFilters: true,
		filters: [],
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
		upload: '',
		photo: {
			url: ''
		},
		upload: '',
		message: {
			value: ''
		},
		takenPhotos: [],
		toast: {
			title: '',
			text: '',
			open: undefined,
			hide: true
		},
		navigatorWidthFactor: 0
	}

	let ehElement
	let rect

	function updateFilterFactor () {
		const width = window.innerWidth

		data.navigatorWidthFactor = (width >= 640) ? 1 : (width / 640)

		const oldRect = rect

		if (!ehElement) ehElement = document.getElementById('eh')

		if (ehElement) rect = ehElement.getBoundingClientRect()
		else return

		if (data.filter.block === true && oldRect) {
			data.filter.position.x *= rect.width / oldRect.width
			data.filter.position.y *= rect.height / oldRect.height

			return
		}

		if (data.filter.position.x + data.filter.width * data.navigatorWidthFactor > rect.width)
			data.filter.position.x = rect.width - data.filter.width * data.navigatorWidthFactor
		if (data.filter.position.y + data.filter.height * data.navigatorWidthFactor > rect.height)
			data.filter.position.y = rect.height - data.filter.height * data.navigatorWidthFactor
	}

	function take (props) {
		if (props.upload !== '') {
			props.filter.block = true
			return
		}

		const canvas = document.getElementById('canvas')
		const image = document.getElementById('video')

		canvas.getContext('2d').drawImage(image, 0, 0, WIDTH, HEIGHT)
		props.photo.url = canvas.toDataURL('image/jpeg', .8)
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
		props.upload = ''
		props.message.value = ''
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

				reader.onload = (e) => {
					props.upload = e.target.result

					setTimeout(updateFilterFactor, 0)
				}
				reader.readAsDataURL(file)
			} else {
				$toast(props, 'Fichier incorrect', 'Le fichier sélectionné ne peut être utilisé')
			}
		}
	}

	function send (props) {
		if (!(props.filter.block && (props.photo.url || props.upload) && props.message.value !== '')) return

		const form = new FormData

		form.append('filter.name', props.filter.name)
		form.append('filter.width', props.filter.width)
		form.append('filter.height', props.filter.height)
		form.append('filter.x', props.filter.position.x)
		form.append('filter.y', props.filter.position.y)
		form.append('message', props.message.value)

		if (props.upload) form.append('file', props.upload)
		else form.append('photo', props.photo.url)

		fetch('http://localhost:8001/post/add/' + (Boolean(props.upload) ? 'file' : 'photo'), {
			method: 'POST',
			body: form,
			credentials: 'include'
		})
			.then(res => res.json())
			.then((res) => {
				if (res.error === true || res.message !== undefined) throw new Error('An error occured')

				props.takenPhotos.push(
					Object.assign(
						res,
						{ loaded: false, isLoading: false, src: '' }
					)
				)

				$toast(data, 'Nouvelle photo', 'Votre photo a été ajoutée à la galerie')
			})
			.catch(() => {
				$toast(data, 'Erreur', "Une erreur s'est produite")
			})
		
		cancel(props)
	}

	function filters (props) {
		const render = Maverick.link(props.filters)
		const wait = props.loadingFilters || props.filters.length === 0

		if (wait) {
			return render`
				<aside class="flex justify-center items-center">
					<p>${
						props.loadingFilters ? 'Chargement des filtres ...' : 'Pas de filtres disponibles'
					}</p>
				</aside>
			`
		}
		return render`
			<aside class="flex justify-start items-center absolute">${
				props.filters.map((filter, index) => stackableImage(Maverick.link(filter), filter, index))
			}</aside>
		`
	}

	function stackableImage (render, props, index) {
		return render`
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

	function button (render, props) {
		const takePhotoDisabled = (props._stream === undefined && !props.upload) || !props.filter.path 
		const uploadFileDisabled = data.filter.block
		const sendPostDisabled = props.message.value === '' || props.message.value.length > POST_COMMENT_MAX

		if (!props.filter.block) {
			return render`
				<input
						id="upload"
						type="file"
						accept="image/png, image/jpeg"
						class="hidden"
						onchange="${ (e) => { upload(e, props) } }"
				/>
				<button
						disabled="${ uploadFileDisabled }"
						onclick="${ triggerUploadInput }"
						class="${ 'p-5 mr-1 rounded-full border shadow transition ' + (uploadFileDisabled ? 'text-grey border-grey cursor-not-allowed' : 'text-purple-light border-purple-light cursor-pointer') }"
				>
					<svg class="w-8 h-8 xl:w-10 xl:h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
				</button>
				<button
						disabled="${ takePhotoDisabled }"
						onclick="${ () => { take(props) } }"
						class="${ 'p-5 ml-1 rounded-full text-white shadow transition ' + (takePhotoDisabled ? 'bg-grey cursor-not-allowed' : 'bg-purple-light cursor-pointer') }"
				>
					<svg class="w-8 h-8 xl:w-10 xl:h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
				</button>
			`
		}
		return render`
			<button
					onclick="${ () => { cancel(props) } }"
					class="px-3 py-2 mr-1 rounded text-purple-light border border-purple-light"
			>
				Annuler
			</button>
			<button
					disabled="${ sendPostDisabled }"
					onclick="${ () => { send(props) } }"
					class="${ 'px-3 py-2 ml-1 rounded text-white transition ' + (sendPostDisabled ? 'bg-grey' : 'bg-purple-light') }"
			>
				Envoyer
			</button>
		`
	}

	let diff = {
		x: 0,
		y: 0
	}

	function handleMouseDown (event) {
		if (data.filter.block)
			return

		let x, y

		if (window.TouchEvent && event instanceof window.TouchEvent) {
			const touchLocation = event.targetTouches[0]

			x = touchLocation.pageX
			y = touchLocation.pageY
		} else {
			x = event.clientX
			y = event.clientY
		}

		if (!rect) rect = document.getElementById('eh').getBoundingClientRect()

		diff.x = x - rect.left - data.filter.position.x | 0
		diff.y = y - rect.top - data.filter.position.y | 0

		if (!(window.TouchEvent && event instanceof window.TouchEvent)) {
			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)
		}
	}

	function handleMouseMove (event) {
		if (data.filter.block)
			return

		let x, y

		if (window.TouchEvent && event instanceof window.TouchEvent) {
			const touchLocation = event.targetTouches[0]

			x = touchLocation.pageX
			y = touchLocation.pageY
		} else {
			x = event.clientX
			y = event.clientY
		}

		const computedX = x - rect.left - diff.x | 0
		const computedY = y - rect.top - diff.y | 0

		if (computedX < 0)
			data.filter.position.x = 0
		else if ((computedX + data.filter.width * data.navigatorWidthFactor) > rect.width)
			data.filter.position.x = rect.width - data.filter.width * data.navigatorWidthFactor
		else
			data.filter.position.x = computedX

		if (computedY < 0)
			data.filter.position.y = 0
		else if ((computedY + data.filter.height * data.navigatorWidthFactor) > rect.height)
			data.filter.position.y = rect.height - data.filter.height * data.navigatorWidthFactor
		else
			data.filter.position.y = computedY
	}

	function handleMouseUp () {
		window.removeEventListener('mousemove', handleMouseMove)
	}

	function resizeDown () {
		window.addEventListener('mousemove', resizeMove)
		window.addEventListener('mouseup', resizeUp)
	}

	function resizeMove (event) {
		if (!rect) rect = document.getElementById('eh').getBoundingClientRect()

		let x,y 

		if (window.TouchEvent && event instanceof window.TouchEvent) {
			const touchLocation = event.targetTouches[0]

			x = touchLocation.pageX
			y = touchLocation.pageY
		} else {
			x = event.clientX
			y = event.clientY
		}

		x -= rect.left
		y -= rect.top

		const diffX = (x - (data.filter.position.x + data.filter.width))  | 0
		const diffY = (y - (data.filter.position.y + data.filter.height)) | 0

		const maxDiff = diffX > diffY ? diffX : diffY

		const possibleSize = data.filter.width + maxDiff

		if (data.filter.position.x + possibleSize <= rect.width
			&& data.filter.position.y + possibleSize <= rect.height) {
			data.filter.width = possibleSize * data.navigatorWidthFactor
			data.filter.height = possibleSize * data.navigatorWidthFactor
		}
	}

	function resizeUp () {
		window.removeEventListener('mousemove', resizeMove)
	}

	function aside (step, render, props) {
		const disabled = props.message.value === '' || props.message.value.length > POST_COMMENT_MAX

		if (!(props._stream || props.upload)) {
			return render`
				<div class="flex justify-center items-center my-3">
					En attente du stream ou du téléchargement d'un fichier ...
				</div>
			`
		}
		if (step === 1) {
			return render`
				<div class="overflow-auto overflow-y-hidden w-full h-full relative" style="height: 140px">${
					filters(props)
				}</div>
			`
		}
		if (step === 2) {
			return render`
				<div class="mt-2">${
					InputCounter(props.message, {
						placeholder: 'Écrire un commentaire…',
						maximum: POST_COMMENT_MAX,
						onkeydown: e => { (e.keyCode === 13 && !disabled) && send(props) }
					})
				}</div>
			`
		}
	}

	function TakenPhotos (props) {
		const photos = props.takenPhotos
		const render = Maverick.link(photos)

		if (photos.length === 0) {
			return render`
				<p>
					Aucune photo n'a encore été prise
				</p>
			`
		}
		return render`
			<div class="overflow-auto overflow-y-hidden w-full h-full relative" style="height: 100px;">
				<aside class="flex justify-start items-center absolute">${
					photos.map((photo, index) => ClosableImage(photo, {
						marginRight: '5px',
						objectFit: 'object-contain',
						onClose: () => { deletePhoto(index) }
					}))
				}</aside>
			</div>
		`
	}

	function deletePhoto(index) {
		data.takenPhotos.splice(index, 1)
	}

	function render (render, props) {
		const style = (props.filter && props.filter.position && ('transform: translate3d(' + props.filter.position.x + 'px,' + props.filter.position.y + 'px, 0px)')) || false

		const imgSrc = props.photo.url || props.upload

		return render`
			<section class="flex flex-col items-center">
				<header class="flex justify-center items-center my-6">
					<h2 class="text-3xl">Prise de photographie</h2>
				</header>

				<section class="flex flex-wrap align-center" style="max-width: 640px">
					<article
							id="eh"

							class="w-full relative"
					>
						<video id="video" class="${ 'max-w-full ' + ((!props._stream || props.photo.url || props.upload) ? 'hidden' : 'rounded') }"></video>
						<img
								id="photo"
								src="${ imgSrc }"
								class="${ imgSrc ? 'h-full w-full rounded flash' : 'hidden' }"
								style="object-fit: contain"
						/>

						<div
								class="${ props.filter ? 'absolute pin-t pin-l' : 'hidden' }"
								style="${ style }"
						>
							<div class="h-full w-full relative" style="touch-action: none">
								<img
										src="${ props.filter && props.filter.path }"

										draggable="false"

										onmousedown="${ handleMouseDown }"

										ontouchstart.passive="${ handleMouseDown }"
										ontouchmove.passive="${ handleMouseMove }"

										width="${ props.filter.width * props.navigatorWidthFactor + 'px' }"
										height="${ props.filter.height * props.navigatorWidthFactor + 'px' }"
								/>

								<div
										class="${ (props.filter.block || !props.filter.height) ? 'hidden' : 'absolute' }"
										style="transform: rotate(90deg); bottom: -10px; right: -10px"

										onmousedown.prevent="${ resizeDown }"

										ontouchmove.passive="${ resizeMove }"
								>
									<svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
								</div>
							</div>
						</div>
					</article>

					<aside class="w-full">${
						aside(props.filter.block ? 2 : 1, Maverick.link(aside), props)
					}</aside>

					<footer class="flex justify-center w-full mt-5">${
						button(Maverick.link(button), props)
					}</footer>


					<footer class="flex justify-center items-center w-full mt-4 py-3">${
						TakenPhotos(props)
					}</footer>

					<canvas width="640" height="480" id="canvas" class="hidden"></canvas>
				</section>
			</section>
		`
	}

	return new Page('Camagru - Prise de Photographie optimisée pour Internet Explorer 6', data, render, {
		created: function created () {
			if (data.filters.length === 0) {
				fetch('http://localhost:8001/filters/all')
					.then(res => res.json())
					.then((filters) => {
						if (!Array.isArray(filters)) {
							throw new Error('This is not an arrayyyyy')
						}

						Promise.all(
							filters.map((filter) => loadImage(filter))
						)
							.then((filters) => {
								data.filters = filters.map((filter) => Object.assign(
									filter,
									{
										width: +filter.width,
										height: +filter.height
									}
								))
								data.loadingFilters = false
							})
							.catch(() => {
								data.loadingFilters = false
							})
					})
					.catch(() => {
						data.loadingFilters = false
					})
			}

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
						$toast(this.state, 'Caméra', "La caméra n'a pas pu être lancée", 2e3)
					})
			}

			updateFilterFactor()
			window.addEventListener('resize', updateFilterFactor, { passive: true })
		},
		bye: function bye () {
			const video = document.getElementById('video')
			video && (video.src = '')
			window.removeEventListener('resize', updateFilterFactor)
		}
	})

})()
