const _404 = (() => {

	function update (render) {
		return render`
			<h1 class="text-center py-2">Page not found !</h1>
		`
	}

	return new Page('404', {}, update)
})()
