function AuthenticatedHeader (h) {
	return h`<a href="/me" onclick="${ router.click('/me') }" class="block sm:px-2 hover:underline">${ GLOBAL_STATE.user.pseudo }</a>`
}

function NotAuthenticatedHeader (h) {
	return h`<a href="/sign-up" onclick="${ router.click('/sign-up') }" class="block sm:px-2 hover:underline">Inscription</a>
	<a href="/sign-in" onclick="${ router.click('/sign-in') }" class="block sm:px-2 hover:underline">Connexion</a>`
}

function layout (h, props) {
    const renderer = Maverick.create()

    h`<nav class="flex flex-wrap items-center justify-between bg-grey-light px-3 md:px-12 py-4 mb-4">
        <h1>
            <a href="/" onclick="${ router.click('/') }">
                <span class="block sm:hidden">Cam</span>
                <span class="hidden sm:block">Camagru</span>
            </a>
        </h1>
        <div class="sm:hidden">
            <button class="px-2 py-1 flex flex-col justify-center items-center border border-grey-darkest rounded" onclick="${ () => GLOBAL_STATE.layout.menu.open ^= 1 }">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="fill-current h-5 w-5"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
        </div>
        <div
                class="${ 'sm:flex flex-row justify-between items-center w-full sm:w-auto ' + (GLOBAL_STATE.layout.menu.open ? 'block' : 'hidden') }"
        >${ (GLOBAL_STATE.user && GLOBAL_STATE.user.logguedIn && GLOBAL_STATE.user.pseudo) ? AuthenticatedHeader(renderer) : NotAuthenticatedHeader(renderer) }</div>
    </nav>
    <main>${ props._page(Maverick.create(), props) }</main>`
}