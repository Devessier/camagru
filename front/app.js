'use strict';

loadScript([ 'core/maverick.js', 'core/observer/dep.js', 'core/observer/index.js', 'core/components/index.js', 'core/components/page.js', 'core/router/index.js' ])
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
                }, 1000)

                console.log(router)
            })
	})
