const PasswordResetForm = (() => {
    const data = {
        email: {
            name: 'email',
            value: '',
            placeholder: 'Adresse mail'
        },
        message: '',
        error: false
    }

    function resetPassword () {
        fetch('http://localhost:8001/password-reset', {
            method: 'POST',
            body: JSON.stringify({
                email: data.email.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((response) => {
                if (response.error || !response.done) {
                    throw new Error('An error occured')
                }
                data.message = "Nous avons envoyé un email à l'adresse " + data.email.value + '.'
                data.email.value = ''
            })
            .catch(() => {
                data.message = "Une erreur s'est produite, veuillez réessayer ultérieurement"
                data.error = true
            })
    }

    function h (render, props) {
        return render`
            <div class="flex justify-center items-center">
                <section class="flex flex-col items-center py-3 px-4 mt-8 bg-grey-lighter rounded shadow">
                    <header class="flex flex-col items-center">
                        <h2>
                            Réinitialisation du mot de passe
                        </h2>

                        <p class="mt-2">
                            Saisissez votre adresse mail
                        </p>

                        <p class="${ (props.error ? 'text-red' : '') + ' ' +  (props.message ? 'block' : 'hidden') + ' mt-2 text-sm font-thin' }">${
                            props.message
                        }</p>
                    </header>

                    <article class="py-3">${
                        inputComponent(Maverick.link(props.email), props.email)
                    }</article>

                    <footer class="flex justify-center items-center mt-2">
                        <button
                                class="px-2 py-1 text-white bg-purple-light hover:bg-purple rounded hover:shadow short-transition"
                                onclick="${ resetPassword }"
                        >
                            Réinitialiser
                        </button>
                    </footer>
                </section>
            </div>
        `
    }

    return new Page('Camagru - Mot de passe oublié', data, h, {
        bye: function bye () {
            data.message = ''
            data.error = false
        }
    })

})()
