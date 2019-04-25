/* LAST */

const GLOBAL_STATE = {
    user: 'lol'
}

function layout (render, props) {
    render`
    <nav class="flex items-center justify-between bg-grey-light px-12 py-4 mb-4">
        <h1><a href="/">Camagru</a></h1>
        <div>${ (props.user && props.user.logguedIn) ? 'Loggued in' : 'Sign up' }</div>
    </nav>
    <main>${ props.page(Maverick.create(), props) }</main>`
}

const router = new Router([
    {
        name: 'Index',
        path: /^\/?$/,
        component: Home
    },
    {
        name: '404',
        path: /.*/,
        component: _404
    }
])

setTimeout(() => {
    router.push('a fgadfg adf gadfg ')
    setTimeout(() => {
        router.push('/')
    }, 7000)
}, 1000)
