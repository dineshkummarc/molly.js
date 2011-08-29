(function() {
  this.molly = function(constructor) {
    var add_leading_slash, events, exports, listen, remove_trailing_slash, replace_url_arguments, trigger;
    events = {};
    add_leading_slash = function(str) {
      if (str[0] !== '/' && str[0] !== '#') {
        return "/" + str;
      } else {
        return str;
      }
    };
    remove_trailing_slash = function(str) {
      if (str !== '/' && str[str.length - 1] === '/') {
        return str.substring(0, str.length - 1);
      } else {
        return str;
      }
    };
    replace_url_arguments = function(str) {
      return str.replace(/:([\w\d]+)/g, "([^\/]+)");
    };
    listen = function(event, callback) {
      event = add_leading_slash(remove_trailing_slash(replace_url_arguments(event)));
      return events[event] = callback;
    };
    trigger = function(path) {
      var args, callback, event, _results;
      _results = [];
      for (event in events) {
        callback = events[event];
        args = typeof path.match === "function" ? path.match(event) : void 0;
        _results.push(args != null ? callback.apply(this, args.slice(1, (args.length + 1) || 9e9)) : void 0);
      }
      return _results;
    };
    exports = {
      route: function(url, callback) {
        return molly.type_match(arguments, {
          'object': function(urls) {
            var c, e, _results;
            _results = [];
            for (e in urls) {
              c = urls[e];
              _results.push(listen(e, c));
            }
            return _results;
          },
          'string, object': function(prefix, urls) {
            var callback, event, _results;
            _results = [];
            for (event in urls) {
              callback = urls[event];
              _results.push(listen("" + prefix + (add_leading_slash(event)), callback));
            }
            return _results;
          },
          'string, function': function(url, callback) {
            return listen(url, callback);
          }
        });
      },
      resource: function(name, obj) {
        this.route(name, obj.index);
        this.route("" + name + "/:id", obj.show);
        this.route("" + name + "/:id/edit", obj.edit);
        return this.route("" + name + "/:id/destroy", obj.destroy);
      },
      run: function() {
        trigger(molly.url_handler.path());
        return trigger(molly.url_handler.hash());
      }
    };
    if (constructor != null) {
      constructor.apply(exports);
      return exports.run();
    } else {
      return exports;
    }
  };
  molly.url_handler = {
    path: function() {
      return molly.type_match(arguments, {
        'null': function() {
          return window.location.pathname;
        },
        'string': function(path) {
          return window.location.pathname = path;
        }
      });
    },
    hash: function() {
      return molly.type_match(arguments, {
        'null': function() {
          return window.location.hash;
        },
        'string': function(hash) {
          return window.location.hash = hash;
        }
      });
    }
  };
  molly.type_match = function(args, methods) {
    var arg, arg_types, method, types, _results;
    arg_types = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(typeof arg);
      }
      return _results;
    })()).join(", ");
    _results = [];
    for (types in methods) {
      method = methods[types];
      _results.push(types === arg_types ? method.apply(this, args) : void 0);
    }
    return _results;
  };
}).call(this);
