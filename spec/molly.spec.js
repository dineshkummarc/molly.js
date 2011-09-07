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
          '/users/:id': callback2
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
      it('should allow url parameters in hash urls', function() {
        var callback;
        callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'hash').andReturn('#users/123');
        this.app.route('#users/:id', callback);
        this.app.run();
        return expect(callback).toHaveBeenCalledWith('123');
      });
      it('should allow arrays of callbacks to be passed', function() {
        var callback, second_callback;
        callback = jasmine.createSpy();
        second_callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'hash').andReturn('/');
        this.app.route('/', callback, second_callback);
        this.app.run();
        expect(callback).toHaveBeenCalled();
        return expect(second_callback).toHaveBeenCalled();
      });
      return it('should allow nested arrays of callbacks to be passed', function() {
        var callback, login, second_callback, third_callback;
        callback = jasmine.createSpy();
        second_callback = jasmine.createSpy();
        third_callback = jasmine.createSpy();
        spyOn(molly.url_handler, 'hash').andReturn('/');
        login = [callback, second_callback];
        this.app.route('/', login, third_callback);
        this.app.run();
        expect(callback).toHaveBeenCalled();
        expect(second_callback).toHaveBeenCalled();
        return expect(third_callback).toHaveBeenCalled();
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
    describe('type_match', function() {
      it('should match argument types passed in', function() {
        var callback, example;
        callback = jasmine.createSpy();
        example = function() {
          return molly.type_match(arguments, {
            'string, function, string': function(message, method, goodbye) {
              return method(message, goodbye);
            }
          });
        };
        example('hello', callback, 'world');
        return expect(callback).toHaveBeenCalledWith('hello', 'world');
      });
      it('should convert array to object', function() {
        var callback, example;
        callback = jasmine.createSpy();
        example = function() {
          return molly.type_match(arguments, {
            'array': function() {
              return callback();
            }
          });
        };
        example([1, 2, 3]);
        return expect(callback).toHaveBeenCalled();
      });
      return it('should call null option if not arguments are provided', function() {
        var callback, example;
        callback = jasmine.createSpy();
        example = function() {
          return molly.type_match(arguments, {
            '*': function() {
              return callback();
            }
          });
        };
        example();
        return expect(callback).toHaveBeenCalled();
      });
    });
    describe('redirect', function() {
      it('should have a redirect method on route context', function() {
        spyOn(molly.url_handler, 'path').andReturn('/');
        this.app.route('/', function() {
          return expect(typeof this.redirect).toBe('function');
        });
        return this.app.run();
      });
      return it('should call url_handler.path with a new url', function() {
        spyOn(molly.url_handler, 'path').andReturn('/');
        this.app.route('/', function() {
          this.redirect('/foo');
          return expect(molly.url_handler.path).toHaveBeenCalledWith('/foo');
        });
        return this.app.run();
      });
    });
    return describe('config', function() {
      it('should have a use method', function() {
        return expect(typeof this.app.use).toBe('function');
      });
      it('should set named properties on route context', function() {
        var config;
        spyOn(molly.url_handler, 'path').andReturn('/');
        config = {
          debug: true,
          app_id: 12345
        };
        this.app.use('config', config);
        this.app.use('foo', function() {
          return 'bar';
        });
        this.app.route('/', function() {
          expect(this.config.debug).toBe(true);
          expect(this.config.app_id).toBe(12345);
          return expect(this.foo()).toBe('bar');
        });
        return this.app.run();
      });
      return it('should assign all object values directly if no name is provided', function() {
        spyOn(molly.url_handler, 'path').andReturn('/');
        this.app.use({
          config: {
            debug: true,
            app_id: 12345
          },
          foo: function() {
            return 'bar';
          }
        });
        this.app.route('/', function() {
          expect(this.config.debug).toBe(true);
          expect(this.config.app_id).toBe(12345);
          return expect(this.foo()).toBe('bar');
        });
        return this.app.run();
      });
    });
  });
}).call(this);
