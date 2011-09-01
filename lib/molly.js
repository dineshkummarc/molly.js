(function() {
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
          'string, function': function(url, callback) {
            url = parse_url(url);
            return events.listen(url, callback, context);
          }
        });
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
        return events[event] = {
          'callback': callback,
          'context': context
        };
      },
      trigger: function(path) {
        var args, event, method, _results;
        _results = [];
        for (event in events) {
          method = events[event];
          args = typeof path.match === "function" ? path.match(event) : void 0;
          _results.push((args != null ? args[0] : void 0) === path ? method.callback.apply(method.context, args.slice(1, (args.length + 1) || 9e9)) : void 0);
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
