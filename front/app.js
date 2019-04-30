/* LAST */

const GLOBAL_STATE = {
    user: {},
    layout: {
        menu: {
            open: false
        }
    }
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

const GLOBAL_OBSERVER = Observer.apply(GLOBAL_STATE)
GLOBAL_OBSERVER.bind({
    id: Infinity,
    fn: router.refresh.bind(router)
})
