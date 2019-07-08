const PasswordReset = (() => {

    const data = {
        password: {
            value: '',
            password: true,
            visible: false,
            name: 'password',
            placeholder: 'Mot de passe'
        },
        message: '',
        error: false
    }

    function saveNewPassword () {
        const regex = /token=([\d\w-]+)/

        const result = regex.exec(window.location.search)
        if (result === null)
            return

        const token = result[1]

        fetch('http://localhost:8001/password/modify', {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                password: data.password.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((response) => {
                if (response.error !== undefined || response.done === false) {
                    throw new Error('Bad response')
                }
                data.message = 'Votre mot de passe à bien été modifié, vous pouvez désormais vous connecter avec celui-ci.'
            })
            .catch(() => {
                data.message = "Une erreur s'est produite, veuillez réeassayer ultérieurement"
                data.error = true
            })
    }

    function h (render, props) {
        return render`
            <div class="flex justify-center items-center">
                <section class="flex flex-col items-center py-3 px-4 mt-8 bg-grey-lighter rounded shadow">
                    <header class="flex flex-col items-center">
                        <h2>
                            Modification du mot de passe
                        </h2>

                        <p class="mt-2">
                            Saisissez votre nouveau mot de passe
                        </p>

                        <p class="${ (props.error ? 'text-red' : '') + ' ' +  (props.message ? 'block' : 'hidden') + ' mt-2' }">${
                            props.message
                        }</p>
                    </header>

                    <article class="py-3">${
                        inputComponent(Maverick.link(props.password), props.password)
                    }</article>

                    <footer class="flex justify-center items-center">
                        <button
                                class="px-2 py-1 bg-purple-light text-white rounded hover:shadow short-transition"
                                onclick="${ saveNewPassword }"
                        >
                            Enregistrer
                        </button>
                    </footer>
                </section>
            </div>
        `
    }

    return new Page('Camagru - Réinitialisation du mot de passe', data, h, {
        bye: function bye () {
            data.message = ''
            data.error = false
        }
    })

})()
