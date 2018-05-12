(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var base = _interopRequireWildcard(_handlebarsBase);

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

// For compatibility and usage outside of module systems, make the Handlebars object a namespace

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":2,"./handlebars/exception":5,"./handlebars/no-conflict":15,"./handlebars/runtime":16,"./handlebars/safe-string":17,"./handlebars/utils":18}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.4';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":3,"./exception":5,"./helpers":6,"./logger":14,"./utils":18}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":4}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":18}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":7,"./helpers/each":8,"./helpers/helper-missing":9,"./helpers/if":10,"./helpers/log":11,"./helpers/lookup":12,"./helpers/with":13}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":18}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":5,"../utils":18}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":5}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":18}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":18}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":18}],15:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context !== options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context !== depths[0]) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    options.data = _base.createFrame(options.data);
    partialBlock = options.data['partial-block'] = options.fn;

    if (partialBlock.partials) {
      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
    }
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":2,"./exception":5,"./utils":18}],17:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
exports.toString = toString;
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

// Older IE versions do not directly support indexOf so we must implement our own, sadly.
exports.isArray = isArray;

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],19:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":1}],20:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":19}],21:[function(require,module,exports){
var GameModel, GroupModel, GroupView, TeamModel, Test, a, ab, game, game_models, games, i, index, j, len, len1, ref, teams, tmpl,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

tmpl = require('./tmpl/test.hbs');

GroupView = require('../open_bets/group.coffee');

GroupModel = require('../open_bets/models.coffee').GroupModel;

GameModel = require('../open_bets/models.coffee').GameModel;

TeamModel = require('../open_bets/models.coffee').TeamModel;

Test = (function(superClass) {
  extend(Test, superClass);

  function Test() {
    return Test.__super__.constructor.apply(this, arguments);
  }

  Test.prototype.template = tmpl;

  Test.prototype.className = "test";

  Test.prototype.type = 'all_bets';

  return Test;

})(Marionette.LayoutView);

games = [
  {
    home: 'arg',
    away: 'ger',
    group: 'A'
  }, {
    home: 'arg',
    away: 'bra',
    group: 'A'
  }, {
    home: 'arg',
    away: 'fra',
    group: 'A'
  }, {
    home: 'bra',
    away: 'ger',
    group: 'A'
  }, {
    home: 'bra',
    away: 'fra',
    group: 'A'
  }, {
    home: 'fra',
    away: 'ger',
    group: 'A'
  }
];

game_models = [];

for (index = i = 0, len = games.length; i < len; index = ++i) {
  game = games[index];
  game.id = index;
  game_models.push(new GameModel(game));
}

teams = [];

ref = ['fra', 'bra', 'ger', 'arg'];
for (j = 0, len1 = ref.length; j < len1; j++) {
  a = ref[j];
  teams.push(new TeamModel({
    name: a
  }));
}

a = void 0;

ab = (function(superClass) {
  extend(ab, superClass);

  function ab() {
    this.onRender = bind(this.onRender, this);
    return ab.__super__.constructor.apply(this, arguments);
  }

  ab.prototype.template = tmpl;

  ab.prototype.regions = {
    a: '.test'
  };

  ab.prototype.onRender = function() {
    return this.a.show(a);
  };

  return ab;

})(Marionette.LayoutView);

module.exports = ab;


},{"../open_bets/group.coffee":30,"../open_bets/models.coffee":33,"./tmpl/test.hbs":22}],22:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"test\">תוצאות</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],23:[function(require,module,exports){
var AllBets, App, Logout, MainMenu, OpenBets, TopHeader, signIn,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TopHeader = require('./layout/layout.coffee').TopHeader;

MainMenu = require('./layout/layout.coffee').MainMenu;

OpenBets = require('./open_bets/main.coffee');

AllBets = require('./all_bets/main.coffee');

signIn = require('./sign_in/main.coffee');

Logout = require('./logout/main.coffee');

App = (function(superClass) {
  extend(App, superClass);

  function App() {
    this.getUser = bind(this.getUser, this);
    this.showMainView = bind(this.showMainView, this);
    this.startMe = bind(this.startMe, this);
    this.onStart = bind(this.onStart, this);
    return App.__super__.constructor.apply(this, arguments);
  }

  App.prototype.onStart = function(options) {
    return this.startMe();
  };

  App.prototype.startMe = function(options) {
    this.addRegions({
      main: '.main',
      header: '.header',
      menu: '.menu'
    });
    this.topHeader = new TopHeader(options);
    this.mainMenu = new MainMenu(options);
    this.menu.show(this.mainMenu);
    return this.header.show(this.topHeader);
  };

  App.prototype.showMainView = function(type) {
    if (this.view && type === this.view.type) {
      return;
    }
    if (type === 'open_bets') {
      this.view = new OpenBets();
    } else if (type === 'all_bets') {
      this.view = new AllBets();
    } else if (type === 'login') {
      if (this.user != null) {
        this.view = new Logout({
          user: this.user
        });
        this.listenTo(this.view, 'logout', this.logout);
      } else {
        this.view = new signIn();
        this.listenTo(this.view, 'sign_in', this.setUser);
      }
    }
    return this.main.show(this.view);
  };

  App.prototype.getUser = function() {
    if ((window.userConfig.id != null) && (window.userConfig.remember != null)) {
      return axios.post('/api/verify', {
        id: userConfig.id,
        remember: userConfig.remember
      }).then((function(_this) {
        return function(response) {
          return _this.startMe();
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          return console.log(error);
        };
      })(this));
    } else {

    }
  };

  return App;

})(Marionette.Application);

$(document).ready(function() {
  var app;
  app = new App();
  window.app = app;
  return app.start();
});


},{"./all_bets/main.coffee":21,"./layout/layout.coffee":24,"./logout/main.coffee":28,"./open_bets/main.coffee":32,"./sign_in/main.coffee":41}],24:[function(require,module,exports){
var MainMenu, MainView, MenuView, TopHeader, headerTmpl, mainViewTmpl, menuTmpl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

headerTmpl = require('./tmpl/topHeader.hbs');

menuTmpl = require('./tmpl/menu.hbs');

mainViewTmpl = require('./tmpl/mainView.hbs');

TopHeader = (function(superClass) {
  extend(TopHeader, superClass);

  function TopHeader() {
    this.initialize = bind(this.initialize, this);
    return TopHeader.__super__.constructor.apply(this, arguments);
  }

  TopHeader.prototype.template = headerTmpl;

  TopHeader.prototype.className = 'TopHeader';

  TopHeader.prototype.initialize = function() {
    return console.log('eshel');
  };

  return TopHeader;

})(Marionette.LayoutView);

MenuView = (function(superClass) {
  extend(MenuView, superClass);

  function MenuView() {
    this.initialize = bind(this.initialize, this);
    return MenuView.__super__.constructor.apply(this, arguments);
  }

  MenuView.prototype.template = menuTmpl;

  MenuView.prototype.className = "MenuView";

  MenuView.prototype.initialize = function() {
    return console.log('menu');
  };

  return MenuView;

})(Marionette.LayoutView);

MainMenu = (function(superClass) {
  extend(MainMenu, superClass);

  function MainMenu() {
    this.serializeData = bind(this.serializeData, this);
    this.initialize = bind(this.initialize, this);
    this.onRender = bind(this.onRender, this);
    this.navigate = bind(this.navigate, this);
    return MainMenu.__super__.constructor.apply(this, arguments);
  }

  MainMenu.prototype.ui = {
    links: '.nav-item'
  };

  MainMenu.prototype.events = {
    'click @ui.links': 'navigate'
  };

  MainMenu.prototype.navigate = function(event) {
    var el, link;
    el = $(event.currentTarget);
    console.log(el, 'el');
    link = el.attr('data-attr');
    return window.app.showMainView(link);
  };

  MainMenu.prototype.onRender = function() {
    return console.log(this.ui.links, 'links');
  };

  MainMenu.prototype.initialize = function(options) {
    return this.tabs = [
      {
        label: 'הימורים פתוחים',
        activeClass: 'active',
        link: 'open_bets'
      }, {
        label: 'טבלת ניקוד',
        activeClass: '',
        link: 'all_bets'
      }, {
        label: 'התחבר',
        activeClass: '',
        link: 'login'
      }
    ];
  };

  MainMenu.prototype.serializeData = function() {
    return {
      tabs: this.tabs
    };
  };

  return MainMenu;

})(MenuView);

MainView = (function(superClass) {
  extend(MainView, superClass);

  function MainView() {
    this.serializeData = bind(this.serializeData, this);
    return MainView.__super__.constructor.apply(this, arguments);
  }

  MainView.prototype.template = mainViewTmpl;

  MainView.prototype.className = 'MainView';

  MainView.prototype.serializeData = function() {
    return {
      title: this.title,
      hasMenu: this.hasMenu
    };
  };

  return MainView;

})(Marionette.LayoutView);

module.exports = {
  TopHeader: TopHeader,
  MenuView: MenuView,
  MainMenu: MainMenu,
  MainView: MainView
};


},{"./tmpl/mainView.hbs":25,"./tmpl/menu.hbs":26,"./tmpl/topHeader.hbs":27}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"wrapper\">\n        <div class=\"contentRegion col-sm-10\">\n        <div class=\"menuRegion col-sm-2\">\n    </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"contentRegion\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<h3 class=\"mainViewTitle rtl\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasMenu : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":20}],26:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <li class=\"nav-item\" data-attr=\""
    + alias4(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"link","hash":{},"data":data}) : helper)))
    + "\" "
    + alias4(((helper = (helper = helpers.activeClass || (depth0 != null ? depth0.activeClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"activeClass","hash":{},"data":data}) : helper)))
    + "\">\n                <a class=\"nav-link\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a>\n            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<!--nav class=\"nav flex-column col-sm-2 rtl bg-dark\">\n  <a class=\"nav-link active\" href=\"\">Active</a>\n  <a class=\"nav-link\" href=\"\">Link</a>\n  <a class=\"nav-link\" href=\"\">Link</a>\n  <a class=\"nav-link disabled\" href=\"\">Disabled</a>\n</nav-->\n\n\n<nav class=\"navbar flex-column rtl bg-dark navbar-dark\">\n\n    <ul class=\"navbar-nav\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.tabs : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</nav>\n";
},"useData":true});

},{"hbsfy/runtime":20}],27:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"jumbotron jumbotron-fluid bg-info rtl\">\n    <div class=\"container\">\n        <h1>הימור חברים</h1>\n        <p>מונדיאל 2018</p>\n    </div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],28:[function(require,module,exports){
var LogoutLayout, logoutTmpl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

logoutTmpl = require('./tmpl/logout.hbs');

LogoutLayout = (function(superClass) {
  extend(LogoutLayout, superClass);

  function LogoutLayout() {
    this.initialize = bind(this.initialize, this);
    this.onRender = bind(this.onRender, this);
    this.logout = bind(this.logout, this);
    return LogoutLayout.__super__.constructor.apply(this, arguments);
  }

  LogoutLayout.prototype.template = logoutTmpl;

  LogoutLayout.prototype.className = "LogoutView";

  LogoutLayout.prototype.type = 'login';

  LogoutLayout.prototype.ui = {
    logout: '.btn',
    name: '.name'
  };

  LogoutLayout.prototype.events = {
    'click @ui.logout': 'logout'
  };

  LogoutLayout.prototype.logout = function() {
    return this.trigger('logout');
  };

  LogoutLayout.prototype.onRender = function() {
    return this.ui.name.html(this.user.name);
  };

  LogoutLayout.prototype.initialize = function(options) {
    return this.user = options.user;
  };

  return LogoutLayout;

})(Marionette.LayoutView);

module.exports = LogoutLayout;


},{"./tmpl/logout.hbs":29}],29:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"container\">\n    <h2 class=\"title_msg\">\n        שלום,\n        <span class=\"name\"></span>\n    </h2>\n    <button class=\"btn btn-lg btn-danger btn-block\">התנתק</button>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],30:[function(require,module,exports){
var GroupModel, GroupView, groupTmpl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

GroupModel = require('./models.coffee').GroupModel;

groupTmpl = require('./tmpl/group.hbs');

GroupView = (function(superClass) {
  extend(GroupView, superClass);

  function GroupView() {
    this.serializeData = bind(this.serializeData, this);
    this.initialize = bind(this.initialize, this);
    return GroupView.__super__.constructor.apply(this, arguments);
  }

  GroupView.prototype.className = 'GroupView';

  GroupView.prototype.template = groupTmpl;

  GroupView.prototype.regions = {
    gamesRegion: '.gamesRegion'
  };

  GroupView.prototype.initialize = function(options) {
    return this.model = options.model;
  };

  GroupView.prototype.serializeData = function() {
    var games, table;
    games = _.map(this.model.getGames(), function(game) {
      return {
        homeTeam: game.getHomeTeam(),
        homeScore: game.getHomeScore(),
        awayTeam: game.getAwayTeam(),
        awayScore: game.getAwayScore()
      };
    });
    table = _.map(this.model.getTable(), function(team) {
      var data;
      data = team.getData();
      return {
        name: team.name,
        points: data.points,
        gf: data.gf,
        ga: data.ga,
        games: _.keys(team.games).length
      };
    });
    return {
      games: games,
      table: table
    };
  };

  return GroupView;

})(Marionette.LayoutView);

module.exports = GroupView;


},{"./models.coffee":33,"./tmpl/group.hbs":35}],31:[function(require,module,exports){
var a;

a = {
  "groups": {
    "a": [
      {
        "id": 1,
        "external_id": "1",
        "type": "groups",
        "sub_type": "a",
        "team_home_id": 1,
        "team_away_id": 2,
        "start_time": 1528988400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Russia",
        "team_away_name": "Saudi Arabia"
      }, {
        "id": 2,
        "external_id": "2",
        "type": "groups",
        "sub_type": "a",
        "team_home_id": 3,
        "team_away_id": 4,
        "start_time": 1529064000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Egypt",
        "team_away_name": "Uruguay"
      }, {
        "id": 3,
        "external_id": "17",
        "type": "groups",
        "sub_type": "a",
        "team_home_id": 1,
        "team_away_id": 3,
        "start_time": 1529431200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Russia",
        "team_away_name": "Egypt"
      }, {
        "id": 4,
        "external_id": "18",
        "type": "groups",
        "sub_type": "a",
        "team_home_id": 4,
        "team_away_id": 2,
        "start_time": 1529506800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Uruguay",
        "team_away_name": "Saudi Arabia"
      }, {
        "id": 5,
        "external_id": "33",
        "type": "groups",
        "sub_type": "a",
        "team_home_id": 4,
        "team_away_id": 1,
        "start_time": 1529935200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Uruguay",
        "team_away_name": "Russia"
      }, {
        "id": 6,
        "external_id": "34",
        "type": "groups",
        "sub_type": "a",
        "team_home_id": 2,
        "team_away_id": 3,
        "start_time": 1529935200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Saudi Arabia",
        "team_away_name": "Egypt"
      }
    ],
    "b": [
      {
        "id": 7,
        "external_id": "3",
        "type": "groups",
        "sub_type": "b",
        "team_home_id": 5,
        "team_away_id": 6,
        "start_time": 1529085600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Portugal",
        "team_away_name": "Spain"
      }, {
        "id": 8,
        "external_id": "4",
        "type": "groups",
        "sub_type": "b",
        "team_home_id": 7,
        "team_away_id": 8,
        "start_time": 1529074800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Morocco",
        "team_away_name": "Iran"
      }, {
        "id": 9,
        "external_id": "19",
        "type": "groups",
        "sub_type": "b",
        "team_home_id": 5,
        "team_away_id": 7,
        "start_time": 1529496000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Portugal",
        "team_away_name": "Morocco"
      }, {
        "id": 10,
        "external_id": "20",
        "type": "groups",
        "sub_type": "b",
        "team_home_id": 8,
        "team_away_id": 6,
        "start_time": 1529517600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Iran",
        "team_away_name": "Spain"
      }, {
        "id": 11,
        "external_id": "35",
        "type": "groups",
        "sub_type": "b",
        "team_home_id": 8,
        "team_away_id": 5,
        "start_time": 1529949600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Iran",
        "team_away_name": "Portugal"
      }, {
        "id": 12,
        "external_id": "36",
        "type": "groups",
        "sub_type": "b",
        "team_home_id": 6,
        "team_away_id": 7,
        "start_time": 1529949600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "Spain",
        "team_away_name": "Morocco"
      }
    ],
    "c": [
      {
        "id": 13,
        "external_id": "5",
        "type": "groups",
        "sub_type": "c",
        "team_home_id": 9,
        "team_away_id": 10,
        "start_time": 1529143200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:24",
        "updated_at": "2018-05-12 10:28:24",
        "team_home_name": "France",
        "team_away_name": "Australia"
      }, {
        "id": 14,
        "external_id": "6",
        "type": "groups",
        "sub_type": "c",
        "team_home_id": 11,
        "team_away_id": 12,
        "start_time": 1529164800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Peru",
        "team_away_name": "Denmark"
      }, {
        "id": 15,
        "external_id": "21",
        "type": "groups",
        "sub_type": "c",
        "team_home_id": 9,
        "team_away_id": 11,
        "start_time": 1529593200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "France",
        "team_away_name": "Peru"
      }, {
        "id": 16,
        "external_id": "22",
        "type": "groups",
        "sub_type": "c",
        "team_home_id": 12,
        "team_away_id": 10,
        "start_time": 1529582400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Denmark",
        "team_away_name": "Australia"
      }, {
        "id": 17,
        "external_id": "37",
        "type": "groups",
        "sub_type": "c",
        "team_home_id": 12,
        "team_away_id": 9,
        "start_time": 1530021600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Denmark",
        "team_away_name": "France"
      }, {
        "id": 18,
        "external_id": "38",
        "type": "groups",
        "sub_type": "c",
        "team_home_id": 10,
        "team_away_id": 11,
        "start_time": 1530025200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Australia",
        "team_away_name": "Peru"
      }
    ],
    "d": [
      {
        "id": 19,
        "external_id": "7",
        "type": "groups",
        "sub_type": "d",
        "team_home_id": 13,
        "team_away_id": 14,
        "start_time": 1529154000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Argentina",
        "team_away_name": "Iceland"
      }, {
        "id": 20,
        "external_id": "8",
        "type": "groups",
        "sub_type": "d",
        "team_home_id": 15,
        "team_away_id": 16,
        "start_time": 1529175600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Croatia",
        "team_away_name": "Nigeria"
      }, {
        "id": 21,
        "external_id": "23",
        "type": "groups",
        "sub_type": "d",
        "team_home_id": 13,
        "team_away_id": 15,
        "start_time": 1529604000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Argentina",
        "team_away_name": "Croatia"
      }, {
        "id": 22,
        "external_id": "24",
        "type": "groups",
        "sub_type": "d",
        "team_home_id": 16,
        "team_away_id": 14,
        "start_time": 1529679600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Nigeria",
        "team_away_name": "Iceland"
      }, {
        "id": 23,
        "external_id": "39",
        "type": "groups",
        "sub_type": "d",
        "team_home_id": 16,
        "team_away_id": 13,
        "start_time": 1530036000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Nigeria",
        "team_away_name": "Argentina"
      }, {
        "id": 24,
        "external_id": "40",
        "type": "groups",
        "sub_type": "d",
        "team_home_id": 14,
        "team_away_id": 15,
        "start_time": 1530036000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Iceland",
        "team_away_name": "Croatia"
      }
    ],
    "e": [
      {
        "id": 25,
        "external_id": "9",
        "type": "groups",
        "sub_type": "e",
        "team_home_id": 17,
        "team_away_id": 18,
        "start_time": 1529258400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Brazil",
        "team_away_name": "Switzerland"
      }, {
        "id": 26,
        "external_id": "10",
        "type": "groups",
        "sub_type": "e",
        "team_home_id": 19,
        "team_away_id": 20,
        "start_time": 1529236800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Costa Rica",
        "team_away_name": "Serbia"
      }, {
        "id": 27,
        "external_id": "25",
        "type": "groups",
        "sub_type": "e",
        "team_home_id": 17,
        "team_away_id": 19,
        "start_time": 1529668800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Brazil",
        "team_away_name": "Costa Rica"
      }, {
        "id": 28,
        "external_id": "26",
        "type": "groups",
        "sub_type": "e",
        "team_home_id": 20,
        "team_away_id": 18,
        "start_time": 1529690400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Serbia",
        "team_away_name": "Switzerland"
      }, {
        "id": 29,
        "external_id": "41",
        "type": "groups",
        "sub_type": "e",
        "team_home_id": 20,
        "team_away_id": 17,
        "start_time": 1530122400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:25",
        "updated_at": "2018-05-12 10:28:25",
        "team_home_name": "Serbia",
        "team_away_name": "Brazil"
      }, {
        "id": 30,
        "external_id": "42",
        "type": "groups",
        "sub_type": "e",
        "team_home_id": 18,
        "team_away_id": 19,
        "start_time": 1530122400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Switzerland",
        "team_away_name": "Costa Rica"
      }
    ],
    "f": [
      {
        "id": 31,
        "external_id": "11",
        "type": "groups",
        "sub_type": "f",
        "team_home_id": 21,
        "team_away_id": 22,
        "start_time": 1529247600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Germany",
        "team_away_name": "Mexico"
      }, {
        "id": 32,
        "external_id": "12",
        "type": "groups",
        "sub_type": "f",
        "team_home_id": 23,
        "team_away_id": 24,
        "start_time": 1529323200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Sweden",
        "team_away_name": "South Korea"
      }, {
        "id": 33,
        "external_id": "27",
        "type": "groups",
        "sub_type": "f",
        "team_home_id": 21,
        "team_away_id": 23,
        "start_time": 1529776800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Germany",
        "team_away_name": "Sweden"
      }, {
        "id": 34,
        "external_id": "28",
        "type": "groups",
        "sub_type": "f",
        "team_home_id": 24,
        "team_away_id": 22,
        "start_time": 1529766000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "South Korea",
        "team_away_name": "Mexico"
      }, {
        "id": 35,
        "external_id": "43",
        "type": "groups",
        "sub_type": "f",
        "team_home_id": 24,
        "team_away_id": 21,
        "start_time": 1530108000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "South Korea",
        "team_away_name": "Germany"
      }, {
        "id": 36,
        "external_id": "44",
        "type": "groups",
        "sub_type": "f",
        "team_home_id": 22,
        "team_away_id": 23,
        "start_time": 1530108000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Mexico",
        "team_away_name": "Sweden"
      }
    ],
    "g": [
      {
        "id": 37,
        "external_id": "13",
        "type": "groups",
        "sub_type": "g",
        "team_home_id": 25,
        "team_away_id": 26,
        "start_time": 1529334000,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Belgium",
        "team_away_name": "Panama"
      }, {
        "id": 38,
        "external_id": "14",
        "type": "groups",
        "sub_type": "g",
        "team_home_id": 27,
        "team_away_id": 28,
        "start_time": 1529344800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Tunisia",
        "team_away_name": "England"
      }, {
        "id": 39,
        "external_id": "29",
        "type": "groups",
        "sub_type": "g",
        "team_home_id": 25,
        "team_away_id": 27,
        "start_time": 1529755200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Belgium",
        "team_away_name": "Tunisia"
      }, {
        "id": 40,
        "external_id": "30",
        "type": "groups",
        "sub_type": "g",
        "team_home_id": 28,
        "team_away_id": 26,
        "start_time": 1529841600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "England",
        "team_away_name": "Panama"
      }, {
        "id": 41,
        "external_id": "45",
        "type": "groups",
        "sub_type": "g",
        "team_home_id": 28,
        "team_away_id": 25,
        "start_time": 1530208800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "England",
        "team_away_name": "Belgium"
      }, {
        "id": 42,
        "external_id": "46",
        "type": "groups",
        "sub_type": "g",
        "team_home_id": 26,
        "team_away_id": 27,
        "start_time": 1530208800,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Panama",
        "team_away_name": "Tunisia"
      }
    ],
    "h": [
      {
        "id": 43,
        "external_id": "15",
        "type": "groups",
        "sub_type": "h",
        "team_home_id": 29,
        "team_away_id": 30,
        "start_time": 1529420400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Poland",
        "team_away_name": "Senegal"
      }, {
        "id": 44,
        "external_id": "16",
        "type": "groups",
        "sub_type": "h",
        "team_home_id": 31,
        "team_away_id": 32,
        "start_time": 1529409600,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Colombia",
        "team_away_name": "Japan"
      }, {
        "id": 45,
        "external_id": "31",
        "type": "groups",
        "sub_type": "h",
        "team_home_id": 29,
        "team_away_id": 31,
        "start_time": 1529852400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Poland",
        "team_away_name": "Colombia"
      }, {
        "id": 46,
        "external_id": "32",
        "type": "groups",
        "sub_type": "h",
        "team_home_id": 32,
        "team_away_id": 30,
        "start_time": 1529863200,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Japan",
        "team_away_name": "Senegal"
      }, {
        "id": 47,
        "external_id": "47",
        "type": "groups",
        "sub_type": "h",
        "team_home_id": 32,
        "team_away_id": 29,
        "start_time": 1530194400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Japan",
        "team_away_name": "Poland"
      }, {
        "id": 48,
        "external_id": "48",
        "type": "groups",
        "sub_type": "h",
        "team_home_id": 30,
        "team_away_id": 31,
        "start_time": 1530194400,
        "result_home": null,
        "result_away": null,
        "score": null,
        "created_at": "2018-05-12 10:28:26",
        "updated_at": "2018-05-12 10:28:26",
        "team_home_name": "Senegal",
        "team_away_name": "Colombia"
      }
    ]
  }
};

module.exports = a;


},{}],32:[function(require,module,exports){
var BetsModel, GameModel, GameView, GamesCollectionView, GroupStageView, GroupTableView, GroupView, GroupsCollection, GroupsView, MainForm, MainView, OpenBets, ScoreSelection, ScoreView, example, gameTmpl, groupStageTmpl, groupTmpl, mainFormTmpl, scoreSelectTmpl, scoreTmpl, tableTmpl, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

tableTmpl = require('./tmpl/table.hbs');

groupTmpl = require('./tmpl/group.hbs');

groupStageTmpl = require('./tmpl/group_stage.hbs');

gameTmpl = require('./tmpl/game.hbs');

MainView = require('../layout/layout.coffee').MainView;

scoreTmpl = require('./tmpl/score.hbs');

scoreSelectTmpl = require('./tmpl/scoreSelect.hbs');

GameModel = require('./models.coffee').GameModel;

BetsModel = require('./models.coffee').BetsModel;

GroupsCollection = require('./models.coffee').GroupsCollection;

mainFormTmpl = require('./tmpl/main_form.hbs');

example = require('./groups_example.coffee');

utils = require('../utils.coffee');

ScoreSelection = (function(superClass) {
  extend(ScoreSelection, superClass);

  function ScoreSelection() {
    this.initialize = bind(this.initialize, this);
    this.onRender = bind(this.onRender, this);
    this.triggerChange = bind(this.triggerChange, this);
    this.scoreChange = bind(this.scoreChange, this);
    return ScoreSelection.__super__.constructor.apply(this, arguments);
  }

  ScoreSelection.prototype.template = scoreSelectTmpl;

  ScoreSelection.prototype.className = "ScoreSelection";

  ScoreSelection.prototype.ui = {
    buttons: '.btn'
  };

  ScoreSelection.prototype.events = {
    'click @ui.buttons': 'scoreChange'
  };

  ScoreSelection.prototype.scoreChange = function(e) {
    var target;
    target = $(e.currentTarget);
    this.value = target.attr('data-val');
    this.value = this.value === '?' ? void 0 : this.value;
    return this.triggerChange();
  };

  ScoreSelection.prototype.triggerChange = function() {
    return this.trigger('change', this.value);
  };

  ScoreSelection.prototype.onRender = function() {
    return this.$el.addClass(this.extraClass);
  };

  ScoreSelection.prototype.initialize = function(options) {
    this.value = options.value;
    this.extraClass = options["class"];
    return this.scoresOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?'];
  };

  ScoreSelection.prototype.serializeData = function() {
    return {
      scores: this.scoresOpts
    };
  };

  return ScoreSelection;

})(Marionette.ItemView);

ScoreView = (function(superClass) {
  extend(ScoreView, superClass);

  function ScoreView() {
    this.initialize = bind(this.initialize, this);
    this.dismissSelection = bind(this.dismissSelection, this);
    this.setScore = bind(this.setScore, this);
    this.changeScore = bind(this.changeScore, this);
    return ScoreView.__super__.constructor.apply(this, arguments);
  }

  ScoreView.prototype.template = scoreTmpl;

  ScoreView.prototype.className = "ScoreView";

  ScoreView.prototype.regions = {
    selectRegion: '.setRegion'
  };

  ScoreView.prototype.ui = {
    score: '.score_select'
  };

  ScoreView.prototype.events = {
    'click @ui.score': 'changeScore'
  };

  ScoreView.prototype.changeScore = function() {
    console.log('here');
    this.trigger('open', this);
    this.select = new ScoreSelection({
      value: this.score,
      "class": this.key
    });
    this.listenTo(this.select, 'change', this.setScore);
    return this.selectRegion.show(this.select);
  };

  ScoreView.prototype.setScore = function(value) {
    if (value != null) {
      value = Number(value);
    }
    this.model.set(this.key, value);
    this.trigger('change');
    return this.render();
  };

  ScoreView.prototype.dismissSelection = function() {
    return this.selectRegion.reset();
  };

  ScoreView.prototype.initialize = function(options) {
    this.model = options.model;
    return this.key = options.key;
  };

  ScoreView.prototype.serializeData = function() {
    var score;
    score = this.model.get(this.key);
    if (score === 0) {
      score = '0';
    }
    return {
      score: score
    };
  };

  return ScoreView;

})(Marionette.LayoutView);

GroupTableView = (function(superClass) {
  extend(GroupTableView, superClass);

  function GroupTableView() {
    this.serializeData = bind(this.serializeData, this);
    return GroupTableView.__super__.constructor.apply(this, arguments);
  }

  GroupTableView.prototype.template = tableTmpl;

  GroupTableView.prototype.tagName = 'table';

  GroupTableView.prototype.className = 'table';

  GroupTableView.prototype.serializeData = function() {
    var modelTable, table;
    modelTable = this.model.getTable();
    table = _.map(modelTable, (function(_this) {
      return function(team, index) {
        var data, score;
        score = team.getData();
        data = {
          gf: score.gf,
          ga: score.ga,
          gd: score.gf - score.ga,
          points: score.points,
          played: score.games,
          rank: index + 1,
          name: utils.getHebName(team.get('name'))
        };
        console.log(data, 'datas ');
        return data;
      };
    })(this));
    return {
      table: table
    };
  };

  return GroupTableView;

})(Marionette.LayoutView);

GameView = (function(superClass) {
  extend(GameView, superClass);

  function GameView() {
    this.serializeData = bind(this.serializeData, this);
    this.selectionOpened = bind(this.selectionOpened, this);
    this.triggerChange = bind(this.triggerChange, this);
    this.onRender = bind(this.onRender, this);
    return GameView.__super__.constructor.apply(this, arguments);
  }

  GameView.prototype.template = gameTmpl;

  GameView.prototype.className = 'GameView';

  GameView.prototype.regions = {
    awayRegion: '.awayScore',
    homeRegion: '.homeScore'
  };

  GameView.prototype.onRender = function() {
    this.homeScore = new ScoreView({
      model: this.model,
      key: 'result_home'
    });
    this.awayScore = new ScoreView({
      model: this.model,
      key: 'result_away'
    });
    this.listenTo(this.awayScore, 'open', this.selectionOpened);
    this.listenTo(this.homeScore, 'open', this.selectionOpened);
    this.listenTo(this.homeScore, 'change', this.triggerChange);
    this.listenTo(this.awayScore, 'change', this.triggerChange);
    this.awayRegion.show(this.awayScore);
    return this.homeRegion.show(this.homeScore);
  };

  GameView.prototype.triggerChange = function() {
    return this.trigger('change');
  };

  GameView.prototype.selectionOpened = function(selection) {
    if (this.openSelection === selection) {
      return;
    }
    if (this.openSelection) {
      this.openSelection.dismissSelection();
    }
    this.openSelection = selection;
    return this.trigger('selection_open', selection);
  };

  GameView.prototype.serializeData = function(options) {
    return {
      home: this.model.getHomeName(),
      away: this.model.getAwayName()
    };
  };

  return GameView;

})(Marionette.LayoutView);

GamesCollectionView = (function(superClass) {
  extend(GamesCollectionView, superClass);

  function GamesCollectionView() {
    this.triggerChange = bind(this.triggerChange, this);
    this.selectionOpened = bind(this.selectionOpened, this);
    return GamesCollectionView.__super__.constructor.apply(this, arguments);
  }

  GamesCollectionView.prototype.childView = GameView;

  GamesCollectionView.prototype.className = 'GamesCollectionView';

  GamesCollectionView.prototype.childEvents = {
    'selection_open': 'selectionOpened',
    'change': 'triggerChange'
  };

  GamesCollectionView.prototype.selectionOpened = function(child, selection) {
    return this.children.each(function(game) {
      return game.selectionOpened(selection);
    });
  };

  GamesCollectionView.prototype.triggerChange = function() {
    return this.trigger('change');
  };

  return GamesCollectionView;

})(Marionette.CollectionView);

GroupView = (function(superClass) {
  extend(GroupView, superClass);

  function GroupView() {
    this.renderTable = bind(this.renderTable, this);
    this.onRender = bind(this.onRender, this);
    return GroupView.__super__.constructor.apply(this, arguments);
  }

  GroupView.prototype.template = groupTmpl;

  GroupView.prototype.className = 'GroupView rtl';

  GroupView.prototype.regions = {
    gamesRegion: '.games',
    tableRegion: '.groupTable'
  };

  GroupView.prototype.onRender = function() {
    this.gamesView = new GamesCollectionView({
      collection: this.model.gamesCollection
    });
    this.listenTo(this.gamesView, 'change', this.renderTable);
    this.gamesRegion.show(this.gamesView);
    return this.renderTable();
  };

  GroupView.prototype.renderTable = function() {
    this.tableView = new GroupTableView({
      model: this.model
    });
    return this.tableRegion.show(this.tableView);
  };


  /*serializeData: =>
      modelTable = @model.getTable()
      table = _.map(modelTable, (team, index)=>
          score = team.getData()
          return {
              gf: score.gf
              ga: score.ga
              gd: score.gf - score.ga
              points: score.points
              played: _.keys(team.games).length
              rank: index + 1
              name: utils.getHebName(team.get('name'))
          }
      )
      games = _.map(@model.gamesCollection.models, (model)=>
          return
              team_away_name: utils.getHebName(model.get('team_away_name'))
              team_home_name: utils.getHebName(model.get('team_home_name'))
              result_away: model.get('result_away')
              result_home: model.get('result_home')
      )
      #console.log(@model, 'model')
      return {
          games: games
      }
   */

  return GroupView;

})(Marionette.LayoutView);

GroupsView = (function(superClass) {
  extend(GroupsView, superClass);

  function GroupsView() {
    return GroupsView.__super__.constructor.apply(this, arguments);
  }

  GroupsView.prototype.childView = GroupView;

  return GroupsView;

})(Marionette.CollectionView);

GroupStageView = (function(superClass) {
  extend(GroupStageView, superClass);

  function GroupStageView() {
    this.serializeData = bind(this.serializeData, this);
    this.initialize = bind(this.initialize, this);
    this.onRender = bind(this.onRender, this);
    return GroupStageView.__super__.constructor.apply(this, arguments);
  }

  GroupStageView.prototype.template = groupStageTmpl;

  GroupStageView.prototype.className = 'GroupStageView';

  GroupStageView.prototype.regions = {
    groupRegion: '.groups'
  };

  GroupStageView.prototype.onRender = function() {
    var group, groupView, i, id, len, obj, ref, results;
    ref = this.groups;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      group = ref[i];
      id = group.getId();
      this.addRegions((
        obj = {},
        obj["group_" + id + "_region"] = "#group_" + id.toUpperCase(),
        obj
      ));
      groupView = new GroupView({
        model: group
      });
      results.push(this["group_" + id + "_region"].show(groupView));
    }
    return results;
  };

  GroupStageView.prototype.initialize = function(options) {
    this.betsModel = options.betsModel;
    return this.groups = this.betsModel.groupsCollection.models;
  };

  GroupStageView.prototype.serializeData = function() {
    var groups;
    groups = _.map(this.groups, function(model, index) {
      return {
        id: model.getId().toUpperCase(),
        selected: index === 0
      };
    }).reverse();
    return {
      groups: groups
    };
  };

  return GroupStageView;

})(Marionette.LayoutView);

MainForm = (function(superClass) {
  extend(MainForm, superClass);

  function MainForm() {
    this.initialize = bind(this.initialize, this);
    this.onRender = bind(this.onRender, this);
    return MainForm.__super__.constructor.apply(this, arguments);
  }

  MainForm.prototype.template = mainFormTmpl;

  MainForm.prototype.className = 'MainForm';

  MainForm.prototype.regions = {
    groupsRegion: '#groups',
    specialRegion: '#special'
  };

  MainForm.prototype.onRender = function() {
    this.groupStageView = new GroupStageView({
      betsModel: this.betsModel
    });
    return this.groupsRegion.show(this.groupStageView);
  };

  MainForm.prototype.initialize = function(options) {
    return this.betsModel = options.betsModel;
  };

  return MainForm;

})(Marionette.LayoutView);

OpenBets = (function(superClass) {
  extend(OpenBets, superClass);

  function OpenBets() {
    this.onRender = bind(this.onRender, this);
    this.getOpenBets = bind(this.getOpenBets, this);
    this.initialize = bind(this.initialize, this);
    return OpenBets.__super__.constructor.apply(this, arguments);
  }

  OpenBets.prototype.type = 'open_bets';

  OpenBets.prototype.regions = {
    menuRegion: '.menuRegion',
    contentRegion: '.contentRegion'
  };

  OpenBets.prototype.initialize = function(options) {
    var openBets;
    this.title = 'משחקים פתוחים';
    openBets = this.getOpenBets();
    return this.betsModel = new BetsModel(openBets);
  };

  OpenBets.prototype.getOpenBets = function() {
    return example;
  };

  OpenBets.prototype.onRender = function() {
    this.content = new MainForm({
      betsModel: this.betsModel
    });
    return this.contentRegion.show(this.content);
  };

  return OpenBets;

})(MainView);

module.exports = OpenBets;


},{"../layout/layout.coffee":24,"../utils.coffee":43,"./groups_example.coffee":31,"./models.coffee":33,"./tmpl/game.hbs":34,"./tmpl/group.hbs":35,"./tmpl/group_stage.hbs":36,"./tmpl/main_form.hbs":37,"./tmpl/score.hbs":38,"./tmpl/scoreSelect.hbs":39,"./tmpl/table.hbs":40}],33:[function(require,module,exports){
var BetsModel, GameModel, GamesCollection, GroupModel, GroupsCollection, TeamModel, TeamsCollection, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

utils = require('../utils.coffee');

BetsModel = (function(superClass) {
  extend(BetsModel, superClass);

  function BetsModel() {
    this.initialize = bind(this.initialize, this);
    this.getData = bind(this.getData, this);
    this.createGroupModels = bind(this.createGroupModels, this);
    this.getGroupsData = bind(this.getGroupsData, this);
    return BetsModel.__super__.constructor.apply(this, arguments);
  }

  BetsModel.prototype.getGroupsData = function() {
    return this.get('groups');
  };

  BetsModel.prototype.createGroupModels = function() {
    var group, groupData, groupGames, groups, ref;
    groups = [];
    ref = this.getGroupsData();
    for (group in ref) {
      groupGames = ref[group];
      groupData = {
        id: group,
        games: groupGames
      };
      groups.push(groupData);
    }
    return this.groupsCollection = new GroupsCollection(groups);
  };

  BetsModel.prototype.getData = function() {
    var bets;
    bets = [];
    _.each(this.groupsCollection, group, games.push(group.getData()));
    return axios.post('api/bets', bets);
  };

  BetsModel.prototype.initialize = function(options) {
    return this.createGroupModels();
  };

  return BetsModel;

})(Backbone.Model);

GameModel = (function(superClass) {
  extend(GameModel, superClass);

  function GameModel() {
    this.getData = bind(this.getData, this);
    this.getType = bind(this.getType, this);
    this.getId = bind(this.getId, this);
    this.isFinished = bind(this.isFinished, this);
    this.setAwayScore = bind(this.setAwayScore, this);
    this.setHomeScore = bind(this.setHomeScore, this);
    this.getAwayScore = bind(this.getAwayScore, this);
    this.getHomeScore = bind(this.getHomeScore, this);
    this.getGroup = bind(this.getGroup, this);
    this.getAwayName = bind(this.getAwayName, this);
    this.getAwayTeam = bind(this.getAwayTeam, this);
    this.getHomeName = bind(this.getHomeName, this);
    this.getHomeTeam = bind(this.getHomeTeam, this);
    return GameModel.__super__.constructor.apply(this, arguments);
  }

  GameModel.prototype.getHomeTeam = function() {
    return this.get('team_home_id');
  };

  GameModel.prototype.getHomeName = function() {
    return utils.getHebName(this.get('team_home_name'));
  };

  GameModel.prototype.getAwayTeam = function() {
    return this.get('team_away_id');
  };

  GameModel.prototype.getAwayName = function() {
    return utils.getHebName(this.get('team_away_name'));
  };

  GameModel.prototype.getGroup = function() {
    return this.get('sub_type');
  };

  GameModel.prototype.getHomeScore = function() {
    return this.get('result_home');
  };

  GameModel.prototype.getAwayScore = function() {
    return this.get('result_away');
  };

  GameModel.prototype.setHomeScore = function(value) {
    return this.set('result_home', value);
  };

  GameModel.prototype.setAwayScore = function(value) {
    return this.set('result_away', value);
  };

  GameModel.prototype.isFinished = function() {
    console.log(this.getAwayScore(), this.getHomeScore(), 'resss');
    return (this.getAwayScore() != null) && (this.getHomeScore() != null);
  };

  GameModel.prototype.getId = function() {
    return this.get('id');
  };

  GameModel.prototype.getType = function() {
    if (this.model.get('type') === 'groups') {
      return 1;
    }
  };

  GameModel.prototype.getData = function() {
    if (this.isFinished() == null) {
      return;
    }
    return {
      'type_id': this.getId(),
      'type': this.getType(),
      'data': {
        'result_home': this.getHomeScore(),
        'result_away': this.getAwayScore()
      }
    };
  };

  return GameModel;

})(Backbone.Model);

TeamModel = (function(superClass) {
  extend(TeamModel, superClass);

  function TeamModel() {
    this.compareWith = bind(this.compareWith, this);
    this.getData = bind(this.getData, this);
    this.getGameScore = bind(this.getGameScore, this);
    this.updateGame = bind(this.updateGame, this);
    this.getId = bind(this.getId, this);
    this.initialize = bind(this.initialize, this);
    return TeamModel.__super__.constructor.apply(this, arguments);
  }

  TeamModel.prototype.initialize = function(options) {
    this.name = this.get('name');
    return this.games = {};
  };

  TeamModel.prototype.getId = function() {
    return this.get('id');
  };

  TeamModel.prototype.updateGame = function(game) {
    return this.games[game.getId()] = game;
  };

  TeamModel.prototype.getGameScore = function(game) {
    if (!game.isFinished()) {
      return void 0;
    }
    if (game.getHomeTeam() === this.getId()) {
      return {
        gf: game.getHomeScore(),
        ga: game.getAwayScore()
      };
    } else {
      return {
        gf: game.getAwayScore(),
        ga: game.getHomeScore()
      };
    }
  };

  TeamModel.prototype.getData = function(teams) {
    var against, ga, game, games, gf, id, points, ref, score, totalGA, totalGF;
    points = 0;
    totalGF = 0;
    totalGA = 0;
    games = 0;
    ref = this.games;
    for (id in ref) {
      game = ref[id];
      score = this.getGameScore(game);
      if (score == null) {
        continue;
      }
      gf = score.gf;
      ga = score.ga;
      if (this.getId() === game.getHomeTeam()) {
        against = game.getAwayTeam();
      } else {
        against = game.getHomeTeam();
      }
      if ((teams != null) && teams.indexOf(against) === -1) {
        continue;
      }
      games += 1;
      if ((gf != null) && (ga != null)) {
        if (gf > ga) {
          points += 3;
        } else if (gf === ga) {
          points += 1;
        }
        totalGF += gf;
        totalGA += ga;
      }
    }
    return {
      points: points,
      gf: totalGF,
      ga: totalGA,
      games: games
    };
  };

  TeamModel.prototype.compareWith = function(team, miniTableTeams) {
    var myData, myDiff, opData, opDiff;
    if (miniTableTeams != null) {
      myData = this.getData(miniTableTeams);
      opData = team.getData(miniTableTeams);
    } else {
      myData = this.getData();
      opData = team.getData();
    }
    if (opData.points < myData.points) {
      return 1;
    } else if (opData.points > myData.points) {
      return 2;
    } else {
      opDiff = opData.gf - opData.ga;
      myDiff = myData.gf - myData.ga;
      if (opDiff < myDiff) {
        return 1;
      } else if (opDiff > myDiff) {
        return 2;
      } else {
        if (opData.gf < myData.gf) {
          return 1;
        } else if (opData.gf > myData.gf) {
          return 2;
        } else {
          return 'x';
        }
      }
    }
  };

  return TeamModel;

})(Backbone.Model);

GroupModel = (function(superClass) {
  extend(GroupModel, superClass);

  function GroupModel() {
    this.initialize = bind(this.initialize, this);
    this.createTeamModels = bind(this.createTeamModels, this);
    this.getMiniTablePos = bind(this.getMiniTablePos, this);
    this.getTable = bind(this.getTable, this);
    this.updateGame = bind(this.updateGame, this);
    this.getId = bind(this.getId, this);
    this.getData = bind(this.getData, this);
    this.getGamesData = bind(this.getGamesData, this);
    this.fakeGame = bind(this.fakeGame, this);
    this.getGames = bind(this.getGames, this);
    return GroupModel.__super__.constructor.apply(this, arguments);
  }

  GroupModel.prototype.getGames = function() {
    return this.get('games');
  };

  GroupModel.prototype.fakeGame = function(game) {
    return game.trigger('change', game);
  };

  GroupModel.prototype.getGamesData = function() {
    var games;
    games = [];
    _.each(this.gamesCollection.models, (function(_this) {
      return function(game) {
        var data;
        data = game.getData();
        if (data != null) {
          return games.push(data);
        }
      };
    })(this));
    return games;
  };

  GroupModel.prototype.getData = function() {
    var games, groupData, table;
    games = this.getGamesData();
    table = _.map(this.getTable(), (function(_this) {
      return function(team) {
        return team.get('name');
      };
    })(this));
    groupData = {
      'type': 2,
      'type_id': this.getId(),
      'data': table
    };
    return games.concat(groupData);
  };

  GroupModel.prototype.getId = function() {
    return this.get('id');
  };

  GroupModel.prototype.updateGame = function(game) {
    var away, home;
    home = game.getHomeTeam();
    away = game.getAwayTeam();
    home = _.find(this.teamsCollection.models, (function(_this) {
      return function(team) {
        return team.getId() === game.getHomeTeam();
      };
    })(this));
    away = _.find(this.teamsCollection.models, (function(_this) {
      return function(team) {
        return team.getId() === game.getAwayTeam();
      };
    })(this));
    away.updateGame(game);
    return home.updateGame(game);
  };

  GroupModel.prototype.getTable = function() {
    var i, index, j, len, len1, miniTable, miniTableIndex, table, team, teamsArray;
    table = [];
    this.teamsCollection.models.forEach((function(_this) {
      return function(team) {
        var compare, i, index, isTeamArray, len, results, tableTeam;
        if (table.length === 0) {
          return table.push(team);
        } else {
          results = [];
          for (index = i = 0, len = table.length; i < len; index = ++i) {
            tableTeam = table[index];
            isTeamArray = tableTeam instanceof Array;
            if (isTeamArray) {
              compare = team.compareWith(tableTeam[0]);
            } else {
              compare = team.compareWith(tableTeam);
            }
            if (compare === 1) {
              table.splice(index, 0, team);
              break;
            } else if (compare === 'x') {
              if (isTeamArray) {
                tableTeam.push(team);
                break;
              } else {
                table[index] = [tableTeam, team];
                break;
              }
            } else if (index === table.length - 1) {
              results.push(table.push(team));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      };
    })(this));
    for (index = i = 0, len = table.length; i < len; index = ++i) {
      teamsArray = table[index];
      if (teamsArray instanceof Array) {
        miniTable = this.getMiniTablePos(teamsArray);
        for (miniTableIndex = j = 0, len1 = miniTable.length; j < len1; miniTableIndex = ++j) {
          team = miniTable[miniTableIndex];
          if (miniTableIndex + 1 === miniTable.length) {
            table.splice(index + miniTableIndex, 1, team);
          } else {
            table.splice(index + miniTableIndex, 0, team);
          }
        }
      }
    }
    return table;
  };

  GroupModel.prototype.getMiniTablePos = function(teams) {
    var compare, i, index, j, len, len1, table, tableTeam, team;
    table = [];
    for (index = i = 0, len = teams.length; i < len; index = ++i) {
      team = teams[index];
      if (table.length === 0) {
        table = [team];
      } else {
        for (index = j = 0, len1 = table.length; j < len1; index = ++j) {
          tableTeam = table[index];
          compare = team.compareWith(tableTeam, teams);
        }
        if (compare === 1) {
          table.splice(index, 0, team);
        } else if (compare === 'x') {
          table.splice(index + 1, 0, team);
        }
      }
    }
    return table;
  };

  GroupModel.prototype.createTeamModels = function() {
    var away_data, game, home_data, i, len, ref, teams;
    teams = [];
    ref = this.getGames();
    for (i = 0, len = ref.length; i < len; i++) {
      game = ref[i];
      away_data = {
        id: game.team_away_id,
        name: game.team_away_name
      };
      home_data = {
        id: game.team_home_id,
        name: game.team_home_name
      };
      if (indexOf.call(teams, home_data) < 0) {
        teams.push(home_data);
      }
      if (indexOf.call(teams, away_data) < 0) {
        teams.push(away_data);
      }
    }
    return this.teamsCollection = new TeamsCollection(teams);
  };

  GroupModel.prototype.initialize = function(options) {
    console.log(this);
    this.name = this.get('id');
    this.createTeamModels();
    this.gamesCollection = new GamesCollection(this.getGames());
    this.listenTo(this.gamesCollection, 'change', this.updateGame);
    return this.gamesCollection.models.forEach((function(_this) {
      return function(model) {
        return _this.fakeGame(model);
      };
    })(this));
  };

  return GroupModel;

})(Backbone.Model);

TeamsCollection = (function(superClass) {
  extend(TeamsCollection, superClass);

  function TeamsCollection() {
    return TeamsCollection.__super__.constructor.apply(this, arguments);
  }

  TeamsCollection.prototype.model = TeamModel;

  return TeamsCollection;

})(Backbone.Collection);

GamesCollection = (function(superClass) {
  extend(GamesCollection, superClass);

  function GamesCollection() {
    return GamesCollection.__super__.constructor.apply(this, arguments);
  }

  GamesCollection.prototype.model = GameModel;


  /*modelEvents:
      'change': 'gameChanged'
  
  gameChanged: (model)=>
      @trigger('change', model)
   */

  return GamesCollection;

})(Backbone.Collection);

GroupsCollection = (function(superClass) {
  extend(GroupsCollection, superClass);

  function GroupsCollection() {
    return GroupsCollection.__super__.constructor.apply(this, arguments);
  }

  GroupsCollection.prototype.model = GroupModel;

  return GroupsCollection;

})(Backbone.Collection);

module.exports = {
  GameModel: GameModel,
  GroupModel: GroupModel,
  TeamModel: TeamModel,
  BetsModel: BetsModel,
  GroupsCollection: GroupsCollection
};


},{"../utils.coffee":43}],34:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"container home_team\">\n    <div class=\"homeScore\"></div>\n    <div class=\"home\">"
    + alias4(((helper = (helper = helpers.home || (depth0 != null ? depth0.home : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"home","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"homeFlag\">flag"
    + alias4(((helper = (helper = helpers.homeFlag || (depth0 != null ? depth0.homeFlag : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"homeFlag","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n<div class=\"container away_team\">\n    <div class=\"awayScore\"></div>\n    <div class=\"away\">"
    + alias4(((helper = (helper = helpers.away || (depth0 != null ? depth0.away : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"away","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"awayFlag\">flag"
    + alias4(((helper = (helper = helpers.awayFlag || (depth0 != null ? depth0.awayFlag : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"awayFlag","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],35:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"game_result\">\n        <span>"
    + alias4(((helper = (helper = helpers.team_home_name || (depth0 != null ? depth0.team_home_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"team_home_name","hash":{},"data":data}) : helper)))
    + "</span> - <span>"
    + alias4(((helper = (helper = helpers.result_home || (depth0 != null ? depth0.result_home : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"result_home","hash":{},"data":data}) : helper)))
    + "</span>\n        <span>   :   </span>\n        <span>"
    + alias4(((helper = (helper = helpers.team_away_name || (depth0 != null ? depth0.team_away_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"team_away_name","hash":{},"data":data}) : helper)))
    + "</span> - <span>"
    + alias4(((helper = (helper = helpers.result_away || (depth0 != null ? depth0.result_away : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"result_away","hash":{},"data":data}) : helper)))
    + "</span>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"groupTable\"></div>\n<!--div class=\"results\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.games : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div-->\n<div class=\"games\"></div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],36:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <li class=\"nav-item\">\n        <a class=\"nav-link\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-tab\" data-toggle=\"tab\" href=\"#group_"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" role=\"tab\" aria-controls=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" aria-selected=\""
    + alias4(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data}) : helper)))
    + "\"><span>"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "</span> בית</a>\n    </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div class=\"tab-pane fade "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\"group_"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" role=\"tabpanel\" aria-labelledby=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-tab\"></div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "show active";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<ul class=\"nav nav-tabs nav-justified\" id=\"myTab\" role=\"tablist\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.groups : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n<div class=\"container\">\n    <div class=\"tab-content\" id=\"myTabContent\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.groups : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"groups\"></div>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],37:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<ul class=\"nav nav-tabs nav-justified\" id=\"myTab\" role=\"tablist\">\n    <li class=\"nav-item\">\n        <a class=\"nav-link special\" id=\"special-tab\" data-toggle=\"tab\" href=\"#special\" role=\"tab\" aria-controls=\"special\" aria-selected=\"false\">הימורים מיוחדים</a>\n    </li>\n    <li class=\"nav-item\">\n        <a class=\"nav-link active groups\" id=\"groups-tab\" data-toggle=\"tab\" href=\"#groups\" role=\"tab\" aria-controls=\"groups\" aria-selected=\"true\">בתים</a>\n    </li>\n</ul>\n<div class=\"tab-content\" id=\"myTabContent\">\n    <div class=\"tab-pane fade\" id=\"special\" role=\"tabpanel\" aria-labelledby=\"special-tab\"></div>\n    <div class=\"tab-pane fade show active\" id=\"groups\" role=\"tabpanel\" aria-labelledby=\"groups-tab\"></div>\n</div>\n<button class=\"btn btn-lg btn-success btn-block\">שלח</button>\n";
},"useData":true});

},{"hbsfy/runtime":20}],38:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <span class=\"score score_select\">"
    + container.escapeExpression(((helper = (helper = helpers.score || (depth0 != null ? depth0.score : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"score","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <span class=\"score_select badge badge-primary\">בחר</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.score : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "<div class=\"setRegion\"></div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],39:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <button type=\"button\" data-val="
    + alias2(alias1(depth0, depth0))
    + " class=\"btn btn-primary\">"
    + alias2(alias1(depth0, depth0))
    + "</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"btn-group\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.scores : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],40:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <tr>\n        <td>"
    + alias4(((helper = (helper = helpers.gd || (depth0 != null ? depth0.gd : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gd","hash":{},"data":data}) : helper)))
    + "</td>\n        <td>"
    + alias4(((helper = (helper = helpers.ga || (depth0 != null ? depth0.ga : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ga","hash":{},"data":data}) : helper)))
    + "</td>\n        <td>"
    + alias4(((helper = (helper = helpers.gf || (depth0 != null ? depth0.gf : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"gf","hash":{},"data":data}) : helper)))
    + "</td>\n        <td>"
    + alias4(((helper = (helper = helpers.points || (depth0 != null ? depth0.points : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"points","hash":{},"data":data}) : helper)))
    + "</td>\n        <td>"
    + alias4(((helper = (helper = helpers.played || (depth0 != null ? depth0.played : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"played","hash":{},"data":data}) : helper)))
    + "</td>\n        <td>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n        <th scope=\"row\">"
    + alias4(((helper = (helper = helpers.rank || (depth0 != null ? depth0.rank : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rank","hash":{},"data":data}) : helper)))
    + "</th>\n    </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<thead>\n    <tr>\n        <th scope=\"col\">הפרש</th>\n        <th scope=\"col\">חובה</th>\n        <th scope=\"col\">זכות</th>\n        <th scope=\"col\">נקודות</th>\n        <th scope=\"col\">משחקים</th>\n        <th scope=\"col\">קבוצה</th>\n        <th scope=\"col\">#</th>\n    </tr>\n</thead>\n<tbody>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.table : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</tbody>\n";
},"useData":true});

},{"hbsfy/runtime":20}],41:[function(require,module,exports){
var SignInLayout, signInTmpl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

signInTmpl = require('./tmpl/sign_in.hbs');

SignInLayout = (function(superClass) {
  extend(SignInLayout, superClass);

  function SignInLayout() {
    this.signIn = bind(this.signIn, this);
    return SignInLayout.__super__.constructor.apply(this, arguments);
  }

  SignInLayout.prototype.template = signInTmpl;

  SignInLayout.prototype.className = "signInView";

  SignInLayout.prototype.type = 'login';

  SignInLayout.prototype.ui = {
    form: '.form-signin',
    password: '#inputPassword',
    email: '#inputEmail'
  };

  SignInLayout.prototype.events = {
    'submit @ui.form': 'signIn'
  };

  SignInLayout.prototype.signIn = function(e) {
    var api, postData;
    e.preventDefault();
    postData = {
      email: this.ui.email.val(),
      password: this.ui.password.val()
    };
    api = '/api/login';
    return axios.post(api, postData).then((function(_this) {
      return function(response) {
        var user;
        user = response.data;
        return _this.trigger('sing_in', user);
      };
    })(this))["catch"]((function(_this) {
      return function(error) {
        return console.log(error);
      };
    })(this));
  };

  return SignInLayout;

})(Marionette.LayoutView);

module.exports = SignInLayout;


},{"./tmpl/sign_in.hbs":42}],42:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"container\">\n    <form class=\"form-signin\">\n        <h2 class=\"form-signin-heading\">התחבר</h2>\n        <label for=\"inputEmail\" class=\"sr-only\">Email address</label>\n        <input type=\"email\" id=\"inputEmail\" class=\"form-control\" placeholder=\"Email address\" required autofocus>\n        <label for=\"inputPassword\" class=\"sr-only\">Password</label>\n        <input type=\"password\" id=\"inputPassword\" class=\"form-control inputPassword\" placeholder=\"Password\" required>\n        <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">התחבר</button>\n    </form>\n</div>\n";
},"useData":true});

},{"hbsfy/runtime":20}],43:[function(require,module,exports){
var getHebName;

getHebName = function(eng) {
  var map, ref;
  map = {
    "Russia": "רוסיה",
    "Saudi Arabia": "ערב הסעודית",
    "Egypt": "מצרים",
    "Uruguay": "אורוגוואי",
    "Portugal": "פורטוגל",
    "Spain": "ספרד",
    "Morocco": "מרוקו",
    "Iran": "איראן",
    "France": "צרפת",
    "Australia": "אוסטרליה",
    "Peru": "פרו",
    "Denmark": "דנמרק",
    "Argentina": "ארגנטינה",
    "Iceland": "איסלנד",
    "Croatia": "קרואטיה",
    "Nigeria": "ניגריה",
    "Brazil": "ברזיל",
    "Switzerland": "שוויץ",
    "Costa Rica": "קוסטה ריקה",
    "Serbia": "סרביה",
    "Germany": "גרמניה",
    "Mexico": "מקסיקו",
    "Sweden": "שבדיה",
    "South Korea": "דרום קוריאה",
    "Belgium": "בלגיה",
    "Panama": "פנמה",
    "Tunisia": "תוניסיה",
    "England": "אנגליה",
    "Poland": "פולין",
    "Senegal": "סנגל",
    "Colombia": "קולומביה",
    "Japan": "יפן"
  };
  return (ref = map[eng]) != null ? ref : eng;
};

module.exports = {
  getHebName: getHebName
};


},{}]},{},[23])

//# sourceMappingURL=main.js.map
