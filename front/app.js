/* LAST */

const GLOBAL_STATE = {
    user: {},
    layout: {
        menu: {
            open: false
        }
    },
    avatar: 'https://api.adorable.io/avatars/128/adwabott@adorable.io.png'
}

let router

authenticate()
    .finally(() => {
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
                name: 'Me',
                path: /^\/me\/?$/,
                component: Me,
                beforeEnter: isAuthenticated
            },
            {
                name: 'MeEdit',
                path: /^\/me\/edit\/?$/,
                component: MeEdit,
                beforeEnter: isAuthenticated
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
