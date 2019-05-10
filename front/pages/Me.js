const Me = (() => {

    const data = {
        avatar: '',
        posts: []
    }

    function post (h, props, i) {
        return h`
            <article class="w-1/3 xl:w-1/4 border border-white">
                <div class="relative post">
                    <div class="absolute pin">
                        <img src="${ props.url }" class="h-full w-full" style="object-fit: cover;" />
                        <div class="flex justify-center items-center z-50 absolute w-full h-full pin-t bg-transparent hover:bg-black opacity-75 text-transparent hover:text-white short-transition">
                            <svg
                                    onclick="${ () => { data.posts.splice(i, 1) } }"
                                    class="w-10 h-10 hover:text-red transition cursor-pointer mx-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </div>
                    </div>
                </div>
            </article>
        `
    }

    function render (h, props) {
        return h`
            <div class="flex justify-center items-center md:mx-10 mt-10">
                <div class="flex flex-col items-stretch w-full md:w-3/5">
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
                            <img src="${ GLOBAL_STATE.avatar }" class="w-32 h-32 rounded-full" />
                        </div>
                    </div>
                    <section class="mt-8">
                        <header class="pb-2">
                            <h2 class="font-medium">Mes posts</h2>
                        </header>
                        <section
                                class="flex flex-wrap"
                        >${
                            props.posts.map((p, i) => post(Maverick.link(p), p, i))
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
