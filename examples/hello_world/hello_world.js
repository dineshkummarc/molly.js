(function() {
  var app;
  app = molly(function() {
    this.route('/examples/hello_world/', function() {
      return alert('hello');
    });
    this.route('/examples/hello_world/users/', function() {
      return alert('Viewing all users');
    });
    return this.route('/examples/hello_world/users/:id', function(id) {
      return alert("Viewing user: " + id);
    });
  });
}).call(this);
