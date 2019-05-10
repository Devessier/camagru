const Me = (() => {

    const data = {
        avatar: 'https://api.adorable.io/avatars/128/adwabott@adorable.io.png',
        posts: []
    }

    function post (h, props) {
        return h`
            <article class="w-1/3 relative post">
                <img src="${ props.url }" class="object-contain h-full w-full" />
            </article>
        `
    }

    function render (h, props) {
        console.log(props)
        return h`
            <div class="flex justify-center items-center md:mx-10 mt-10">
                <div class="flex flex-col items-stretch w-3/5">
                    <div class="flex justify-between flex-wrap">
                        <div class="flex flex-col justify-around">
                            <div class="flex flex-col">
                                <h2 class="mb-2">${ GLOBAL_STATE.user.username }</h2>
                                <h3 class="font-normal">${ GLOBAL_STATE.user.email }</h3>
                            </div>

                            <a
                                    href="/me/edit"
                                    onclick="${ router.click('/me/edit') }"
                                    class="text-black bg-white border-2 border-purple-lighter hover:border-purple short-transition px-3 py-1 rounded"
                            >
                                Modifier mon profil
                            </a>
                        </div>
                        <div>
                            <img src="${ props.avatar }" class="w-32 h-32 rounded-full" />
                        </div>
                    </div>
                    <section class="mt-8">
                        <header class="pb-2 border-black border-b">
                            <h2 class="font-medium">Mes posts</h2>
                        </header>
                        <section
                                class="flex flex-wrap"
                        >${
                            props.posts.map(p => post(Maverick.link(p), p))
                        }</section>
                    </section>
                </div>
            </div>
        `
    }

    return new Page('Camagru - Mon compte', data, render, {
        created: function created () {
            this.state.loading = true

            fetch('http://localhost:8001/me/posts', {
                credentials: 'include'
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.error) {
                        this.state.error = data.error
                    } else {
                        this.state.posts = data.posts
                    }
                })
                .catch((err) => {
                    this.state.error = "Une erreur s'est produite, veuillez réessayer ultérieurement"
                })
                .finally(() => {
                    this.state.loading = false
                })
        }
    })

})()
