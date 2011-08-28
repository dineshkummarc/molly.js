var app = molly();
app.use('auth', 'login');

var app = molly([ auth, login ]);

app.route({
    '/': index,
    '/users': users.index,
    '/users/:name': users.show,
    '/users/:name/edit': users.edit
});

app.route('/', index);

app.route '/:name' (request) ->
    console.log request.name

app.route('/', function() {
    console.log(this.path);
});

app.route('/users', {
    '/': users.index,
    '/:name': users.show
    '/:name/edit': users.edit
});

app.route('/registered/users', [ 'auth', 'login' ], {
    '/': users.index,
    '/:name': users.show
    '/:name/edit': [ 'auth', users.edit ]
    '/:name/destroy': users.destroy
});

app.resource('/users', {
    'index': function() {},
    'show': function() {},
    'edit': [ 'auth', function() {} ],
    'destroy': function() {}
});

app.route('/login', oauth_lib);


var app = molly(function() {

    this.use('auth', 'login');

    this.route('/', function() {});

    this.route('/:user', function(request) {
        // http://app/rich => request.user == rich
        console.log(request.user);
    });

});

molly () ->

    @use 'auth', 'login'

    @route '/', () ->
        console.log 'Hello world'
        @redirect '/users/new'

    @route '/:user', (user) ->
        @session.user = user
        @redirect url 'users/{{ user }}'



app = molly()
app.use 'auth', 'login'

app = molly([ auth, login ])


app.route '/', () ->
    console.log 'Hello world'


app.route '/:user', (request) ->
    console.log request.user


app.route '/users'

    '/': () ->
        console.log 'Hello users'

    '/:user': (request) ->
        console.log 'Hello {{ user }}'


app.resource 'users',

    'index': () ->
        console.log 'Hello users'

    'show': (request) ->
        console.log 'Hello {{ request.user }}'


app.resource 'posts',

    'index': () ->
        console.log 'These are all the posts'

    'show': (title) ->
        console.log 'You are reading {{ title }}'


app.route '/posts',

    '/': app.resource 'categories',

        'index': () ->
            console.log 'List of categories'

        'show': (category) ->
            console.log 'This is the {{ category }} category'


