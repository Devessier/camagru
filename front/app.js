/* LAST */

const GLOBAL_STATE = {
    user: {},
    layout: {
        menu: {
            open: false
        }
    }
}

let router

authenticate()
    .then(() => {
        router = new Router([
            {
                name: 'Index',
                path: /^\/?$/,
                component: Home
            },
            {
                name: 'SignUp',
                path: /^\/sign-up\/?$/,
                component: SignUp,
                beforeEnter: () => !isAuthenticated()
            },
            {
                name: 'SignIn',
                path: /^\/sign-in\/?$/,
                component: SignIn,
                beforeEnter: () => !isAuthenticated()
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
    })
