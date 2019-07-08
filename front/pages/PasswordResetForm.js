const PasswordResetForm = (() => {
    const data = {
        email: {
            name: 'email',
            value: '',
            placeholder: 'Adresse mail'
        }
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
            .catch(() => {})
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

    return new Page('Camagru - Mot de passe oublié', data, h)

})()
