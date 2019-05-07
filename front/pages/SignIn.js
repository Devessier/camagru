const SignIn = (() => {

    const data = {
        inputs: [
            {
                placeholder: "Nom d'utilisateur",
                value: ''
            },
            {
                placeholder: 'Mot de passe',
                value: '',
                password: true
            }
        ],
        onclick: () => {
            const username = data.inputs[0].value
            const password = data.inputs[1].value

            data.inputs[0].value = ''
            data.inputs[1].value = ''
            data.loading = true

            fetch('http://localhost:8001/sign-in', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .then((res) => {
                    if (res.error) {
                        data.error = true
                        data.error = res.message
                        data.inputs[0].value = username
                    } else {
                        data.error = false
                        data.message = res.message
                        GLOBAL_STATE.user = res.user
                        GLOBAL_STATE.user.logguedIn = true
                    }
                })
                .catch((err) => {
                    data.error = true
                    data.error = err
                    data.inputs[0].value = username
                })
                .finally(() => {
                    data.loading = false
                })
        },
        signin: true,
        message: '',
        error: false,
        loading: false
    }

    function render (h, props) {
        return SignOnComponent(h, props)
    }

    return new Page('Camagru - Connexion', data, render)

})()
