function authenticate () {
    const url = 'http://localhost:8001/me'

    GLOBAL_STATE.user = {}
    fetch(url, {
        credentials: 'include'
    })
        .then(res => res.json())
        .then((data) => {
            const user = data.user
            if (user)
                GLOBAL_STATE.user = user
        })
        .catch((err) => {
            GLOBAL_STATE.error = err
        })
}

function isAuthenticated () {
    return !!(GLOBAL_STATE.user && GLOBAL_STATE.user.username && GLOBAL_STATE.user.logguedIn)
}
