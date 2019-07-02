function ClosableImage (props, options) {
    const render = Maverick.link(options)

    const onClose = options.onClose || (() => {})

    return render`
        <div style="width: 150px; height: 100px" class="relative mr-1">
            <div>${
                Img(props, options)
            }</div>
            <button
                    class="absolute pin-t pin-r rounded-full pa-2 bg-grey-darker w-6 h-6 flex justify-center items-center"
                    onclick="${ onClose }"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-line join="round" class="feather feather-x w-4 h-4 text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    `
}
