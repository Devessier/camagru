'use strict';

loadScript([ 'core/maverick.js' ])
	.then(() => {
        loadScript([ 'core/observer/dep.js', 'core/observer/index.js', 'core/components/index.js', 'core/components/page.js', 'core/router/index.js' ])
            .then(() => {
                loadScript([ 'pages/Home.js', 'pages/404.js' ])
                    .then(() => {

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
                    })
            })
	})
