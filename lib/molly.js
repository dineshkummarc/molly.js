(function() {
  var __slice = Array.prototype.slice;
  this.molly = function(constructor) {
    var add_leading_slash, context, events, exports, parse_url, replace_url_arguments;
    events = molly.events;
    add_leading_slash = function(url) {
      if (url[0] !== '/' && url[0] !== '#') {
        return "/" + url;
      } else {
        return url;
      }
    };
    replace_url_arguments = function(url) {
      return url.replace(/:([\w\d]+)/g, "([^\/]+)");
    };
    parse_url = function(url) {
      return add_leading_slash(replace_url_arguments(url));
    };
    context = {
      redirect: function(url) {
        return molly.url_handler.path(url);
      }
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
              _results.push(events.listen(url, callback, context));
            }
            return _results;
          },
          'string, object': function(prefix, urls) {
            var callback, url, _results;
            _results = [];
            for (url in urls) {
              callback = urls[url];
              url = parse_url("" + prefix + (add_leading_slash(url)));
              _results.push(events.listen(url, callback, context));
            }
            return _results;
          },
          '*': function() {
            var callback, callbacks, url, _i, _len, _ref, _results;
            url = arguments[0], callbacks = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            url = parse_url(url);
            _ref = _.flatten(callbacks);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              callback = _ref[_i];
              _results.push(events.listen(url, callback, context));
            }
            return _results;
          }
        });
      },
      use: function(name, item) {
        var k, v, _results;
        if (arguments.length === 1) {
          _results = [];
          for (k in name) {
            v = name[k];
            _results.push(context[k] = v);
          }
          return _results;
        } else {
          return context[name] = item;
        }
      },
      run: function() {
        events.trigger(molly.url_handler.path());
        return events.trigger(molly.url_handler.hash());
      }
    };
    if (constructor) {
      constructor.apply(exports);
      exports.run();
    }
    return exports;
  };
  molly.events = (function() {
    var events, exports;
    events = {};
    return exports = {
      listen: function(event, callback, context) {
        if (!events[event]) {
          events[event] = [];
        }
        return events[event].push({
          'callback': callback,
          'context': context
        });
      },
      trigger: function(path) {
        var args, event, method, methods, _results;
        _results = [];
        for (event in events) {
          methods = events[event];
          args = typeof path.match === "function" ? path.match(event) : void 0;
          _results.push((function() {
            var _i, _len, _results2;
            _results2 = [];
            for (_i = 0, _len = methods.length; _i < _len; _i++) {
              method = methods[_i];
              _results2.push((args != null ? args[0] : void 0) === path ? method.callback.apply(method.context, args.slice(1, (args.length + 1) || 9e9)) : void 0);
            }
            return _results2;
          })());
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
      path: function(url) {
        if (url) {
          window.location.pathname = url;
        }
        return window.location.pathname;
      },
      hash: function(hash) {
        if (hash) {
          window.location.hash = hash;
          molly.events.trigger(window.location.hash);
        }
        return window.location.hash;
      }
    };
  })();
  molly.type_match = function(args, methods) {
    var arg, arg_types, method, types, _ref;
    arg_types = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(typeof arg);
      }
      return _results;
    })()).join(", ");
    for (types in methods) {
      method = methods[types];
      types = types.replace('array', 'object');
      if (types === arg_types) {
        return method.apply(this, args);
      }
    }
    return (_ref = methods['*']) != null ? _ref.apply(this, args) : void 0;
  };
}).call(this);
