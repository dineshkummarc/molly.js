(function() {
  describe('molly', function() {
    beforeEach(function() {
      return this.app = molly();
    });
    it('should define a global function', function() {
      return expect(typeof molly).toBe('function');
    });
    it('should return an object', function() {
      return expect(typeof this.app).toBe('object');
    });
    it('should accept a create function', function() {
      var callback, my_app;
      callback = jasmine.createSpy();
      my_app = molly(callback);
      return expect(callback).toHaveBeenCalled();
    });
    it('should route from the constructor function', function() {
      var callback;
      callback = jasmine.createSpy();
      spyOn(molly.url_handler, 'path').andReturn('/');
      molly(function() {
        return this.route('/', callback);
      });
      return expect(callback).toHaveBeenCalled();
    });
    it('should register resources from the constructor function', function() {
      var callback;
      callback = jasmine.createSpy();
      spyOn(molly.url_handler, 'path').andReturn('/users');
      molly(function() {
        return this.resource('users', {
          index: callback
        });
      });
      return expect(callback).toHaveBeenCalled();
    });
    describe('route', function() {
      it('should have a route method on the returned object', function() {
        return expect(typeof this.app.route).toBe('function');
      });
      it('should register a callback for a url string', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/');
        this.app.route('/', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalled();
      });
      it('should not trigger callbacks if url is not matched', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/');
        this.app.route('/foo', callback);
        this.app.run();
        return expect(callback).not.toHaveBeenCalled();
      });
      it('should only call the current route', function() {
        var callback1, callback2;
        callback1 = jasmine.createSpy();
        callback2 = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/users/123');
        this.app.route({
          '/users': callback1,
          '/users/123': callback2
        });
        this.app.run();
        expect(callback1).not.toHaveBeenCalled();
        return expect(callback2).toHaveBeenCalled();
      });
      it('should route multiple urls if passed an object', function() {
        var callback1, callback2;
        callback1 = jasmine.createSpy();
        callback2 = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/');
        this.app.route({
          '/': callback1,
          '/foo': callback2
        });
        this.app.run();
        return expect(callback1).toHaveBeenCalled();
      });
      it('should route using prefixes if provided', function() {
        var callback1, callback2;
        callback1 = jasmine.createSpy();
        callback2 = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/users/foo');
        this.app.route('/users', {
          '/': callback1,
          '/foo': callback2
        });
        this.app.run();
        return expect(callback2).toHaveBeenCalled();
      });
      it('should route add leading slashes to namespaced urls', function() {
        var callback1, callback2;
        callback1 = jasmine.createSpy();
        callback2 = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/users/foo');
        this.app.route('/users', {
          '/': callback1,
          'foo': callback2
        });
        this.app.run();
        return expect(callback2).toHaveBeenCalled();
      });
      it('should add a leading slash if missing', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/foo');
        this.app.route('foo', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalled();
      });
      it('should pass url parameters to callbacks', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/users/123');
        this.app.route('/users/:id', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalledWith('123');
      });
      it('should pass multiple url parameters to callbacks', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'path').andReturn('/posts/programming/intro-to-molly.js');
        this.app.route('/posts/:category/:title', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalledWith('programming', 'intro-to-molly.js');
      });
      it('should allow mapping to hashes', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'hash').andReturn('#hello-world');
        this.app.route('#hello-world', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalled();
      });
      return it('should allow url parameters in hash urls', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'hash').andReturn('#users/123');
        this.app.route('#users/:id', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalledWith('123');
      });
    });
    describe('resource', function() {
      beforeEach(function() {
        return spyOn(this.app, 'route');
      });
      it('should have a resource function', function() {
        return expect(typeof this.app.resource).toBe('function');
      });
      it('should create an index route for the resource', function() {
        var callback;
        callback = jasmine.createSpy();
        this.app.resource('users', {
          index: callback
        });
        return expect(this.app.route).toHaveBeenCalledWith('users', callback);
      });
      it('should create a show route for the resource', function() {
        var callback;
        callback = jasmine.createSpy();
        this.app.resource('users', {
          show: callback
        });
        return expect(this.app.route).toHaveBeenCalledWith('users/:id', callback);
      });
      it('should create an edit route for the resource', function() {
        var callback;
        callback = jasmine.createSpy();
        this.app.resource('users', {
          edit: callback
        });
        return expect(this.app.route).toHaveBeenCalledWith('users/:id/edit', callback);
      });
      return it('should create a delete route for the resource', function() {
        var callback;
        callback = jasmine.createSpy();
        this.app.resource('users', {
          destroy: callback
        });
        return expect(this.app.route).toHaveBeenCalledWith('users/:id/destroy', callback);
      });
    });
    describe('run', function() {
      it('should have a run function', function() {
        return expect(typeof this.app.run).toBe('function');
      });
      it('should find the current url path', function() {
        spyOn(molly.url_handler, 'path').andReturn('/');
        spyOn(molly.events, 'trigger');
        this.app.run();
        expect(molly.url_handler.path).toHaveBeenCalled();
        return expect(molly.events.trigger).toHaveBeenCalledWith('/');
      });
      return it('should find the current url hash', function() {
        spyOn(molly.url_handler, 'hash').andReturn('#hello');
        spyOn(molly.events, 'trigger');
        this.app.run();
        expect(molly.url_handler.hash).toHaveBeenCalled();
        return expect(molly.events.trigger).toHaveBeenCalledWith('#hello');
      });
    });
    describe('url_handler', function() {
      it('should have a url_handler object', function() {
        return expect(typeof molly.url_handler).toBe('object');
      });
      it('should have a path method', function() {
        return expect(typeof molly.url_handler.path).toBe('function');
      });
      it('should have a hash method', function() {
        return expect(typeof molly.url_handler.hash).toBe('function');
      });
      return it('should trigger an event when hash changes', function() {
        spyOn(molly.events, 'trigger');
        molly.url_handler.hash('#hello');
        return expect(molly.events.trigger).toHaveBeenCalledWith('#hello');
      });
    });
    return describe('type_match', function() {
      return it('should call null option if not arguments are provided', function() {
        var callback, example;
        callback = jasmine.createSpy();
        example = function() {
          return molly.type_match(arguments, {
            '': function() {
              return callback();
            }
          });
        };
        example();
        return expect(callback).toHaveBeenCalled();
      });
    });
  });
}).call(this);
