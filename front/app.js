'use strict';

loadScript([ 'core/maverick.js', 'core/observer/dep.js', 'core/observer/index.js', 'core/component.js', ])
	.then(() => {

        const state = {
            message: 'watch me !',
            test: 'YOLOOOOOO',
            array: [
                {
                    text: 'WILL THIS WORK ?'
                }
            ]
        }

        function input (event) {
            state.message = event.target.value
        }

        function update(render, props) {
            render`<div>
            <p>Salut !</p>
            <ul>${props.array.map(el => Maverick.create()`<li>${el.text}</li>`)}</ul>
            </div>`
        }

        const test = new MaverickComponent('#aside1', state, update)
        
        const test2 = new MaverickComponent('#aside2', state, update)

        setTimeout(() => {
            state.array[0].text = 'Does it work ?'
            console.log(state)
        }, 2000)

        test.render()
        test2.render()
	})
