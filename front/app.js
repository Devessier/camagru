/* LAST */

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
