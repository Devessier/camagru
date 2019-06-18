const AuthenticatedHeader = (h) => (
    h`
        <a
                href="/me"
                onclick="${ router.click('/me') }"
                class="block sm:px-2 hover:underline text-white"
        >${
            GLOBAL_STATE.user.username
        }</a>
        <button
                title="Déconnexion"
                onclick="${ logout }"
                class="flex justify-center items-center ml-2 text-white"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
    `
)

const NotAuthenticatedHeader = (h) => (
    h`
        <a
                href="/sign-up"
                onclick="${ router.click('/sign-up') }"
                class="block sm:px-2 hover:underline text-white"
        >
            Inscription
        </a>
        <a
                href="/sign-in"
                onclick="${ router.click('/sign-in') }"
                class="block sm:px-2 hover:underline text-white"
        >
            Connexion
        </a>
    `
)

function layout (h, props) {
    const fn = isAuthenticated() ? AuthenticatedHeader : NotAuthenticatedHeader

    const headerRenderer = Maverick.link(fn)
    const pageRenderer = Maverick.link(props._page)
    const toastRenderer = Maverick.link(props.toast)

    return h`<nav class="flex flex-wrap items-center justify-between bg-purple-light px-3 md:px-12 py-4">
        <h1>
            <a href="/" onclick="${ router.click('/') }" class="font-semibold">
                <span class="block sm:hidden text-white">Cam</span>
                <span class="hidden sm:block text-white">Camagru</span>
            </a>
        </h1>
        <div class="sm:hidden">
            <button class="px-2 py-1 flex flex-col justify-center items-center border border-grey-darkest rounded" onclick="${ () => { GLOBAL_STATE.layout.menu.open ^= 1 } }">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="fill-current h-5 w-5"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
        </div>
        <div
                class="${ 'sm:flex flex-row justify-between items-center w-full sm:w-auto ' + (GLOBAL_STATE.layout.menu.open ? 'block' : 'hidden') }"
        >${
            fn(headerRenderer)
        }</div>
    </nav>
    <main>${
        props._page(pageRenderer, props)
    }</main>
    <aside>${
        toast(toastRenderer, props)
    }</aside>
    <footer>
        
    </footer>`
}
