'use strict';

loadScript([ 'core/maverick.js', 'core/observer/dep.js', 'core/observer/index.js', 'core/components/index.js', 'core/components/page.js', 'core/router/index.js' ])
	.then(() => {

        const page = new Page('test', {}, (render) => {
            render`<aside>
                LOL !
            </aside>
            `
        })

        const page2 = new Page('test2', {}, (render) => {
            render`<p>
                EHEHEHEHEHEH
            </p>`
        })

        const page404 = new Page('Page Not Found', {}, (render) => {
            render`<p>
                Page not found !
            </p>`
        })

        const router = new Router([
            {
                name: 'Index',
                path: /^\/$/,
                component: page
            },
            {
                name: 'Eheh',
                path: /^\/eheh\/?$/,
                component: page2
            },
            {
                name: '404',
                path: '.*',
                component: page404
            }
        ])

        setTimeout(() => {
            router.push('/eheh')
            setTimeout(() => {
                router.push('afd gahdfj gk')
            }, 2000)
        }, 2000)

	})
