'use strict';

loadScript([ 'core/maverick.js', 'core/component.js' ])
	.then(() => {
        const root = Maverick.bind(document.body)

        function click (event) {
            console.log('clicked', event)
        }

        function update(render, props) {
            render`<div>
                <h1 onclick="${click}">${props.message}</h1>
                <h2>It is ${new Date().toLocaleTimeString()}.</h2>
            </div>`
        }

        const state = {
            message: 'watch me !',
            test: 'YOLOOOOOO'
        }

        const test = new MaverickComponent('Test', root, state, update)

        setTimeout(() => {
            state.message = 'EHEH SUPRISE'
        }, 3000)

        test.render()
	})
