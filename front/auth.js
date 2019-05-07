function authenticate () {
    const url = 'http://localhost:8001/me'

    GLOBAL_STATE.user = {}
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            const user = data.user
            if (user !== null)
                GLOBAL_STATE.user = user
        })
        .catch((err) => {
            GLOBAL_STATE.error = err
        })
}

function isAuthenticated () {
    return GLOBAL_STATE.user && GLOBAL_STATE.user.name && GLOBAL_STATE.user.logguedIn
}
