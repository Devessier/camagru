function inputComponent (h, props) {
    return h`
        <input
                placeholder="${ props.placeholder }"
                value="${ props.value }"
                oninput="${ event => { props.value = event.target.value } }"
                class="my-2 py-1 bg-transparent border-b-2 border-grey-light hover:border-purple-lighter focus:border-purple short-transition w-64"
                type="${ props.password ? 'password' : 'text' }"
        />
    `
}

function SignOnComponentFooter (h, props) {
    return props.signin ?
        h`
            <a
                    href="/sign-up"
                    onclick="${ router.click('/sign-up') }"
                    class="text-black"
            >Inscription</a>
            <button
                    onclick="${ props.onclick }"
                    class="px-2 py-1 text-white bg-purple-light hover:bg-purple rounded short-transition"
            >Me connecter</button>
        ` :
        h`
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

function SignOnComponent (h, props) {
    const error = Maverick.sanitize(props.error)

    return h`
        <div class="flex justify-center items-center">
            <section class="flex flex-col justify-space-between items-center px-20 py-8 mt-8 bg-grey-lighter">
                <header class="mb-3 text-center">
                    <h2 class="text-purple-light">Camagru</h2>
                    <p class="${ error ? 'text-red mt-2' : 'hidden' }">${ error || '' }</p>
                </header>
                <article class="flex flex-col items-center">${
                    props.inputs.map(input => inputComponent(
                        Maverick.link(input),
                        input,
                    ))
                }</article>
                <footer class="flex justify-around items-center w-full mt-4">${
                    SignOnComponentFooter(Maverick.link(h), props)
                }</footer>
            </section>
        </div>
    `
}
