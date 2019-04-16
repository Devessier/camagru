'use strict';

loadScript([ 'core/maverick.js', 'core/component.js', 'core/observer/index.js' ])
	.then(() => {

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

        const test = new MaverickComponent('Test', '#aside1', state, update)
        const test2 = new MaverickComponent('Test2', '#aside2', state, update)

        setTimeout(() => {
            state.message = 'FUCK MKERVABO'
        }, 3000)

        setInterval(() => test.render(), 1000)

        test.render()
        test2.render()

        const yolo = {
            lol: 'hi !',
            msg: {
                test: {
                    recursive: {
                        recursive: {
                            end: 'end'
                        }
                    }
                }
            }
        }
        
        const observer = new Observer(yolo)
        console.log(observer, yolo)

        yolo.msg.test.recursive.recursive.end = 'TEUB'
	})
