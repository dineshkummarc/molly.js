molly.routes = function(emit) {

    emit('get:' + window.location.pathname)

    window.onhashchange = function() {
        emit('get:' + window.location.hash)
    }

}
