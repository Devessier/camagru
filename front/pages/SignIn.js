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
            data.loading = true

            fetch('http://localhost:8001/sign-in', {
                method: 'POST',
                body: JSON.stringify({
                    username: data.inputs[0].value,
                    password: data.inputs[1].value
                }),
                credentials: 'include'
            })
                .then(res => res.json())
                .then((res) => {
                    if (res.error) {
                        data.error = true
                        data.error = res.message
                    } else {
                        data.error = false
                        data.message = res.message
                    }
                })
                .catch((err) => {
                    data.error = true
                    data.error = err
                })
                .finally(() => {
                    data.loading = false
                    console.log(data)
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
