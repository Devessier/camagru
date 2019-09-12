function inputComponent (render, props) {
    let eye
    if (props.visible !== undefined) {
        const render = Maverick.link(inputComponent)

        if (props.visible) {
            eye = render`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
        } else {
            eye = render`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        }
    }

    return render`
        <div class="flex w-64">
            <input
                    name="${ props.name || false }"
                    placeholder="${ props.placeholder }"
                    value="${ props.value }"
                    oninput="${ event => { props.value = event.target.value } }"
                    class="my-2 py-1 bg-transparent border-b-2 border-grey-light hover:border-purple-lighter focus:border-purple short-transition flex-grow"
                    type="${ (props.password && !props.visible) ? 'password' : 'text' }"
            />
            <div
                    onclick="${ props.visible !== undefined && (() => { props.visible ^= 1 }) }"
                    class="flex justify-center items-center cursor-pointer"
            >${
                props.visible !== undefined ? eye : ''
            }</div>
        </div>
    `
}

function SignOnComponentFooter (render, props) {
    return props.signin ?
        render`
            <a
                    href="/sign-up"
                    onclick="${ router.click('/sign-up') }"
                    class="text-black"
            >Inscription</a>
            <button
                    onclick="${ props.onclick }"
                    class="px-2 py-1 text-white bg-purple-light hover:bg-purple rounded short-transition"
            >Me connecter</button>
            <button
                    onclick="${ router.click('/password-reset/form') }"
                    class="w-full mt-2 underline"
            >Mot de passe oublié</button>
        ` :
        render`
            <a
                    href="/sign-in"
                    onclick="${ router.click('/sign-in') }"
                    class="text-black"
            >Connexion</a>
            <button
                    onclick="${ props.onclick }"
                    class="px-2 py-1 text-white bg-purple-light hover:bg-purple rounded short-transition"
            >M'inscrire</button>
        `
}

function SignOnComponent (render, props) {
    const error = props.error
    const message = props.message

    const classCSS = (error ? 'text-red ' : '') + (error || message ? 'mt-2' : '')

    return render`
        <div class="flex justify-center items-center">
            <section class="flex flex-col justify-space-between items-center px-20 py-8 mt-8 bg-grey-lighter">
                <header class="mb-3 text-center">
                    <h2 class="text-purple-light">Camagru</h2>
                    <p class="${ classCSS }">${ error || message || '' }</p>
                </header>
                <article class="flex flex-col items-center">${
                    props.inputs.map(input => inputComponent(
                        Maverick.link(input),
                        input,
                    ))
                }</article>
                <footer class="flex justify-around items-center flex-wrap w-full mt-4">${
                    SignOnComponentFooter(Maverick.link(render), props)
                }</footer>
            </section>
        </div>
    `
}

function sendResetPasswordLink () {
    fetch('http://localhost:8001/password-reset')
        .then(res => res.json())
        .catch(() => {})
}
