(function() {
  this.molly = function(constructor) {
    var add_leading_slash, events, exports, parse_url, remove_trailing_slash, replace_url_arguments;
    events = molly.events;
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
    parse_url = function(str) {
      return add_leading_slash(remove_trailing_slash(replace_url_arguments(str)));
    };
    exports = {
      route: function() {
        return molly.type_match(arguments, {
          'object': function(urls) {
            var callback, url, _results;
            _results = [];
            for (url in urls) {
              callback = urls[url];
              url = parse_url(url);
              _results.push(events.listen(url, callback));
            }
            return _results;
          },
          'string, object': function(prefix, urls) {
            var callback, url, _results;
            _results = [];
            for (url in urls) {
              callback = urls[url];
              url = parse_url("" + prefix + (add_leading_slash(url)));
              _results.push(events.listen(url, callback));
            }
            return _results;
          },
          'string, function': function(url, callback) {
            url = parse_url(url);
            return events.listen(url, callback);
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
        events.trigger(molly.url_handler.path());
        return events.trigger(molly.url_handler.hash());
      }
    };
    if (constructor != null) {
      constructor.apply(exports);
      return exports.run();
    } else {
      return exports;
    }
  };
  molly.events = (function() {
    var events, exports;
    events = {};
    return exports = {
      listen: function(event, callback) {
        return events[event] = callback;
      },
      trigger: function(path) {
        var args, callback, event, _results;
        _results = [];
        for (event in events) {
          callback = events[event];
          args = typeof path.match === "function" ? path.match(event) : void 0;
          _results.push(args != null ? callback.apply(this, args.slice(1, (args.length + 1) || 9e9)) : void 0);
        }
        return _results;
      }
    };
  })();
  molly.url_handler = (function() {
    var exports;
    window.onhashchange = function() {
      return molly.events.trigger(window.location.hash);
    };
    return exports = {
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
            window.location.hash = hash;
            return molly.events.trigger(hash);
          }
        });
      }
    };
  })();
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
