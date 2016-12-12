window.CLOSURE_NO_DEPS = true; 'use strict';var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.define("goog.DEBUG", true);
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.define("goog.DISALLOW_TEST_ONLY_CODE", COMPILED && !goog.DEBUG);
goog.define("goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING", false);
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return name in goog.loadedModules_ ? goog.loadedModules_[name] : goog.getObjectByName(name);
    } else {
      return null;
    }
  }
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
goog.forwardDeclare("Document");
goog.forwardDeclare("HTMLScriptElement");
goog.forwardDeclare("XMLHttpRequest");
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_loadFlags) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    if (!opt_loadFlags || typeof opt_loadFlags === "boolean") {
      opt_loadFlags = opt_loadFlags ? {"module":"goog"} : {};
    }
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.loadFlags[path] = opt_loadFlags;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console["error"](msg);
  }
};
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      } else {
        return null;
      }
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.writeScripts_(path);
        return null;
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    goog.logToConsole_(errorMessage);
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.define("goog.LOAD_MODULE_USING_EVAL", true);
goog.define("goog.SEAL_MODULE_EXPORTS", goog.DEBUG);
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.define("goog.TRANSPILE", "detect");
goog.define("goog.TRANSPILER", "transpile.js");
if (goog.DEPENDENCIES_ENABLED) {
  goog.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return doc != null && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("SCRIPT");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var script = (scripts[i]);
      var src = script.src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (importScript(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document && goog.global.document.all);
  goog.importProcessedScript_ = function(src, isModule, needsTranspile) {
    var bootstrap = 'goog.retrieveAndExec_("' + src + '", ' + isModule + ", " + needsTranspile + ");";
    goog.importScript_("", bootstrap);
  };
  goog.queuedModules_ = [];
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        var path = queue[i];
        goog.maybeProcessDeferredPath_(path);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      var path = goog.getPathFromDeps_(name);
      goog.maybeProcessDeferredPath_(goog.basePath + path);
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    var loadFlags = path && goog.dependencies_.loadFlags[path] || {};
    if (path && (loadFlags["module"] == "goog" || goog.needsTranspile_(loadFlags["lang"]))) {
      var abspath = goog.basePath + path;
      return abspath in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModuleFromUrl = function(url) {
    goog.retrieveAndExec_(url, true, false);
  };
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write('<script type="text/javascript" src="' + src + '"></' + "script>");
  };
  goog.appendScriptSrcNode_ = function(src) {
    var doc = goog.global.document;
    var scriptEl = (doc.createElement("script"));
    scriptEl.type = "text/javascript";
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      if (opt_sourceText === undefined) {
        if (!goog.IS_OLD_IE_) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + opt_sourceText + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.needsTranspile_ = function(lang) {
    if (goog.TRANSPILE == "always") {
      return true;
    } else {
      if (goog.TRANSPILE == "never") {
        return false;
      } else {
        if (!goog.transpiledLanguages_) {
          goog.transpiledLanguages_ = {"es5":true, "es6":true, "es6-impl":true};
          try {
            goog.transpiledLanguages_["es5"] = eval("[1,].length!=1");
            var es6implTest = "let a={};const X=class{constructor(){}x(z){return new Map([" + "...arguments]).get(z[0])==3}};return new X().x([a,3])";
            var es6fullTest = "class X{constructor(){if(new.target!=String)throw 1;this.x=42}}" + "let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof " + "String))throw 1;for(const a of[2,3]){if(a==2)continue;function " + "f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()" + "==3}";
            if (eval('(()=>{"use strict";' + es6implTest + "})()")) {
              goog.transpiledLanguages_["es6-impl"] = false;
            }
            if (eval('(()=>{"use strict";' + es6fullTest + "})()")) {
              goog.transpiledLanguages_["es6"] = false;
            }
          } catch (err) {
          }
        }
      }
    }
    return !!goog.transpiledLanguages_[lang];
  };
  goog.transpiledLanguages_ = null;
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function(pathToLoad) {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    visitNode(pathToLoad);
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      goog.dependencies_.written[path] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    for (var i = 0;i < scripts.length;i++) {
      var path = scripts[i];
      if (path) {
        var loadFlags = deps.loadFlags[path] || {};
        var needsTranspile = goog.needsTranspile_(loadFlags["lang"]);
        if (loadFlags["module"] == "goog" || needsTranspile) {
          goog.importProcessedScript_(goog.basePath + path, loadFlags["module"] == "goog", needsTranspile);
        } else {
          goog.importScript_(goog.basePath + path);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:undefined, declareLegacyNamespace:false};
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {});
    } else {
      if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(undefined, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name "' + moduleName + '"');
    }
    if (goog.moduleLoaderState_.declareLegacyNamespace) {
      goog.constructNamespace_(moduleName, exports);
    } else {
      if (goog.SEAL_MODULE_EXPORTS && Object.seal) {
        Object.seal(exports);
      }
    }
    goog.loadedModules_[moduleName] = exports;
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};
goog.loadModuleFromSource_ = function() {
  var exports = {};
  eval(arguments[0]);
  return exports;
};
goog.normalizePath_ = function(path) {
  var components = path.split("/");
  var i = 0;
  while (i < components.length) {
    if (components[i] == ".") {
      components.splice(i, 1);
    } else {
      if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") {
        components.splice(--i, 2);
      } else {
        i++;
      }
    }
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    try {
      var xhr = new goog.global["XMLHttpRequest"];
      xhr.open("get", src, false);
      xhr.send();
      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
    } catch (err) {
      return null;
    }
  }
};
goog.retrieveAndExec_ = function(src, isModule, needsTranspile) {
  if (!COMPILED) {
    var originalPath = src;
    src = goog.normalizePath_(src);
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    var scriptText = goog.loadFileSync_(src);
    if (scriptText == null) {
      throw new Error('Load of "' + src + '" failed');
    }
    if (needsTranspile) {
      scriptText = goog.transpile_.call(goog.global, scriptText, src);
    }
    if (isModule) {
      scriptText = goog.wrapModule_(src, scriptText);
    } else {
      scriptText += "\n//# sourceURL=" + src;
    }
    var isOldIE = goog.IS_OLD_IE_;
    if (isOldIE) {
      goog.dependencies_.deferred[originalPath] = scriptText;
      goog.queuedModules_.push(originalPath);
    } else {
      importScript(src, scriptText);
    }
  }
};
goog.transpile_ = function(code, path) {
  var jscomp = goog.global["$jscomp"];
  if (!jscomp) {
    goog.global["$jscomp"] = jscomp = {};
  }
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER;
    var transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      eval(transpilerCode + "\n//# sourceURL=" + transpilerPath);
      jscomp = goog.global["$jscomp"];
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    var suffix = " requires transpilation but no transpiler was found.";
    transpile = jscomp.transpile = function(code, path) {
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  return transpile(code, path);
};
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if (obj !== null && "removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return (fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _evalTest_ = 1;");
        if (typeof goog.global["_evalTest_"] != "undefined") {
          try {
            delete goog.global["_evalTest_"];
          } catch (ignore) {
          }
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = (doc.createElement("SCRIPT"));
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + "-" + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = new Array(arguments.length - 2);
    for (var i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  var args = new Array(arguments.length - 2);
  for (var i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return ctr;
  }
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass);
  var wrappedCtr = function() {
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
    if (this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function) {
      Object.seal(instance);
    }
    return instance;
  };
  return wrappedCtr;
};
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("ol");
ol.DEBUG = true;
ol.ASSUME_TOUCH = false;
ol.DEFAULT_MAX_ZOOM = 42;
ol.DEFAULT_MIN_ZOOM = 0;
ol.DEFAULT_RASTER_REPROJECTION_ERROR_THRESHOLD = .5;
ol.DEFAULT_TILE_SIZE = 256;
ol.DEFAULT_WMS_VERSION = "1.3.0";
ol.DRAG_BOX_HYSTERESIS_PIXELS = 8;
ol.ENABLE_CANVAS = true;
ol.ENABLE_IMAGE = true;
ol.ENABLE_PROJ4JS = true;
ol.ENABLE_RASTER_REPROJECTION = true;
ol.ENABLE_TILE = true;
ol.ENABLE_VECTOR = true;
ol.ENABLE_VECTOR_TILE = true;
ol.ENABLE_WEBGL = true;
ol.INITIAL_ATLAS_SIZE = 256;
ol.MAX_ATLAS_SIZE = -1;
ol.MOUSEWHEELZOOM_MAXDELTA = 1;
ol.OVERVIEWMAP_MAX_RATIO = .75;
ol.OVERVIEWMAP_MIN_RATIO = .1;
ol.RASTER_REPROJECTION_MAX_SOURCE_TILES = 100;
ol.RASTER_REPROJECTION_MAX_SUBDIVISION = 10;
ol.RASTER_REPROJECTION_MAX_TRIANGLE_WIDTH = .25;
ol.SIMPLIFY_TOLERANCE = .5;
ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK = 1024;
ol.VERSION = "";
ol.WEBGL_MAX_TEXTURE_SIZE;
ol.WEBGL_EXTENSIONS;
ol.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = Object.create(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
};
ol.nullFunction = function() {
};
ol.getUid = function(obj) {
  return obj.ol_uid || (obj.ol_uid = ++ol.uidCounter_);
};
ol.uidCounter_ = 0;
goog.provide("ol.AssertionError");
goog.require("ol");
ol.AssertionError = function(code) {
  this.message = "Assertion failed. See " + (ol.VERSION ? "https://openlayers.org/en/" + ol.VERSION.split("-")[0] : "") + "/doc/errors/#" + code + " for details.";
  this.code = code;
  this.name = "AssertionError";
};
ol.inherits(ol.AssertionError, Error);
goog.provide("ol.asserts");
goog.require("ol.AssertionError");
ol.asserts.assert = function(assertion, errorCode) {
  if (!assertion) {
    throw new ol.AssertionError(errorCode);
  }
};
goog.provide("ol.obj");
ol.obj.assign = typeof Object.assign === "function" ? Object.assign : function(target, var_sources) {
  if (target === undefined || target === null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  var output = Object(target);
  for (var i = 1, ii = arguments.length;i < ii;++i) {
    var source = arguments[i];
    if (source !== undefined && source !== null) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          output[key] = source[key];
        }
      }
    }
  }
  return output;
};
ol.obj.clear = function(object) {
  for (var property in object) {
    delete object[property];
  }
};
ol.obj.getValues = function(object) {
  var values = [];
  for (var property in object) {
    values.push(object[property]);
  }
  return values;
};
ol.obj.isEmpty = function(object) {
  var property;
  for (property in object) {
    return false;
  }
  return !property;
};
goog.provide("ol.events");
goog.require("ol.obj");
ol.events.bindListener_ = function(listenerObj) {
  var boundListener = function(evt) {
    var listener = listenerObj.listener;
    var bindTo = listenerObj.bindTo || listenerObj.target;
    if (listenerObj.callOnce) {
      ol.events.unlistenByKey(listenerObj);
    }
    return listener.call(bindTo, evt);
  };
  listenerObj.boundListener = boundListener;
  return boundListener;
};
ol.events.findListener_ = function(listeners, listener, opt_this, opt_setDeleteIndex) {
  var listenerObj;
  for (var i = 0, ii = listeners.length;i < ii;++i) {
    listenerObj = listeners[i];
    if (listenerObj.listener === listener && listenerObj.bindTo === opt_this) {
      if (opt_setDeleteIndex) {
        listenerObj.deleteIndex = i;
      }
      return listenerObj;
    }
  }
  return undefined;
};
ol.events.getListeners = function(target, type) {
  var listenerMap = target.ol_lm;
  return listenerMap ? listenerMap[type] : undefined;
};
ol.events.getListenerMap_ = function(target) {
  var listenerMap = target.ol_lm;
  if (!listenerMap) {
    listenerMap = target.ol_lm = {};
  }
  return listenerMap;
};
ol.events.removeListeners_ = function(target, type) {
  var listeners = ol.events.getListeners(target, type);
  if (listeners) {
    for (var i = 0, ii = listeners.length;i < ii;++i) {
      target.removeEventListener(type, listeners[i].boundListener);
      ol.obj.clear(listeners[i]);
    }
    listeners.length = 0;
    var listenerMap = target.ol_lm;
    if (listenerMap) {
      delete listenerMap[type];
      if (Object.keys(listenerMap).length === 0) {
        delete target.ol_lm;
      }
    }
  }
};
ol.events.listen = function(target, type, listener, opt_this, opt_once) {
  var listenerMap = ol.events.getListenerMap_(target);
  var listeners = listenerMap[type];
  if (!listeners) {
    listeners = listenerMap[type] = [];
  }
  var listenerObj = ol.events.findListener_(listeners, listener, opt_this, false);
  if (listenerObj) {
    if (!opt_once) {
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = ({bindTo:opt_this, callOnce:!!opt_once, listener:listener, target:target, type:type});
    target.addEventListener(type, ol.events.bindListener_(listenerObj));
    listeners.push(listenerObj);
  }
  return listenerObj;
};
ol.events.listenOnce = function(target, type, listener, opt_this) {
  return ol.events.listen(target, type, listener, opt_this, true);
};
ol.events.unlisten = function(target, type, listener, opt_this) {
  var listeners = ol.events.getListeners(target, type);
  if (listeners) {
    var listenerObj = ol.events.findListener_(listeners, listener, opt_this, true);
    if (listenerObj) {
      ol.events.unlistenByKey(listenerObj);
    }
  }
};
ol.events.unlistenByKey = function(key) {
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.boundListener);
    var listeners = ol.events.getListeners(key.target, key.type);
    if (listeners) {
      var i = "deleteIndex" in key ? key.deleteIndex : listeners.indexOf(key);
      if (i !== -1) {
        listeners.splice(i, 1);
      }
      if (listeners.length === 0) {
        ol.events.removeListeners_(key.target, key.type);
      }
    }
    ol.obj.clear(key);
  }
};
ol.events.unlistenAll = function(target) {
  var listenerMap = ol.events.getListenerMap_(target);
  for (var type in listenerMap) {
    ol.events.removeListeners_(target, type);
  }
};
goog.provide("ol.events.EventType");
ol.events.EventType = {CHANGE:"change", CLICK:"click", DBLCLICK:"dblclick", DRAGENTER:"dragenter", DRAGOVER:"dragover", DROP:"drop", ERROR:"error", KEYDOWN:"keydown", KEYPRESS:"keypress", LOAD:"load", MOUSEDOWN:"mousedown", MOUSEMOVE:"mousemove", MOUSEOUT:"mouseout", MOUSEUP:"mouseup", MOUSEWHEEL:"mousewheel", MSPOINTERDOWN:"mspointerdown", RESIZE:"resize", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", WHEEL:"wheel"};
goog.provide("ol.Disposable");
goog.require("ol");
ol.Disposable = function() {
};
ol.Disposable.prototype.disposed_ = false;
ol.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
  }
};
ol.Disposable.prototype.disposeInternal = ol.nullFunction;
goog.provide("ol.events.Event");
ol.events.Event = function(type) {
  this.propagationStopped;
  this.type = type;
  this.target = null;
};
ol.events.Event.prototype.preventDefault = ol.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped = true;
};
ol.events.Event.stopPropagation = function(evt) {
  evt.stopPropagation();
};
ol.events.Event.preventDefault = function(evt) {
  evt.preventDefault();
};
goog.provide("ol.events.EventTarget");
goog.require("ol");
goog.require("ol.Disposable");
goog.require("ol.events");
goog.require("ol.events.Event");
ol.events.EventTarget = function() {
  ol.Disposable.call(this);
  this.pendingRemovals_ = {};
  this.dispatching_ = {};
  this.listeners_ = {};
};
ol.inherits(ol.events.EventTarget, ol.Disposable);
ol.events.EventTarget.prototype.addEventListener = function(type, listener) {
  var listeners = this.listeners_[type];
  if (!listeners) {
    listeners = this.listeners_[type] = [];
  }
  if (listeners.indexOf(listener) === -1) {
    listeners.push(listener);
  }
};
ol.events.EventTarget.prototype.dispatchEvent = function(event) {
  var evt = typeof event === "string" ? new ol.events.Event(event) : event;
  var type = evt.type;
  evt.target = this;
  var listeners = this.listeners_[type];
  var propagate;
  if (listeners) {
    if (!(type in this.dispatching_)) {
      this.dispatching_[type] = 0;
      this.pendingRemovals_[type] = 0;
    }
    ++this.dispatching_[type];
    for (var i = 0, ii = listeners.length;i < ii;++i) {
      if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
        propagate = false;
        break;
      }
    }
    --this.dispatching_[type];
    if (this.dispatching_[type] === 0) {
      var pendingRemovals = this.pendingRemovals_[type];
      delete this.pendingRemovals_[type];
      while (pendingRemovals--) {
        this.removeEventListener(type, ol.nullFunction);
      }
      delete this.dispatching_[type];
    }
    return propagate;
  }
};
ol.events.EventTarget.prototype.disposeInternal = function() {
  ol.events.unlistenAll(this);
};
ol.events.EventTarget.prototype.getListeners = function(type) {
  return this.listeners_[type];
};
ol.events.EventTarget.prototype.hasListener = function(opt_type) {
  return opt_type ? opt_type in this.listeners_ : Object.keys(this.listeners_).length > 0;
};
ol.events.EventTarget.prototype.removeEventListener = function(type, listener) {
  var listeners = this.listeners_[type];
  if (listeners) {
    var index = listeners.indexOf(listener);
    ol.DEBUG && console.assert(index != -1, "listener not found");
    if (type in this.pendingRemovals_) {
      listeners[index] = ol.nullFunction;
      ++this.pendingRemovals_[type];
    } else {
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        delete this.listeners_[type];
      }
    }
  }
};
goog.provide("ol.Observable");
goog.require("ol");
goog.require("ol.events");
goog.require("ol.events.EventTarget");
goog.require("ol.events.EventType");
ol.Observable = function() {
  ol.events.EventTarget.call(this);
  this.revision_ = 0;
};
ol.inherits(ol.Observable, ol.events.EventTarget);
ol.Observable.unByKey = function(key) {
  if (Array.isArray(key)) {
    for (var i = 0, ii = key.length;i < ii;++i) {
      ol.events.unlistenByKey(key[i]);
    }
  } else {
    ol.events.unlistenByKey((key));
  }
};
ol.Observable.prototype.changed = function() {
  ++this.revision_;
  this.dispatchEvent(ol.events.EventType.CHANGE);
};
ol.Observable.prototype.dispatchEvent;
ol.Observable.prototype.getRevision = function() {
  return this.revision_;
};
ol.Observable.prototype.on = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    var len = type.length;
    var keys = new Array(len);
    for (var i = 0;i < len;++i) {
      keys[i] = ol.events.listen(this, type[i], listener, opt_this);
    }
    return keys;
  } else {
    return ol.events.listen(this, (type), listener, opt_this);
  }
};
ol.Observable.prototype.once = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    var len = type.length;
    var keys = new Array(len);
    for (var i = 0;i < len;++i) {
      keys[i] = ol.events.listenOnce(this, type[i], listener, opt_this);
    }
    return keys;
  } else {
    return ol.events.listenOnce(this, (type), listener, opt_this);
  }
};
ol.Observable.prototype.un = function(type, listener, opt_this) {
  if (Array.isArray(type)) {
    for (var i = 0, ii = type.length;i < ii;++i) {
      ol.events.unlisten(this, type[i], listener, opt_this);
    }
    return;
  } else {
    ol.events.unlisten(this, (type), listener, opt_this);
  }
};
ol.Observable.prototype.unByKey = ol.Observable.unByKey;
goog.provide("ol.Object");
goog.provide("ol.ObjectEvent");
goog.provide("ol.ObjectEventType");
goog.require("ol");
goog.require("ol.Observable");
goog.require("ol.events.Event");
goog.require("ol.obj");
ol.ObjectEventType = {PROPERTYCHANGE:"propertychange"};
ol.ObjectEvent = function(type, key, oldValue) {
  ol.events.Event.call(this, type);
  this.key = key;
  this.oldValue = oldValue;
};
ol.inherits(ol.ObjectEvent, ol.events.Event);
ol.Object = function(opt_values) {
  ol.Observable.call(this);
  ol.getUid(this);
  this.values_ = {};
  if (opt_values !== undefined) {
    this.setProperties(opt_values);
  }
};
ol.inherits(ol.Object, ol.Observable);
ol.Object.changeEventTypeCache_ = {};
ol.Object.getChangeEventType = function(key) {
  return ol.Object.changeEventTypeCache_.hasOwnProperty(key) ? ol.Object.changeEventTypeCache_[key] : ol.Object.changeEventTypeCache_[key] = "change:" + key;
};
ol.Object.prototype.get = function(key) {
  var value;
  if (this.values_.hasOwnProperty(key)) {
    value = this.values_[key];
  }
  return value;
};
ol.Object.prototype.getKeys = function() {
  return Object.keys(this.values_);
};
ol.Object.prototype.getProperties = function() {
  return ol.obj.assign({}, this.values_);
};
ol.Object.prototype.notify = function(key, oldValue) {
  var eventType;
  eventType = ol.Object.getChangeEventType(key);
  this.dispatchEvent(new ol.ObjectEvent(eventType, key, oldValue));
  eventType = ol.ObjectEventType.PROPERTYCHANGE;
  this.dispatchEvent(new ol.ObjectEvent(eventType, key, oldValue));
};
ol.Object.prototype.set = function(key, value, opt_silent) {
  if (opt_silent) {
    this.values_[key] = value;
  } else {
    var oldValue = this.values_[key];
    this.values_[key] = value;
    if (oldValue !== value) {
      this.notify(key, oldValue);
    }
  }
};
ol.Object.prototype.setProperties = function(values, opt_silent) {
  var key;
  for (key in values) {
    this.set(key, values[key], opt_silent);
  }
};
ol.Object.prototype.unset = function(key, opt_silent) {
  if (key in this.values_) {
    var oldValue = this.values_[key];
    delete this.values_[key];
    if (!opt_silent) {
      this.notify(key, oldValue);
    }
  }
};
goog.provide("ol.functions");
ol.functions.TRUE = function() {
  return true;
};
ol.functions.FALSE = function() {
  return false;
};
goog.provide("ol.extent");
goog.provide("ol.extent.Corner");
goog.provide("ol.extent.Relationship");
goog.require("ol");
goog.require("ol.asserts");
ol.extent.Corner = {BOTTOM_LEFT:"bottom-left", BOTTOM_RIGHT:"bottom-right", TOP_LEFT:"top-left", TOP_RIGHT:"top-right"};
ol.extent.Relationship = {UNKNOWN:0, INTERSECTING:1, ABOVE:2, RIGHT:4, BELOW:8, LEFT:16};
ol.extent.boundingExtent = function(coordinates) {
  var extent = ol.extent.createEmpty();
  for (var i = 0, ii = coordinates.length;i < ii;++i) {
    ol.extent.extendCoordinate(extent, coordinates[i]);
  }
  return extent;
};
ol.extent.boundingExtentXYs_ = function(xs, ys, opt_extent) {
  ol.DEBUG && console.assert(xs.length > 0, "xs length should be larger than 0");
  ol.DEBUG && console.assert(ys.length > 0, "ys length should be larger than 0");
  var minX = Math.min.apply(null, xs);
  var minY = Math.min.apply(null, ys);
  var maxX = Math.max.apply(null, xs);
  var maxY = Math.max.apply(null, ys);
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};
ol.extent.buffer = function(extent, value, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0] - value;
    opt_extent[1] = extent[1] - value;
    opt_extent[2] = extent[2] + value;
    opt_extent[3] = extent[3] + value;
    return opt_extent;
  } else {
    return [extent[0] - value, extent[1] - value, extent[2] + value, extent[3] + value];
  }
};
ol.extent.clone = function(extent, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0];
    opt_extent[1] = extent[1];
    opt_extent[2] = extent[2];
    opt_extent[3] = extent[3];
    return opt_extent;
  } else {
    return extent.slice();
  }
};
ol.extent.closestSquaredDistanceXY = function(extent, x, y) {
  var dx, dy;
  if (x < extent[0]) {
    dx = extent[0] - x;
  } else {
    if (extent[2] < x) {
      dx = x - extent[2];
    } else {
      dx = 0;
    }
  }
  if (y < extent[1]) {
    dy = extent[1] - y;
  } else {
    if (extent[3] < y) {
      dy = y - extent[3];
    } else {
      dy = 0;
    }
  }
  return dx * dx + dy * dy;
};
ol.extent.containsCoordinate = function(extent, coordinate) {
  return ol.extent.containsXY(extent, coordinate[0], coordinate[1]);
};
ol.extent.containsExtent = function(extent1, extent2) {
  return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] && extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
};
ol.extent.containsXY = function(extent, x, y) {
  return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
};
ol.extent.coordinateRelationship = function(extent, coordinate) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var x = coordinate[0];
  var y = coordinate[1];
  var relationship = ol.extent.Relationship.UNKNOWN;
  if (x < minX) {
    relationship = relationship | ol.extent.Relationship.LEFT;
  } else {
    if (x > maxX) {
      relationship = relationship | ol.extent.Relationship.RIGHT;
    }
  }
  if (y < minY) {
    relationship = relationship | ol.extent.Relationship.BELOW;
  } else {
    if (y > maxY) {
      relationship = relationship | ol.extent.Relationship.ABOVE;
    }
  }
  if (relationship === ol.extent.Relationship.UNKNOWN) {
    relationship = ol.extent.Relationship.INTERSECTING;
  }
  return relationship;
};
ol.extent.createEmpty = function() {
  return [Infinity, Infinity, -Infinity, -Infinity];
};
ol.extent.createOrUpdate = function(minX, minY, maxX, maxY, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = minX;
    opt_extent[1] = minY;
    opt_extent[2] = maxX;
    opt_extent[3] = maxY;
    return opt_extent;
  } else {
    return [minX, minY, maxX, maxY];
  }
};
ol.extent.createOrUpdateEmpty = function(opt_extent) {
  return ol.extent.createOrUpdate(Infinity, Infinity, -Infinity, -Infinity, opt_extent);
};
ol.extent.createOrUpdateFromCoordinate = function(coordinate, opt_extent) {
  var x = coordinate[0];
  var y = coordinate[1];
  return ol.extent.createOrUpdate(x, y, x, y, opt_extent);
};
ol.extent.createOrUpdateFromCoordinates = function(coordinates, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendCoordinates(extent, coordinates);
};
ol.extent.createOrUpdateFromFlatCoordinates = function(flatCoordinates, offset, end, stride, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendFlatCoordinates(extent, flatCoordinates, offset, end, stride);
};
ol.extent.createOrUpdateFromRings = function(rings, opt_extent) {
  var extent = ol.extent.createOrUpdateEmpty(opt_extent);
  return ol.extent.extendRings(extent, rings);
};
ol.extent.equals = function(extent1, extent2) {
  return extent1[0] == extent2[0] && extent1[2] == extent2[2] && extent1[1] == extent2[1] && extent1[3] == extent2[3];
};
ol.extent.extend = function(extent1, extent2) {
  if (extent2[0] < extent1[0]) {
    extent1[0] = extent2[0];
  }
  if (extent2[2] > extent1[2]) {
    extent1[2] = extent2[2];
  }
  if (extent2[1] < extent1[1]) {
    extent1[1] = extent2[1];
  }
  if (extent2[3] > extent1[3]) {
    extent1[3] = extent2[3];
  }
  return extent1;
};
ol.extent.extendCoordinate = function(extent, coordinate) {
  if (coordinate[0] < extent[0]) {
    extent[0] = coordinate[0];
  }
  if (coordinate[0] > extent[2]) {
    extent[2] = coordinate[0];
  }
  if (coordinate[1] < extent[1]) {
    extent[1] = coordinate[1];
  }
  if (coordinate[1] > extent[3]) {
    extent[3] = coordinate[1];
  }
};
ol.extent.extendCoordinates = function(extent, coordinates) {
  var i, ii;
  for (i = 0, ii = coordinates.length;i < ii;++i) {
    ol.extent.extendCoordinate(extent, coordinates[i]);
  }
  return extent;
};
ol.extent.extendFlatCoordinates = function(extent, flatCoordinates, offset, end, stride) {
  for (;offset < end;offset += stride) {
    ol.extent.extendXY(extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
  }
  return extent;
};
ol.extent.extendRings = function(extent, rings) {
  var i, ii;
  for (i = 0, ii = rings.length;i < ii;++i) {
    ol.extent.extendCoordinates(extent, rings[i]);
  }
  return extent;
};
ol.extent.extendXY = function(extent, x, y) {
  extent[0] = Math.min(extent[0], x);
  extent[1] = Math.min(extent[1], y);
  extent[2] = Math.max(extent[2], x);
  extent[3] = Math.max(extent[3], y);
};
ol.extent.forEachCorner = function(extent, callback, opt_this) {
  var val;
  val = callback.call(opt_this, ol.extent.getBottomLeft(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getBottomRight(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getTopRight(extent));
  if (val) {
    return val;
  }
  val = callback.call(opt_this, ol.extent.getTopLeft(extent));
  if (val) {
    return val;
  }
  return false;
};
ol.extent.getArea = function(extent) {
  var area = 0;
  if (!ol.extent.isEmpty(extent)) {
    area = ol.extent.getWidth(extent) * ol.extent.getHeight(extent);
  }
  return area;
};
ol.extent.getBottomLeft = function(extent) {
  return [extent[0], extent[1]];
};
ol.extent.getBottomRight = function(extent) {
  return [extent[2], extent[1]];
};
ol.extent.getCenter = function(extent) {
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
};
ol.extent.getCorner = function(extent, corner) {
  var coordinate;
  if (corner === ol.extent.Corner.BOTTOM_LEFT) {
    coordinate = ol.extent.getBottomLeft(extent);
  } else {
    if (corner === ol.extent.Corner.BOTTOM_RIGHT) {
      coordinate = ol.extent.getBottomRight(extent);
    } else {
      if (corner === ol.extent.Corner.TOP_LEFT) {
        coordinate = ol.extent.getTopLeft(extent);
      } else {
        if (corner === ol.extent.Corner.TOP_RIGHT) {
          coordinate = ol.extent.getTopRight(extent);
        } else {
          ol.asserts.assert(false, 13);
        }
      }
    }
  }
  return (coordinate);
};
ol.extent.getEnlargedArea = function(extent1, extent2) {
  var minX = Math.min(extent1[0], extent2[0]);
  var minY = Math.min(extent1[1], extent2[1]);
  var maxX = Math.max(extent1[2], extent2[2]);
  var maxY = Math.max(extent1[3], extent2[3]);
  return (maxX - minX) * (maxY - minY);
};
ol.extent.getForViewAndSize = function(center, resolution, rotation, size, opt_extent) {
  var dx = resolution * size[0] / 2;
  var dy = resolution * size[1] / 2;
  var cosRotation = Math.cos(rotation);
  var sinRotation = Math.sin(rotation);
  var xCos = dx * cosRotation;
  var xSin = dx * sinRotation;
  var yCos = dy * cosRotation;
  var ySin = dy * sinRotation;
  var x = center[0];
  var y = center[1];
  var x0 = x - xCos + ySin;
  var x1 = x - xCos - ySin;
  var x2 = x + xCos - ySin;
  var x3 = x + xCos + ySin;
  var y0 = y - xSin - yCos;
  var y1 = y - xSin + yCos;
  var y2 = y + xSin + yCos;
  var y3 = y + xSin - yCos;
  return ol.extent.createOrUpdate(Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3), Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3), opt_extent);
};
ol.extent.getHeight = function(extent) {
  return extent[3] - extent[1];
};
ol.extent.getIntersectionArea = function(extent1, extent2) {
  var intersection = ol.extent.getIntersection(extent1, extent2);
  return ol.extent.getArea(intersection);
};
ol.extent.getIntersection = function(extent1, extent2, opt_extent) {
  var intersection = opt_extent ? opt_extent : ol.extent.createEmpty();
  if (ol.extent.intersects(extent1, extent2)) {
    if (extent1[0] > extent2[0]) {
      intersection[0] = extent1[0];
    } else {
      intersection[0] = extent2[0];
    }
    if (extent1[1] > extent2[1]) {
      intersection[1] = extent1[1];
    } else {
      intersection[1] = extent2[1];
    }
    if (extent1[2] < extent2[2]) {
      intersection[2] = extent1[2];
    } else {
      intersection[2] = extent2[2];
    }
    if (extent1[3] < extent2[3]) {
      intersection[3] = extent1[3];
    } else {
      intersection[3] = extent2[3];
    }
  }
  return intersection;
};
ol.extent.getMargin = function(extent) {
  return ol.extent.getWidth(extent) + ol.extent.getHeight(extent);
};
ol.extent.getSize = function(extent) {
  return [extent[2] - extent[0], extent[3] - extent[1]];
};
ol.extent.getTopLeft = function(extent) {
  return [extent[0], extent[3]];
};
ol.extent.getTopRight = function(extent) {
  return [extent[2], extent[3]];
};
ol.extent.getWidth = function(extent) {
  return extent[2] - extent[0];
};
ol.extent.intersects = function(extent1, extent2) {
  return extent1[0] <= extent2[2] && extent1[2] >= extent2[0] && extent1[1] <= extent2[3] && extent1[3] >= extent2[1];
};
ol.extent.isEmpty = function(extent) {
  return extent[2] < extent[0] || extent[3] < extent[1];
};
ol.extent.returnOrUpdate = function(extent, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = extent[0];
    opt_extent[1] = extent[1];
    opt_extent[2] = extent[2];
    opt_extent[3] = extent[3];
    return opt_extent;
  } else {
    return extent;
  }
};
ol.extent.scaleFromCenter = function(extent, value) {
  var deltaX = (extent[2] - extent[0]) / 2 * (value - 1);
  var deltaY = (extent[3] - extent[1]) / 2 * (value - 1);
  extent[0] -= deltaX;
  extent[2] += deltaX;
  extent[1] -= deltaY;
  extent[3] += deltaY;
};
ol.extent.intersectsSegment = function(extent, start, end) {
  var intersects = false;
  var startRel = ol.extent.coordinateRelationship(extent, start);
  var endRel = ol.extent.coordinateRelationship(extent, end);
  if (startRel === ol.extent.Relationship.INTERSECTING || endRel === ol.extent.Relationship.INTERSECTING) {
    intersects = true;
  } else {
    var minX = extent[0];
    var minY = extent[1];
    var maxX = extent[2];
    var maxY = extent[3];
    var startX = start[0];
    var startY = start[1];
    var endX = end[0];
    var endY = end[1];
    var slope = (endY - startY) / (endX - startX);
    var x, y;
    if (!!(endRel & ol.extent.Relationship.ABOVE) && !(startRel & ol.extent.Relationship.ABOVE)) {
      x = endX - (endY - maxY) / slope;
      intersects = x >= minX && x <= maxX;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.RIGHT) && !(startRel & ol.extent.Relationship.RIGHT)) {
      y = endY - (endX - maxX) * slope;
      intersects = y >= minY && y <= maxY;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.BELOW) && !(startRel & ol.extent.Relationship.BELOW)) {
      x = endX - (endY - minY) / slope;
      intersects = x >= minX && x <= maxX;
    }
    if (!intersects && !!(endRel & ol.extent.Relationship.LEFT) && !(startRel & ol.extent.Relationship.LEFT)) {
      y = endY - (endX - minX) * slope;
      intersects = y >= minY && y <= maxY;
    }
  }
  return intersects;
};
ol.extent.applyTransform = function(extent, transformFn, opt_extent) {
  var coordinates = [extent[0], extent[1], extent[0], extent[3], extent[2], extent[1], extent[2], extent[3]];
  transformFn(coordinates, coordinates, 2);
  var xs = [coordinates[0], coordinates[2], coordinates[4], coordinates[6]];
  var ys = [coordinates[1], coordinates[3], coordinates[5], coordinates[7]];
  return ol.extent.boundingExtentXYs_(xs, ys, opt_extent);
};
goog.provide("ol.math");
goog.require("ol");
goog.require("ol.asserts");
ol.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
ol.math.cosh = function() {
  var cosh;
  if ("cosh" in Math) {
    cosh = Math.cosh;
  } else {
    cosh = function(x) {
      var y = Math.exp(x);
      return (y + 1 / y) / 2;
    };
  }
  return cosh;
}();
ol.math.roundUpToPowerOfTwo = function(x) {
  ol.asserts.assert(0 < x, 29);
  return Math.pow(2, Math.ceil(Math.log(x) / Math.LN2));
};
ol.math.squaredSegmentDistance = function(x, y, x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  if (dx !== 0 || dy !== 0) {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else {
      if (t > 0) {
        x1 += dx * t;
        y1 += dy * t;
      }
    }
  }
  return ol.math.squaredDistance(x, y, x1, y1);
};
ol.math.squaredDistance = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return dx * dx + dy * dy;
};
ol.math.solveLinearSystem = function(mat) {
  var n = mat.length;
  if (ol.DEBUG) {
    for (var row = 0;row < n;row++) {
      console.assert(mat[row].length == n + 1, "every row should have correct number of columns");
    }
  }
  for (var i = 0;i < n;i++) {
    var maxRow = i;
    var maxEl = Math.abs(mat[i][i]);
    for (var r = i + 1;r < n;r++) {
      var absValue = Math.abs(mat[r][i]);
      if (absValue > maxEl) {
        maxEl = absValue;
        maxRow = r;
      }
    }
    if (maxEl === 0) {
      return null;
    }
    var tmp = mat[maxRow];
    mat[maxRow] = mat[i];
    mat[i] = tmp;
    for (var j = i + 1;j < n;j++) {
      var coef = -mat[j][i] / mat[i][i];
      for (var k = i;k < n + 1;k++) {
        if (i == k) {
          mat[j][k] = 0;
        } else {
          mat[j][k] += coef * mat[i][k];
        }
      }
    }
  }
  var x = new Array(n);
  for (var l = n - 1;l >= 0;l--) {
    x[l] = mat[l][n] / mat[l][l];
    for (var m = l - 1;m >= 0;m--) {
      mat[m][n] -= mat[m][l] * x[l];
    }
  }
  return x;
};
ol.math.toDegrees = function(angleInRadians) {
  return angleInRadians * 180 / Math.PI;
};
ol.math.toRadians = function(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
};
ol.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r;
};
ol.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
/*

 Latitude/longitude spherical geodesy formulae taken from
 http://www.movable-type.co.uk/scripts/latlong.html
 Licensed under CC-BY-3.0.
*/
goog.provide("ol.Sphere");
goog.require("ol.math");
ol.Sphere = function(radius) {
  this.radius = radius;
};
ol.Sphere.prototype.geodesicArea = function(coordinates) {
  var area = 0, len = coordinates.length;
  var x1 = coordinates[len - 1][0];
  var y1 = coordinates[len - 1][1];
  for (var i = 0;i < len;i++) {
    var x2 = coordinates[i][0], y2 = coordinates[i][1];
    area += ol.math.toRadians(x2 - x1) * (2 + Math.sin(ol.math.toRadians(y1)) + Math.sin(ol.math.toRadians(y2)));
    x1 = x2;
    y1 = y2;
  }
  return area * this.radius * this.radius / 2;
};
ol.Sphere.prototype.haversineDistance = function(c1, c2) {
  var lat1 = ol.math.toRadians(c1[1]);
  var lat2 = ol.math.toRadians(c2[1]);
  var deltaLatBy2 = (lat2 - lat1) / 2;
  var deltaLonBy2 = ol.math.toRadians(c2[0] - c1[0]) / 2;
  var a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) + Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * this.radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
ol.Sphere.prototype.offset = function(c1, distance, bearing) {
  var lat1 = ol.math.toRadians(c1[1]);
  var lon1 = ol.math.toRadians(c1[0]);
  var dByR = distance / this.radius;
  var lat = Math.asin(Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
  var lon = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1), Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
  return [ol.math.toDegrees(lon), ol.math.toDegrees(lat)];
};
goog.provide("ol.sphere.NORMAL");
goog.require("ol.Sphere");
ol.sphere.NORMAL = new ol.Sphere(6370997);
goog.provide("ol.proj");
goog.provide("ol.proj.METERS_PER_UNIT");
goog.provide("ol.proj.Projection");
goog.provide("ol.proj.Units");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.obj");
goog.require("ol.sphere.NORMAL");
ol.proj.Units = {DEGREES:"degrees", FEET:"ft", METERS:"m", PIXELS:"pixels", TILE_PIXELS:"tile-pixels", USFEET:"us-ft"};
ol.proj.METERS_PER_UNIT = {};
ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] = 2 * Math.PI * ol.sphere.NORMAL.radius / 360;
ol.proj.METERS_PER_UNIT[ol.proj.Units.FEET] = .3048;
ol.proj.METERS_PER_UNIT[ol.proj.Units.METERS] = 1;
ol.proj.METERS_PER_UNIT[ol.proj.Units.USFEET] = 1200 / 3937;
ol.proj.Projection = function(options) {
  this.code_ = options.code;
  this.units_ = (options.units);
  this.extent_ = options.extent !== undefined ? options.extent : null;
  this.worldExtent_ = options.worldExtent !== undefined ? options.worldExtent : null;
  this.axisOrientation_ = options.axisOrientation !== undefined ? options.axisOrientation : "enu";
  this.global_ = options.global !== undefined ? options.global : false;
  this.canWrapX_ = !!(this.global_ && this.extent_);
  this.getPointResolutionFunc_ = options.getPointResolution !== undefined ? options.getPointResolution : this.getPointResolution_;
  this.defaultTileGrid_ = null;
  this.metersPerUnit_ = options.metersPerUnit;
  var projections = ol.proj.projections_;
  var code = options.code;
  ol.DEBUG && console.assert(code !== undefined, 'Option "code" is required for constructing instance');
  if (ol.ENABLE_PROJ4JS) {
    var proj4js = ol.proj.proj4_ || window["proj4"];
    if (typeof proj4js == "function" && projections[code] === undefined) {
      var def = proj4js.defs(code);
      if (def !== undefined) {
        if (def.axis !== undefined && options.axisOrientation === undefined) {
          this.axisOrientation_ = def.axis;
        }
        if (options.metersPerUnit === undefined) {
          this.metersPerUnit_ = def.to_meter;
        }
        if (options.units === undefined) {
          this.units_ = def.units;
        }
        var currentCode, currentDef, currentProj, proj4Transform;
        for (currentCode in projections) {
          currentDef = proj4js.defs(currentCode);
          if (currentDef !== undefined) {
            currentProj = ol.proj.get(currentCode);
            if (currentDef === def) {
              ol.proj.addEquivalentProjections([currentProj, this]);
            } else {
              proj4Transform = proj4js(currentCode, code);
              ol.proj.addCoordinateTransforms(currentProj, this, proj4Transform.forward, proj4Transform.inverse);
            }
          }
        }
      }
    }
  }
};
ol.proj.Projection.prototype.canWrapX = function() {
  return this.canWrapX_;
};
ol.proj.Projection.prototype.getCode = function() {
  return this.code_;
};
ol.proj.Projection.prototype.getExtent = function() {
  return this.extent_;
};
ol.proj.Projection.prototype.getUnits = function() {
  return this.units_;
};
ol.proj.Projection.prototype.getMetersPerUnit = function() {
  return this.metersPerUnit_ || ol.proj.METERS_PER_UNIT[this.units_];
};
ol.proj.Projection.prototype.getWorldExtent = function() {
  return this.worldExtent_;
};
ol.proj.Projection.prototype.getAxisOrientation = function() {
  return this.axisOrientation_;
};
ol.proj.Projection.prototype.isGlobal = function() {
  return this.global_;
};
ol.proj.Projection.prototype.setGlobal = function(global) {
  this.global_ = global;
  this.canWrapX_ = !!(global && this.extent_);
};
ol.proj.Projection.prototype.getDefaultTileGrid = function() {
  return this.defaultTileGrid_;
};
ol.proj.Projection.prototype.setDefaultTileGrid = function(tileGrid) {
  this.defaultTileGrid_ = tileGrid;
};
ol.proj.Projection.prototype.setExtent = function(extent) {
  this.extent_ = extent;
  this.canWrapX_ = !!(this.global_ && extent);
};
ol.proj.Projection.prototype.setWorldExtent = function(worldExtent) {
  this.worldExtent_ = worldExtent;
};
ol.proj.Projection.prototype.setGetPointResolution = function(func) {
  this.getPointResolutionFunc_ = func;
};
ol.proj.Projection.prototype.getPointResolution_ = function(resolution, point) {
  var units = this.getUnits();
  if (units == ol.proj.Units.DEGREES) {
    return resolution;
  } else {
    var toEPSG4326 = ol.proj.getTransformFromProjections(this, ol.proj.get("EPSG:4326"));
    var vertices = [point[0] - resolution / 2, point[1], point[0] + resolution / 2, point[1], point[0], point[1] - resolution / 2, point[0], point[1] + resolution / 2];
    vertices = toEPSG4326(vertices, vertices, 2);
    var width = ol.sphere.NORMAL.haversineDistance(vertices.slice(0, 2), vertices.slice(2, 4));
    var height = ol.sphere.NORMAL.haversineDistance(vertices.slice(4, 6), vertices.slice(6, 8));
    var pointResolution = (width + height) / 2;
    var metersPerUnit = this.getMetersPerUnit();
    if (metersPerUnit !== undefined) {
      pointResolution /= metersPerUnit;
    }
    return pointResolution;
  }
};
ol.proj.Projection.prototype.getPointResolution = function(resolution, point) {
  return this.getPointResolutionFunc_(resolution, point);
};
ol.proj.projections_ = {};
ol.proj.transforms_ = {};
ol.proj.proj4_ = null;
if (ol.ENABLE_PROJ4JS) {
  ol.proj.setProj4 = function(proj4) {
    ol.DEBUG && console.assert(typeof proj4 == "function", "proj4 argument should be a function");
    ol.proj.proj4_ = proj4;
  };
}
ol.proj.addEquivalentProjections = function(projections) {
  ol.proj.addProjections(projections);
  projections.forEach(function(source) {
    projections.forEach(function(destination) {
      if (source !== destination) {
        ol.proj.addTransform(source, destination, ol.proj.cloneTransform);
      }
    });
  });
};
ol.proj.addEquivalentTransforms = function(projections1, projections2, forwardTransform, inverseTransform) {
  projections1.forEach(function(projection1) {
    projections2.forEach(function(projection2) {
      ol.proj.addTransform(projection1, projection2, forwardTransform);
      ol.proj.addTransform(projection2, projection1, inverseTransform);
    });
  });
};
ol.proj.addProjection = function(projection) {
  ol.proj.projections_[projection.getCode()] = projection;
  ol.proj.addTransform(projection, projection, ol.proj.cloneTransform);
};
ol.proj.addProjections = function(projections) {
  var addedProjections = [];
  projections.forEach(function(projection) {
    addedProjections.push(ol.proj.addProjection(projection));
  });
};
ol.proj.clearAllProjections = function() {
  ol.proj.projections_ = {};
  ol.proj.transforms_ = {};
};
ol.proj.createProjection = function(projection, defaultCode) {
  if (!projection) {
    return ol.proj.get(defaultCode);
  } else {
    if (typeof projection === "string") {
      return ol.proj.get(projection);
    } else {
      return (projection);
    }
  }
};
ol.proj.addTransform = function(source, destination, transformFn) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transforms = ol.proj.transforms_;
  if (!(sourceCode in transforms)) {
    transforms[sourceCode] = {};
  }
  transforms[sourceCode][destinationCode] = transformFn;
};
ol.proj.addCoordinateTransforms = function(source, destination, forward, inverse) {
  var sourceProj = ol.proj.get(source);
  var destProj = ol.proj.get(destination);
  ol.proj.addTransform(sourceProj, destProj, ol.proj.createTransformFromCoordinateTransform(forward));
  ol.proj.addTransform(destProj, sourceProj, ol.proj.createTransformFromCoordinateTransform(inverse));
};
ol.proj.createTransformFromCoordinateTransform = function(transform) {
  return function(input, opt_output, opt_dimension) {
    var length = input.length;
    var dimension = opt_dimension !== undefined ? opt_dimension : 2;
    var output = opt_output !== undefined ? opt_output : new Array(length);
    var point, i, j;
    for (i = 0;i < length;i += dimension) {
      point = transform([input[i], input[i + 1]]);
      output[i] = point[0];
      output[i + 1] = point[1];
      for (j = dimension - 1;j >= 2;--j) {
        output[i + j] = input[i + j];
      }
    }
    return output;
  };
};
ol.proj.removeTransform = function(source, destination) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transforms = ol.proj.transforms_;
  ol.DEBUG && console.assert(sourceCode in transforms, "sourceCode should be in transforms");
  ol.DEBUG && console.assert(destinationCode in transforms[sourceCode], "destinationCode should be in transforms of sourceCode");
  var transform = transforms[sourceCode][destinationCode];
  delete transforms[sourceCode][destinationCode];
  if (ol.obj.isEmpty(transforms[sourceCode])) {
    delete transforms[sourceCode];
  }
  return transform;
};
ol.proj.fromLonLat = function(coordinate, opt_projection) {
  return ol.proj.transform(coordinate, "EPSG:4326", opt_projection !== undefined ? opt_projection : "EPSG:3857");
};
ol.proj.toLonLat = function(coordinate, opt_projection) {
  return ol.proj.transform(coordinate, opt_projection !== undefined ? opt_projection : "EPSG:3857", "EPSG:4326");
};
ol.proj.get = function(projectionLike) {
  var projection;
  if (projectionLike instanceof ol.proj.Projection) {
    projection = projectionLike;
  } else {
    if (typeof projectionLike === "string") {
      var code = projectionLike;
      projection = ol.proj.projections_[code];
      if (ol.ENABLE_PROJ4JS) {
        var proj4js = ol.proj.proj4_ || window["proj4"];
        if (projection === undefined && typeof proj4js == "function" && proj4js.defs(code) !== undefined) {
          projection = new ol.proj.Projection({code:code});
          ol.proj.addProjection(projection);
        }
      }
    }
  }
  return projection || null;
};
ol.proj.equivalent = function(projection1, projection2) {
  if (projection1 === projection2) {
    return true;
  }
  var equalUnits = projection1.getUnits() === projection2.getUnits();
  if (projection1.getCode() === projection2.getCode()) {
    return equalUnits;
  } else {
    var transformFn = ol.proj.getTransformFromProjections(projection1, projection2);
    return transformFn === ol.proj.cloneTransform && equalUnits;
  }
};
ol.proj.getTransform = function(source, destination) {
  var sourceProjection = ol.proj.get(source);
  var destinationProjection = ol.proj.get(destination);
  return ol.proj.getTransformFromProjections(sourceProjection, destinationProjection);
};
ol.proj.getTransformFromProjections = function(sourceProjection, destinationProjection) {
  var transforms = ol.proj.transforms_;
  var sourceCode = sourceProjection.getCode();
  var destinationCode = destinationProjection.getCode();
  var transform;
  if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
    transform = transforms[sourceCode][destinationCode];
  }
  if (transform === undefined) {
    ol.DEBUG && console.assert(transform !== undefined, "transform should be defined");
    transform = ol.proj.identityTransform;
  }
  return transform;
};
ol.proj.identityTransform = function(input, opt_output, opt_dimension) {
  if (opt_output !== undefined && input !== opt_output) {
    ol.DEBUG && console.assert(false, "This should not be used internally.");
    for (var i = 0, ii = input.length;i < ii;++i) {
      opt_output[i] = input[i];
    }
    input = opt_output;
  }
  return input;
};
ol.proj.cloneTransform = function(input, opt_output, opt_dimension) {
  var output;
  if (opt_output !== undefined) {
    for (var i = 0, ii = input.length;i < ii;++i) {
      opt_output[i] = input[i];
    }
    output = opt_output;
  } else {
    output = input.slice();
  }
  return output;
};
ol.proj.transform = function(coordinate, source, destination) {
  var transformFn = ol.proj.getTransform(source, destination);
  return transformFn(coordinate, undefined, coordinate.length);
};
ol.proj.transformExtent = function(extent, source, destination) {
  var transformFn = ol.proj.getTransform(source, destination);
  return ol.extent.applyTransform(extent, transformFn);
};
ol.proj.transformWithProjections = function(point, sourceProjection, destinationProjection) {
  var transformFn = ol.proj.getTransformFromProjections(sourceProjection, destinationProjection);
  return transformFn(point);
};
goog.provide("ol.geom.Geometry");
goog.provide("ol.geom.GeometryLayout");
goog.provide("ol.geom.GeometryType");
goog.require("ol");
goog.require("ol.functions");
goog.require("ol.Object");
goog.require("ol.extent");
goog.require("ol.proj");
goog.require("ol.proj.Units");
ol.geom.GeometryType = {POINT:"Point", LINE_STRING:"LineString", LINEAR_RING:"LinearRing", POLYGON:"Polygon", MULTI_POINT:"MultiPoint", MULTI_LINE_STRING:"MultiLineString", MULTI_POLYGON:"MultiPolygon", GEOMETRY_COLLECTION:"GeometryCollection", CIRCLE:"Circle"};
ol.geom.GeometryLayout = {XY:"XY", XYZ:"XYZ", XYM:"XYM", XYZM:"XYZM"};
ol.geom.Geometry = function() {
  ol.Object.call(this);
  this.extent_ = ol.extent.createEmpty();
  this.extentRevision_ = -1;
  this.simplifiedGeometryCache = {};
  this.simplifiedGeometryMaxMinSquaredTolerance = 0;
  this.simplifiedGeometryRevision = 0;
};
ol.inherits(ol.geom.Geometry, ol.Object);
ol.geom.Geometry.prototype.clone = function() {
};
ol.geom.Geometry.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
};
ol.geom.Geometry.prototype.getClosestPoint = function(point, opt_closestPoint) {
  var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
  this.closestPointXY(point[0], point[1], closestPoint, Infinity);
  return closestPoint;
};
ol.geom.Geometry.prototype.intersectsCoordinate = function(coordinate) {
  return this.containsXY(coordinate[0], coordinate[1]);
};
ol.geom.Geometry.prototype.computeExtent = function(extent) {
};
ol.geom.Geometry.prototype.containsXY = ol.functions.FALSE;
ol.geom.Geometry.prototype.getExtent = function(opt_extent) {
  if (this.extentRevision_ != this.getRevision()) {
    this.extent_ = this.computeExtent(this.extent_);
    this.extentRevision_ = this.getRevision();
  }
  return ol.extent.returnOrUpdate(this.extent_, opt_extent);
};
ol.geom.Geometry.prototype.rotate = function(angle, anchor) {
};
ol.geom.Geometry.prototype.scale = function(sx, opt_sy, opt_anchor) {
};
ol.geom.Geometry.prototype.simplify = function(tolerance) {
  return this.getSimplifiedGeometry(tolerance * tolerance);
};
ol.geom.Geometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {
};
ol.geom.Geometry.prototype.getType = function() {
};
ol.geom.Geometry.prototype.applyTransform = function(transformFn) {
};
ol.geom.Geometry.prototype.intersectsExtent = function(extent) {
};
ol.geom.Geometry.prototype.translate = function(deltaX, deltaY) {
};
ol.geom.Geometry.prototype.transform = function(source, destination) {
  ol.DEBUG && console.assert(ol.proj.get(source).getUnits() !== ol.proj.Units.TILE_PIXELS && ol.proj.get(destination).getUnits() !== ol.proj.Units.TILE_PIXELS, "cannot transform geometries with TILE_PIXELS units");
  this.applyTransform(ol.proj.getTransform(source, destination));
  return this;
};
goog.provide("ol.color");
goog.require("ol.asserts");
goog.require("ol.math");
ol.color.HEX_COLOR_RE_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
ol.color.RGB_COLOR_RE_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
ol.color.RGBA_COLOR_RE_ = /^(?:rgba)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|1|0\.\d{0,10})\)$/i;
ol.color.NAMED_COLOR_RE_ = /^([a-z]*)$/i;
ol.color.asArray = function(color) {
  if (Array.isArray(color)) {
    return color;
  } else {
    return ol.color.fromString((color));
  }
};
ol.color.asString = function(color) {
  if (typeof color === "string") {
    return color;
  } else {
    return ol.color.toString(color);
  }
};
ol.color.fromNamed = function(color) {
  var el = document.createElement("div");
  el.style.color = color;
  document.body.appendChild(el);
  var rgb = getComputedStyle(el).color;
  document.body.removeChild(el);
  return rgb;
};
ol.color.fromString = function() {
  var MAX_CACHE_SIZE = 1024;
  var cache = {};
  var cacheSize = 0;
  return function(s) {
    var color;
    if (cache.hasOwnProperty(s)) {
      color = cache[s];
    } else {
      if (cacheSize >= MAX_CACHE_SIZE) {
        var i = 0;
        var key;
        for (key in cache) {
          if ((i++ & 3) === 0) {
            delete cache[key];
            --cacheSize;
          }
        }
      }
      color = ol.color.fromStringInternal_(s);
      cache[s] = color;
      ++cacheSize;
    }
    return color;
  };
}();
ol.color.fromStringInternal_ = function(s) {
  var r, g, b, a, color, match;
  if (ol.color.NAMED_COLOR_RE_.exec(s)) {
    s = ol.color.fromNamed(s);
  }
  if (ol.color.HEX_COLOR_RE_.exec(s)) {
    var n = s.length - 1;
    ol.asserts.assert(n == 3 || n == 6, 54);
    var d = n == 3 ? 1 : 2;
    r = parseInt(s.substr(1 + 0 * d, d), 16);
    g = parseInt(s.substr(1 + 1 * d, d), 16);
    b = parseInt(s.substr(1 + 2 * d, d), 16);
    if (d == 1) {
      r = (r << 4) + r;
      g = (g << 4) + g;
      b = (b << 4) + b;
    }
    a = 1;
    color = [r, g, b, a];
  } else {
    if (match = ol.color.RGBA_COLOR_RE_.exec(s)) {
      r = Number(match[1]);
      g = Number(match[2]);
      b = Number(match[3]);
      a = Number(match[4]);
      color = ol.color.normalize([r, g, b, a]);
    } else {
      if (match = ol.color.RGB_COLOR_RE_.exec(s)) {
        r = Number(match[1]);
        g = Number(match[2]);
        b = Number(match[3]);
        color = ol.color.normalize([r, g, b, 1]);
      } else {
        ol.asserts.assert(false, 14);
      }
    }
  }
  return (color);
};
ol.color.normalize = function(color, opt_color) {
  var result = opt_color || [];
  result[0] = ol.math.clamp(color[0] + .5 | 0, 0, 255);
  result[1] = ol.math.clamp(color[1] + .5 | 0, 0, 255);
  result[2] = ol.math.clamp(color[2] + .5 | 0, 0, 255);
  result[3] = ol.math.clamp(color[3], 0, 1);
  return result;
};
ol.color.toString = function(color) {
  var r = color[0];
  if (r != (r | 0)) {
    r = r + .5 | 0;
  }
  var g = color[1];
  if (g != (g | 0)) {
    g = g + .5 | 0;
  }
  var b = color[2];
  if (b != (b | 0)) {
    b = b + .5 | 0;
  }
  var a = color[3] === undefined ? 1 : color[3];
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};
goog.provide("ol.colorlike");
goog.require("ol.color");
ol.colorlike.asColorLike = function(color) {
  if (ol.colorlike.isColorLike(color)) {
    return (color);
  } else {
    return ol.color.asString((color));
  }
};
ol.colorlike.isColorLike = function(color) {
  return typeof color === "string" || color instanceof CanvasPattern || color instanceof CanvasGradient;
};
goog.provide("ol.dom");
ol.dom.createCanvasContext2D = function(opt_width, opt_height) {
  var canvas = document.createElement("CANVAS");
  if (opt_width) {
    canvas.width = opt_width;
  }
  if (opt_height) {
    canvas.height = opt_height;
  }
  return canvas.getContext("2d");
};
ol.dom.outerWidth = function(element) {
  var width = element.offsetWidth;
  var style = element.currentStyle || getComputedStyle(element);
  width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
  return width;
};
ol.dom.outerHeight = function(element) {
  var height = element.offsetHeight;
  var style = element.currentStyle || getComputedStyle(element);
  height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
  return height;
};
ol.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if (parent) {
    parent.replaceChild(newNode, oldNode);
  }
};
ol.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};
ol.dom.removeChildren = function(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
};
goog.provide("ol.webgl");
ol.webgl.ONE = 1;
ol.webgl.SRC_ALPHA = 770;
ol.webgl.COLOR_ATTACHMENT0 = 36064;
ol.webgl.COLOR_BUFFER_BIT = 16384;
ol.webgl.TRIANGLES = 4;
ol.webgl.TRIANGLE_STRIP = 5;
ol.webgl.ONE_MINUS_SRC_ALPHA = 771;
ol.webgl.ARRAY_BUFFER = 34962;
ol.webgl.ELEMENT_ARRAY_BUFFER = 34963;
ol.webgl.STREAM_DRAW = 35040;
ol.webgl.STATIC_DRAW = 35044;
ol.webgl.DYNAMIC_DRAW = 35048;
ol.webgl.CULL_FACE = 2884;
ol.webgl.BLEND = 3042;
ol.webgl.STENCIL_TEST = 2960;
ol.webgl.DEPTH_TEST = 2929;
ol.webgl.SCISSOR_TEST = 3089;
ol.webgl.UNSIGNED_BYTE = 5121;
ol.webgl.UNSIGNED_SHORT = 5123;
ol.webgl.UNSIGNED_INT = 5125;
ol.webgl.FLOAT = 5126;
ol.webgl.RGBA = 6408;
ol.webgl.FRAGMENT_SHADER = 35632;
ol.webgl.VERTEX_SHADER = 35633;
ol.webgl.LINK_STATUS = 35714;
ol.webgl.LINEAR = 9729;
ol.webgl.TEXTURE_MAG_FILTER = 10240;
ol.webgl.TEXTURE_MIN_FILTER = 10241;
ol.webgl.TEXTURE_WRAP_S = 10242;
ol.webgl.TEXTURE_WRAP_T = 10243;
ol.webgl.TEXTURE_2D = 3553;
ol.webgl.TEXTURE0 = 33984;
ol.webgl.CLAMP_TO_EDGE = 33071;
ol.webgl.COMPILE_STATUS = 35713;
ol.webgl.FRAMEBUFFER = 36160;
ol.webgl.CONTEXT_IDS_ = ["experimental-webgl", "webgl", "webkit-3d", "moz-webgl"];
ol.webgl.getContext = function(canvas, opt_attributes) {
  var context, i, ii = ol.webgl.CONTEXT_IDS_.length;
  for (i = 0;i < ii;++i) {
    try {
      context = canvas.getContext(ol.webgl.CONTEXT_IDS_[i], opt_attributes);
      if (context) {
        return (context);
      }
    } catch (e) {
    }
  }
  return null;
};
goog.provide("ol.has");
goog.require("ol");
goog.require("ol.webgl");
var ua = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
ol.has.FIREFOX = ua.indexOf("firefox") !== -1;
ol.has.SAFARI = ua.indexOf("safari") !== -1 && ua.indexOf("chrom") == -1;
ol.has.WEBKIT = ua.indexOf("webkit") !== -1 && ua.indexOf("edge") == -1;
ol.has.MAC = ua.indexOf("macintosh") !== -1;
ol.has.DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
ol.has.CANVAS_LINE_DASH = false;
ol.has.CANVAS = ol.ENABLE_CANVAS && function() {
  if (!("HTMLCanvasElement" in window)) {
    return false;
  }
  try {
    var context = document.createElement("CANVAS").getContext("2d");
    if (!context) {
      return false;
    } else {
      if (context.setLineDash !== undefined) {
        ol.has.CANVAS_LINE_DASH = true;
      }
      return true;
    }
  } catch (e) {
    return false;
  }
}();
ol.has.DEVICE_ORIENTATION = "DeviceOrientationEvent" in window;
ol.has.GEOLOCATION = "geolocation" in navigator;
ol.has.TOUCH = ol.ASSUME_TOUCH || "ontouchstart" in window;
ol.has.POINTER = "PointerEvent" in window;
ol.has.MSPOINTER = !!navigator.msPointerEnabled;
ol.has.WEBGL;
(function() {
  if (ol.ENABLE_WEBGL) {
    var hasWebGL = false;
    var textureSize;
    var extensions = [];
    if ("WebGLRenderingContext" in window) {
      try {
        var canvas = (document.createElement("CANVAS"));
        var gl = ol.webgl.getContext(canvas, {failIfMajorPerformanceCaveat:true});
        if (gl) {
          hasWebGL = true;
          textureSize = (gl.getParameter(gl.MAX_TEXTURE_SIZE));
          extensions = gl.getSupportedExtensions();
        }
      } catch (e) {
      }
    }
    ol.has.WEBGL = hasWebGL;
    ol.WEBGL_EXTENSIONS = extensions;
    ol.WEBGL_MAX_TEXTURE_SIZE = textureSize;
  }
})();
goog.provide("ol.ImageBase");
goog.require("ol");
goog.require("ol.events.EventTarget");
goog.require("ol.events.EventType");
ol.ImageBase = function(extent, resolution, pixelRatio, state, attributions) {
  ol.events.EventTarget.call(this);
  this.attributions_ = attributions;
  this.extent = extent;
  this.pixelRatio_ = pixelRatio;
  this.resolution = resolution;
  this.state = state;
};
ol.inherits(ol.ImageBase, ol.events.EventTarget);
ol.ImageBase.prototype.changed = function() {
  this.dispatchEvent(ol.events.EventType.CHANGE);
};
ol.ImageBase.prototype.getAttributions = function() {
  return this.attributions_;
};
ol.ImageBase.prototype.getExtent = function() {
  return this.extent;
};
ol.ImageBase.prototype.getImage = function(opt_context) {
};
ol.ImageBase.prototype.getPixelRatio = function() {
  return this.pixelRatio_;
};
ol.ImageBase.prototype.getResolution = function() {
  ol.DEBUG && console.assert(this.resolution !== undefined, "resolution not yet set");
  return (this.resolution);
};
ol.ImageBase.prototype.getState = function() {
  return this.state;
};
ol.ImageBase.prototype.load = function() {
};
goog.provide("ol.Image");
goog.require("ol");
goog.require("ol.ImageBase");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.obj");
ol.Image = function(extent, resolution, pixelRatio, attributions, src, crossOrigin, imageLoadFunction) {
  ol.ImageBase.call(this, extent, resolution, pixelRatio, ol.Image.State.IDLE, attributions);
  this.src_ = src;
  this.image_ = new Image;
  if (crossOrigin !== null) {
    this.image_.crossOrigin = crossOrigin;
  }
  this.imageByContext_ = {};
  this.imageListenerKeys_ = null;
  this.state = ol.Image.State.IDLE;
  this.imageLoadFunction_ = imageLoadFunction;
};
ol.inherits(ol.Image, ol.ImageBase);
ol.Image.prototype.getImage = function(opt_context) {
  if (opt_context !== undefined) {
    var image;
    var key = ol.getUid(opt_context);
    if (key in this.imageByContext_) {
      return this.imageByContext_[key];
    } else {
      if (ol.obj.isEmpty(this.imageByContext_)) {
        image = this.image_;
      } else {
        image = (this.image_.cloneNode(false));
      }
    }
    this.imageByContext_[key] = image;
    return image;
  } else {
    return this.image_;
  }
};
ol.Image.prototype.handleImageError_ = function() {
  this.state = ol.Image.State.ERROR;
  this.unlistenImage_();
  this.changed();
};
ol.Image.prototype.handleImageLoad_ = function() {
  if (this.resolution === undefined) {
    this.resolution = ol.extent.getHeight(this.extent) / this.image_.height;
  }
  this.state = ol.Image.State.LOADED;
  this.unlistenImage_();
  this.changed();
};
ol.Image.prototype.load = function() {
  if (this.state == ol.Image.State.IDLE || this.state == ol.Image.State.ERROR) {
    this.state = ol.Image.State.LOADING;
    this.changed();
    ol.DEBUG && console.assert(!this.imageListenerKeys_, "this.imageListenerKeys_ should be null");
    this.imageListenerKeys_ = [ol.events.listenOnce(this.image_, ol.events.EventType.ERROR, this.handleImageError_, this), ol.events.listenOnce(this.image_, ol.events.EventType.LOAD, this.handleImageLoad_, this)];
    this.imageLoadFunction_(this, this.src_);
  }
};
ol.Image.prototype.setImage = function(image) {
  this.image_ = image;
};
ol.Image.prototype.unlistenImage_ = function() {
  this.imageListenerKeys_.forEach(ol.events.unlistenByKey);
  this.imageListenerKeys_ = null;
};
ol.Image.State = {IDLE:0, LOADING:1, LOADED:2, ERROR:3};
goog.provide("ol.render.canvas");
ol.render.canvas.defaultFont = "10px sans-serif";
ol.render.canvas.defaultFillStyle = [0, 0, 0, 1];
ol.render.canvas.defaultLineCap = "round";
ol.render.canvas.defaultLineDash = [];
ol.render.canvas.defaultLineJoin = "round";
ol.render.canvas.defaultMiterLimit = 10;
ol.render.canvas.defaultStrokeStyle = [0, 0, 0, 1];
ol.render.canvas.defaultTextAlign = "center";
ol.render.canvas.defaultTextBaseline = "middle";
ol.render.canvas.defaultLineWidth = 1;
ol.render.canvas.rotateAtOffset = function(context, rotation, offsetX, offsetY) {
  if (rotation !== 0) {
    context.translate(offsetX, offsetY);
    context.rotate(rotation);
    context.translate(-offsetX, -offsetY);
  }
};
goog.provide("ol.style.Image");
ol.style.Image = function(options) {
  this.opacity_ = options.opacity;
  this.rotateWithView_ = options.rotateWithView;
  this.rotation_ = options.rotation;
  this.scale_ = options.scale;
  this.snapToPixel_ = options.snapToPixel;
};
ol.style.Image.prototype.getOpacity = function() {
  return this.opacity_;
};
ol.style.Image.prototype.getRotateWithView = function() {
  return this.rotateWithView_;
};
ol.style.Image.prototype.getRotation = function() {
  return this.rotation_;
};
ol.style.Image.prototype.getScale = function() {
  return this.scale_;
};
ol.style.Image.prototype.getSnapToPixel = function() {
  return this.snapToPixel_;
};
ol.style.Image.prototype.getAnchor = function() {
};
ol.style.Image.prototype.getImage = function(pixelRatio) {
};
ol.style.Image.prototype.getHitDetectionImage = function(pixelRatio) {
};
ol.style.Image.prototype.getImageState = function() {
};
ol.style.Image.prototype.getImageSize = function() {
};
ol.style.Image.prototype.getHitDetectionImageSize = function() {
};
ol.style.Image.prototype.getOrigin = function() {
};
ol.style.Image.prototype.getSize = function() {
};
ol.style.Image.prototype.setOpacity = function(opacity) {
  this.opacity_ = opacity;
};
ol.style.Image.prototype.setRotateWithView = function(rotateWithView) {
  this.rotateWithView_ = rotateWithView;
};
ol.style.Image.prototype.setRotation = function(rotation) {
  this.rotation_ = rotation;
};
ol.style.Image.prototype.setScale = function(scale) {
  this.scale_ = scale;
};
ol.style.Image.prototype.setSnapToPixel = function(snapToPixel) {
  this.snapToPixel_ = snapToPixel;
};
ol.style.Image.prototype.listenImageChange = function(listener, thisArg) {
};
ol.style.Image.prototype.load = function() {
};
ol.style.Image.prototype.unlistenImageChange = function(listener, thisArg) {
};
goog.provide("ol.style.Circle");
goog.require("ol");
goog.require("ol.color");
goog.require("ol.colorlike");
goog.require("ol.dom");
goog.require("ol.has");
goog.require("ol.Image");
goog.require("ol.render.canvas");
goog.require("ol.style.Image");
ol.style.Circle = function(opt_options) {
  var options = opt_options || {};
  this.atlasManager_ = options.atlasManager;
  this.checksums_ = null;
  this.canvas_ = null;
  this.hitDetectionCanvas_ = null;
  this.fill_ = options.fill !== undefined ? options.fill : null;
  this.stroke_ = options.stroke !== undefined ? options.stroke : null;
  this.radius_ = options.radius;
  this.origin_ = [0, 0];
  this.anchor_ = null;
  this.size_ = null;
  this.imageSize_ = null;
  this.hitDetectionImageSize_ = null;
  this.render_(this.atlasManager_);
  var snapToPixel = options.snapToPixel !== undefined ? options.snapToPixel : true;
  ol.style.Image.call(this, {opacity:1, rotateWithView:false, rotation:0, scale:1, snapToPixel:snapToPixel});
};
ol.inherits(ol.style.Circle, ol.style.Image);
ol.style.Circle.prototype.clone = function() {
  var style = new ol.style.Circle({fill:this.getFill() ? this.getFill().clone() : undefined, stroke:this.getStroke() ? this.getStroke().clone() : undefined, radius:this.getRadius(), snapToPixel:this.getSnapToPixel(), atlasManager:this.atlasManager_});
  style.setOpacity(this.getOpacity());
  style.setScale(this.getScale());
  return style;
};
ol.style.Circle.prototype.getAnchor = function() {
  return this.anchor_;
};
ol.style.Circle.prototype.getFill = function() {
  return this.fill_;
};
ol.style.Circle.prototype.getHitDetectionImage = function(pixelRatio) {
  return this.hitDetectionCanvas_;
};
ol.style.Circle.prototype.getImage = function(pixelRatio) {
  return this.canvas_;
};
ol.style.Circle.prototype.getImageState = function() {
  return ol.Image.State.LOADED;
};
ol.style.Circle.prototype.getImageSize = function() {
  return this.imageSize_;
};
ol.style.Circle.prototype.getHitDetectionImageSize = function() {
  return this.hitDetectionImageSize_;
};
ol.style.Circle.prototype.getOrigin = function() {
  return this.origin_;
};
ol.style.Circle.prototype.getRadius = function() {
  return this.radius_;
};
ol.style.Circle.prototype.getSize = function() {
  return this.size_;
};
ol.style.Circle.prototype.getStroke = function() {
  return this.stroke_;
};
ol.style.Circle.prototype.setRadius = function(radius) {
  this.radius_ = radius;
  this.render_(this.atlasManager_);
};
ol.style.Circle.prototype.listenImageChange = ol.nullFunction;
ol.style.Circle.prototype.load = ol.nullFunction;
ol.style.Circle.prototype.unlistenImageChange = ol.nullFunction;
ol.style.Circle.prototype.render_ = function(atlasManager) {
  var imageSize;
  var lineDash = null;
  var strokeStyle;
  var strokeWidth = 0;
  if (this.stroke_) {
    strokeStyle = ol.colorlike.asColorLike(this.stroke_.getColor());
    strokeWidth = this.stroke_.getWidth();
    if (strokeWidth === undefined) {
      strokeWidth = ol.render.canvas.defaultLineWidth;
    }
    lineDash = this.stroke_.getLineDash();
    if (!ol.has.CANVAS_LINE_DASH) {
      lineDash = null;
    }
  }
  var size = 2 * (this.radius_ + strokeWidth) + 1;
  var renderOptions = {strokeStyle:strokeStyle, strokeWidth:strokeWidth, size:size, lineDash:lineDash};
  if (atlasManager === undefined) {
    var context = ol.dom.createCanvasContext2D(size, size);
    this.canvas_ = context.canvas;
    size = this.canvas_.width;
    imageSize = size;
    this.draw_(renderOptions, context, 0, 0);
    this.createHitDetectionCanvas_(renderOptions);
  } else {
    size = Math.round(size);
    var hasCustomHitDetectionImage = !this.fill_;
    var renderHitDetectionCallback;
    if (hasCustomHitDetectionImage) {
      renderHitDetectionCallback = this.drawHitDetectionCanvas_.bind(this, renderOptions);
    }
    var id = this.getChecksum();
    var info = atlasManager.add(id, size, size, this.draw_.bind(this, renderOptions), renderHitDetectionCallback);
    ol.DEBUG && console.assert(info, "circle radius is too large");
    this.canvas_ = info.image;
    this.origin_ = [info.offsetX, info.offsetY];
    imageSize = info.image.width;
    if (hasCustomHitDetectionImage) {
      this.hitDetectionCanvas_ = info.hitImage;
      this.hitDetectionImageSize_ = [info.hitImage.width, info.hitImage.height];
    } else {
      this.hitDetectionCanvas_ = this.canvas_;
      this.hitDetectionImageSize_ = [imageSize, imageSize];
    }
  }
  this.anchor_ = [size / 2, size / 2];
  this.size_ = [size, size];
  this.imageSize_ = [imageSize, imageSize];
};
ol.style.Circle.prototype.draw_ = function(renderOptions, context, x, y) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.translate(x, y);
  context.beginPath();
  context.arc(renderOptions.size / 2, renderOptions.size / 2, this.radius_, 0, 2 * Math.PI, true);
  if (this.fill_) {
    context.fillStyle = ol.colorlike.asColorLike(this.fill_.getColor());
    context.fill();
  }
  if (this.stroke_) {
    context.strokeStyle = renderOptions.strokeStyle;
    context.lineWidth = renderOptions.strokeWidth;
    if (renderOptions.lineDash) {
      context.setLineDash(renderOptions.lineDash);
    }
    context.stroke();
  }
  context.closePath();
};
ol.style.Circle.prototype.createHitDetectionCanvas_ = function(renderOptions) {
  this.hitDetectionImageSize_ = [renderOptions.size, renderOptions.size];
  if (this.fill_) {
    this.hitDetectionCanvas_ = this.canvas_;
    return;
  }
  var context = ol.dom.createCanvasContext2D(renderOptions.size, renderOptions.size);
  this.hitDetectionCanvas_ = context.canvas;
  this.drawHitDetectionCanvas_(renderOptions, context, 0, 0);
};
ol.style.Circle.prototype.drawHitDetectionCanvas_ = function(renderOptions, context, x, y) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.translate(x, y);
  context.beginPath();
  context.arc(renderOptions.size / 2, renderOptions.size / 2, this.radius_, 0, 2 * Math.PI, true);
  context.fillStyle = ol.color.asString(ol.render.canvas.defaultFillStyle);
  context.fill();
  if (this.stroke_) {
    context.strokeStyle = renderOptions.strokeStyle;
    context.lineWidth = renderOptions.strokeWidth;
    if (renderOptions.lineDash) {
      context.setLineDash(renderOptions.lineDash);
    }
    context.stroke();
  }
  context.closePath();
};
ol.style.Circle.prototype.getChecksum = function() {
  var strokeChecksum = this.stroke_ ? this.stroke_.getChecksum() : "-";
  var fillChecksum = this.fill_ ? this.fill_.getChecksum() : "-";
  var recalculate = !this.checksums_ || (strokeChecksum != this.checksums_[1] || fillChecksum != this.checksums_[2] || this.radius_ != this.checksums_[3]);
  if (recalculate) {
    var checksum = "c" + strokeChecksum + fillChecksum + (this.radius_ !== undefined ? this.radius_.toString() : "-");
    this.checksums_ = [checksum, strokeChecksum, fillChecksum, this.radius_];
  }
  return this.checksums_[0];
};
goog.provide("ol.style.Fill");
goog.require("ol");
goog.require("ol.color");
ol.style.Fill = function(opt_options) {
  var options = opt_options || {};
  this.color_ = options.color !== undefined ? options.color : null;
  this.checksum_ = undefined;
};
ol.style.Fill.prototype.clone = function() {
  var color = this.getColor();
  return new ol.style.Fill({color:color && color.slice ? color.slice() : color || undefined});
};
ol.style.Fill.prototype.getColor = function() {
  return this.color_;
};
ol.style.Fill.prototype.setColor = function(color) {
  this.color_ = color;
  this.checksum_ = undefined;
};
ol.style.Fill.prototype.getChecksum = function() {
  if (this.checksum_ === undefined) {
    if (this.color_ instanceof CanvasPattern || this.color_ instanceof CanvasGradient) {
      this.checksum_ = ol.getUid(this.color_).toString();
    } else {
      this.checksum_ = "f" + (this.color_ ? ol.color.asString(this.color_) : "-");
    }
  }
  return this.checksum_;
};
goog.provide("ol.style.Stroke");
goog.require("ol");
ol.style.Stroke = function(opt_options) {
  var options = opt_options || {};
  this.color_ = options.color !== undefined ? options.color : null;
  this.lineCap_ = options.lineCap;
  this.lineDash_ = options.lineDash !== undefined ? options.lineDash : null;
  this.lineJoin_ = options.lineJoin;
  this.miterLimit_ = options.miterLimit;
  this.width_ = options.width;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.clone = function() {
  var color = this.getColor();
  return new ol.style.Stroke({color:color && color.slice ? color.slice() : color || undefined, lineCap:this.getLineCap(), lineDash:this.getLineDash() ? this.getLineDash().slice() : undefined, lineJoin:this.getLineJoin(), miterLimit:this.getMiterLimit(), width:this.getWidth()});
};
ol.style.Stroke.prototype.getColor = function() {
  return this.color_;
};
ol.style.Stroke.prototype.getLineCap = function() {
  return this.lineCap_;
};
ol.style.Stroke.prototype.getLineDash = function() {
  return this.lineDash_;
};
ol.style.Stroke.prototype.getLineJoin = function() {
  return this.lineJoin_;
};
ol.style.Stroke.prototype.getMiterLimit = function() {
  return this.miterLimit_;
};
ol.style.Stroke.prototype.getWidth = function() {
  return this.width_;
};
ol.style.Stroke.prototype.setColor = function(color) {
  this.color_ = color;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.setLineCap = function(lineCap) {
  this.lineCap_ = lineCap;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.setLineDash = function(lineDash) {
  this.lineDash_ = lineDash;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.setLineJoin = function(lineJoin) {
  this.lineJoin_ = lineJoin;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.setMiterLimit = function(miterLimit) {
  this.miterLimit_ = miterLimit;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.setWidth = function(width) {
  this.width_ = width;
  this.checksum_ = undefined;
};
ol.style.Stroke.prototype.getChecksum = function() {
  if (this.checksum_ === undefined) {
    this.checksum_ = "s";
    if (this.color_) {
      if (typeof this.color_ === "string") {
        this.checksum_ += this.color_;
      } else {
        this.checksum_ += ol.getUid(this.color_).toString();
      }
    } else {
      this.checksum_ += "-";
    }
    this.checksum_ += "," + (this.lineCap_ !== undefined ? this.lineCap_.toString() : "-") + "," + (this.lineDash_ ? this.lineDash_.toString() : "-") + "," + (this.lineJoin_ !== undefined ? this.lineJoin_ : "-") + "," + (this.miterLimit_ !== undefined ? this.miterLimit_.toString() : "-") + "," + (this.width_ !== undefined ? this.width_.toString() : "-");
  }
  return this.checksum_;
};
goog.provide("ol.style.Style");
goog.require("ol.asserts");
goog.require("ol.geom.GeometryType");
goog.require("ol.style.Circle");
goog.require("ol.style.Fill");
goog.require("ol.style.Stroke");
ol.style.Style = function(opt_options) {
  var options = opt_options || {};
  this.geometry_ = null;
  this.geometryFunction_ = ol.style.Style.defaultGeometryFunction;
  if (options.geometry !== undefined) {
    this.setGeometry(options.geometry);
  }
  this.fill_ = options.fill !== undefined ? options.fill : null;
  this.image_ = options.image !== undefined ? options.image : null;
  this.stroke_ = options.stroke !== undefined ? options.stroke : null;
  this.text_ = options.text !== undefined ? options.text : null;
  this.zIndex_ = options.zIndex;
};
ol.style.Style.prototype.clone = function() {
  var geometry = this.getGeometry();
  if (geometry && geometry.clone) {
    geometry = geometry.clone();
  }
  return new ol.style.Style({geometry:geometry, fill:this.getFill() ? this.getFill().clone() : undefined, image:this.getImage() ? this.getImage().clone() : undefined, stroke:this.getStroke() ? this.getStroke().clone() : undefined, text:this.getText() ? this.getText().clone() : undefined, zIndex:this.getZIndex()});
};
ol.style.Style.prototype.getGeometry = function() {
  return this.geometry_;
};
ol.style.Style.prototype.getGeometryFunction = function() {
  return this.geometryFunction_;
};
ol.style.Style.prototype.getFill = function() {
  return this.fill_;
};
ol.style.Style.prototype.getImage = function() {
  return this.image_;
};
ol.style.Style.prototype.getStroke = function() {
  return this.stroke_;
};
ol.style.Style.prototype.getText = function() {
  return this.text_;
};
ol.style.Style.prototype.getZIndex = function() {
  return this.zIndex_;
};
ol.style.Style.prototype.setGeometry = function(geometry) {
  if (typeof geometry === "function") {
    this.geometryFunction_ = geometry;
  } else {
    if (typeof geometry === "string") {
      this.geometryFunction_ = function(feature) {
        return (feature.get(geometry));
      };
    } else {
      if (!geometry) {
        this.geometryFunction_ = ol.style.Style.defaultGeometryFunction;
      } else {
        if (geometry !== undefined) {
          this.geometryFunction_ = function() {
            return (geometry);
          };
        }
      }
    }
  }
  this.geometry_ = geometry;
};
ol.style.Style.prototype.setZIndex = function(zIndex) {
  this.zIndex_ = zIndex;
};
ol.style.Style.createFunction = function(obj) {
  var styleFunction;
  if (typeof obj === "function") {
    styleFunction = obj;
  } else {
    var styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      ol.asserts.assert(obj instanceof ol.style.Style, 41);
      styles = [obj];
    }
    styleFunction = function() {
      return styles;
    };
  }
  return styleFunction;
};
ol.style.Style.default_ = null;
ol.style.Style.defaultFunction = function(feature, resolution) {
  if (!ol.style.Style.default_) {
    var fill = new ol.style.Fill({color:"rgba(255,255,255,0.4)"});
    var stroke = new ol.style.Stroke({color:"#3399CC", width:1.25});
    ol.style.Style.default_ = [new ol.style.Style({image:new ol.style.Circle({fill:fill, stroke:stroke, radius:5}), fill:fill, stroke:stroke})];
  }
  return ol.style.Style.default_;
};
ol.style.Style.createDefaultEditing = function() {
  var styles = {};
  var white = [255, 255, 255, 1];
  var blue = [0, 153, 255, 1];
  var width = 3;
  styles[ol.geom.GeometryType.POLYGON] = [new ol.style.Style({fill:new ol.style.Fill({color:[255, 255, 255, .5]})})];
  styles[ol.geom.GeometryType.MULTI_POLYGON] = styles[ol.geom.GeometryType.POLYGON];
  styles[ol.geom.GeometryType.LINE_STRING] = [new ol.style.Style({stroke:new ol.style.Stroke({color:white, width:width + 2})}), new ol.style.Style({stroke:new ol.style.Stroke({color:blue, width:width})})];
  styles[ol.geom.GeometryType.MULTI_LINE_STRING] = styles[ol.geom.GeometryType.LINE_STRING];
  styles[ol.geom.GeometryType.CIRCLE] = styles[ol.geom.GeometryType.POLYGON].concat(styles[ol.geom.GeometryType.LINE_STRING]);
  styles[ol.geom.GeometryType.POINT] = [new ol.style.Style({image:new ol.style.Circle({radius:width * 2, fill:new ol.style.Fill({color:blue}), stroke:new ol.style.Stroke({color:white, width:width / 2})}), zIndex:Infinity})];
  styles[ol.geom.GeometryType.MULTI_POINT] = styles[ol.geom.GeometryType.POINT];
  styles[ol.geom.GeometryType.GEOMETRY_COLLECTION] = styles[ol.geom.GeometryType.POLYGON].concat(styles[ol.geom.GeometryType.LINE_STRING], styles[ol.geom.GeometryType.POINT]);
  return styles;
};
ol.style.Style.defaultGeometryFunction = function(feature) {
  return feature.getGeometry();
};
goog.provide("ol.Feature");
goog.require("ol.asserts");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol");
goog.require("ol.Object");
goog.require("ol.geom.Geometry");
goog.require("ol.style.Style");
ol.Feature = function(opt_geometryOrProperties) {
  ol.Object.call(this);
  this.id_ = undefined;
  this.geometryName_ = "geometry";
  this.style_ = null;
  this.styleFunction_ = undefined;
  this.geometryChangeKey_ = null;
  ol.events.listen(this, ol.Object.getChangeEventType(this.geometryName_), this.handleGeometryChanged_, this);
  if (opt_geometryOrProperties !== undefined) {
    if (opt_geometryOrProperties instanceof ol.geom.Geometry || !opt_geometryOrProperties) {
      var geometry = opt_geometryOrProperties;
      this.setGeometry(geometry);
    } else {
      var properties = opt_geometryOrProperties;
      this.setProperties(properties);
    }
  }
};
ol.inherits(ol.Feature, ol.Object);
ol.Feature.prototype.clone = function() {
  var clone = new ol.Feature(this.getProperties());
  clone.setGeometryName(this.getGeometryName());
  var geometry = this.getGeometry();
  if (geometry) {
    clone.setGeometry(geometry.clone());
  }
  var style = this.getStyle();
  if (style) {
    clone.setStyle(style);
  }
  return clone;
};
ol.Feature.prototype.getGeometry = function() {
  return (this.get(this.geometryName_));
};
ol.Feature.prototype.getId = function() {
  return this.id_;
};
ol.Feature.prototype.getGeometryName = function() {
  return this.geometryName_;
};
ol.Feature.prototype.getStyle = function() {
  return this.style_;
};
ol.Feature.prototype.getStyleFunction = function() {
  return this.styleFunction_;
};
ol.Feature.prototype.handleGeometryChange_ = function() {
  this.changed();
};
ol.Feature.prototype.handleGeometryChanged_ = function() {
  if (this.geometryChangeKey_) {
    ol.events.unlistenByKey(this.geometryChangeKey_);
    this.geometryChangeKey_ = null;
  }
  var geometry = this.getGeometry();
  if (geometry) {
    this.geometryChangeKey_ = ol.events.listen(geometry, ol.events.EventType.CHANGE, this.handleGeometryChange_, this);
  }
  this.changed();
};
ol.Feature.prototype.setGeometry = function(geometry) {
  this.set(this.geometryName_, geometry);
};
ol.Feature.prototype.setStyle = function(style) {
  this.style_ = style;
  this.styleFunction_ = !style ? undefined : ol.Feature.createStyleFunction(style);
  this.changed();
};
ol.Feature.prototype.setId = function(id) {
  this.id_ = id;
  this.changed();
};
ol.Feature.prototype.setGeometryName = function(name) {
  ol.events.unlisten(this, ol.Object.getChangeEventType(this.geometryName_), this.handleGeometryChanged_, this);
  this.geometryName_ = name;
  ol.events.listen(this, ol.Object.getChangeEventType(this.geometryName_), this.handleGeometryChanged_, this);
  this.handleGeometryChanged_();
};
ol.Feature.createStyleFunction = function(obj) {
  var styleFunction;
  if (typeof obj === "function") {
    styleFunction = obj;
  } else {
    var styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      ol.asserts.assert(obj instanceof ol.style.Style, 41);
      styles = [obj];
    }
    styleFunction = function() {
      return styles;
    };
  }
  return styleFunction;
};
goog.provide("ol.format.Feature");
goog.require("ol.geom.Geometry");
goog.require("ol.obj");
goog.require("ol.proj");
ol.format.Feature = function() {
  this.defaultDataProjection = null;
  this.defaultFeatureProjection = null;
};
ol.format.Feature.prototype.getExtensions = function() {
};
ol.format.Feature.prototype.getReadOptions = function(source, opt_options) {
  var options;
  if (opt_options) {
    options = {dataProjection:opt_options.dataProjection ? opt_options.dataProjection : this.readProjection(source), featureProjection:opt_options.featureProjection};
  }
  return this.adaptOptions(options);
};
ol.format.Feature.prototype.adaptOptions = function(options) {
  return ol.obj.assign({dataProjection:this.defaultDataProjection, featureProjection:this.defaultFeatureProjection}, options);
};
ol.format.Feature.prototype.getType = function() {
};
ol.format.Feature.prototype.readFeature = function(source, opt_options) {
};
ol.format.Feature.prototype.readFeatures = function(source, opt_options) {
};
ol.format.Feature.prototype.readGeometry = function(source, opt_options) {
};
ol.format.Feature.prototype.readProjection = function(source) {
};
ol.format.Feature.prototype.writeFeature = function(feature, opt_options) {
};
ol.format.Feature.prototype.writeFeatures = function(features, opt_options) {
};
ol.format.Feature.prototype.writeGeometry = function(geometry, opt_options) {
};
ol.format.Feature.transformWithOptions = function(geometry, write, opt_options) {
  var featureProjection = opt_options ? ol.proj.get(opt_options.featureProjection) : null;
  var dataProjection = opt_options ? ol.proj.get(opt_options.dataProjection) : null;
  var transformed;
  if (featureProjection && dataProjection && !ol.proj.equivalent(featureProjection, dataProjection)) {
    if (geometry instanceof ol.geom.Geometry) {
      transformed = (write ? geometry.clone() : geometry).transform(write ? featureProjection : dataProjection, write ? dataProjection : featureProjection);
    } else {
      transformed = ol.proj.transformExtent(write ? geometry.slice() : geometry, write ? featureProjection : dataProjection, write ? dataProjection : featureProjection);
    }
  } else {
    transformed = geometry;
  }
  if (write && opt_options && opt_options.decimals) {
    var power = Math.pow(10, opt_options.decimals);
    var transform = function(coordinates) {
      for (var i = 0, ii = coordinates.length;i < ii;++i) {
        coordinates[i] = Math.round(coordinates[i] * power) / power;
      }
      return coordinates;
    };
    if (Array.isArray(transformed)) {
      transform(transformed);
    } else {
      transformed.applyTransform(transform);
    }
  }
  return transformed;
};
goog.provide("ol.format.FormatType");
ol.format.FormatType = {ARRAY_BUFFER:"arraybuffer", JSON:"json", TEXT:"text", XML:"xml"};
goog.provide("ol.format.TextFeature");
goog.require("ol");
goog.require("ol.format.Feature");
goog.require("ol.format.FormatType");
ol.format.TextFeature = function() {
  ol.format.Feature.call(this);
};
ol.inherits(ol.format.TextFeature, ol.format.Feature);
ol.format.TextFeature.prototype.getText_ = function(source) {
  if (typeof source === "string") {
    return source;
  } else {
    return "";
  }
};
ol.format.TextFeature.prototype.getType = function() {
  return ol.format.FormatType.TEXT;
};
ol.format.TextFeature.prototype.readFeature = function(source, opt_options) {
  return this.readFeatureFromText(this.getText_(source), this.adaptOptions(opt_options));
};
ol.format.TextFeature.prototype.readFeatureFromText = function(text, opt_options) {
};
ol.format.TextFeature.prototype.readFeatures = function(source, opt_options) {
  return this.readFeaturesFromText(this.getText_(source), this.adaptOptions(opt_options));
};
ol.format.TextFeature.prototype.readFeaturesFromText = function(text, opt_options) {
};
ol.format.TextFeature.prototype.readGeometry = function(source, opt_options) {
  return this.readGeometryFromText(this.getText_(source), this.adaptOptions(opt_options));
};
ol.format.TextFeature.prototype.readGeometryFromText = function(text, opt_options) {
};
ol.format.TextFeature.prototype.readProjection = function(source) {
  return this.readProjectionFromText(this.getText_(source));
};
ol.format.TextFeature.prototype.readProjectionFromText = function(text) {
  return this.defaultDataProjection;
};
ol.format.TextFeature.prototype.writeFeature = function(feature, opt_options) {
  return this.writeFeatureText(feature, this.adaptOptions(opt_options));
};
ol.format.TextFeature.prototype.writeFeatureText = function(feature, opt_options) {
};
ol.format.TextFeature.prototype.writeFeatures = function(features, opt_options) {
  return this.writeFeaturesText(features, this.adaptOptions(opt_options));
};
ol.format.TextFeature.prototype.writeFeaturesText = function(features, opt_options) {
};
ol.format.TextFeature.prototype.writeGeometry = function(geometry, opt_options) {
  return this.writeGeometryText(geometry, this.adaptOptions(opt_options));
};
ol.format.TextFeature.prototype.writeGeometryText = function(geometry, opt_options) {
};
goog.provide("ol.array");
goog.require("ol");
ol.array.binarySearch = function(haystack, needle, opt_comparator) {
  var mid, cmp;
  var comparator = opt_comparator || ol.array.numberSafeCompareFunction;
  var low = 0;
  var high = haystack.length;
  var found = false;
  while (low < high) {
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle);
    if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid;
      found = !cmp;
    }
  }
  return found ? low : ~low;
};
ol.array.numberSafeCompareFunction = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
ol.array.includes = function(arr, obj) {
  return arr.indexOf(obj) >= 0;
};
ol.array.linearFindNearest = function(arr, target, direction) {
  var n = arr.length;
  if (arr[0] <= target) {
    return 0;
  } else {
    if (target <= arr[n - 1]) {
      return n - 1;
    } else {
      var i;
      if (direction > 0) {
        for (i = 1;i < n;++i) {
          if (arr[i] < target) {
            return i - 1;
          }
        }
      } else {
        if (direction < 0) {
          for (i = 1;i < n;++i) {
            if (arr[i] <= target) {
              return i;
            }
          }
        } else {
          for (i = 1;i < n;++i) {
            if (arr[i] == target) {
              return i;
            } else {
              if (arr[i] < target) {
                if (arr[i - 1] - target < target - arr[i]) {
                  return i - 1;
                } else {
                  return i;
                }
              }
            }
          }
        }
      }
      return n - 1;
    }
  }
};
ol.array.reverseSubArray = function(arr, begin, end) {
  ol.DEBUG && console.assert(begin >= 0, "Array begin index should be equal to or greater than 0");
  ol.DEBUG && console.assert(end < arr.length, "Array end index should be less than the array length");
  while (begin < end) {
    var tmp = arr[begin];
    arr[begin] = arr[end];
    arr[end] = tmp;
    ++begin;
    --end;
  }
};
ol.array.flatten = function(arr) {
  var data = arr.reduce(function(flattened, value) {
    if (Array.isArray(value)) {
      return flattened.concat(ol.array.flatten(value));
    } else {
      return flattened.concat(value);
    }
  }, []);
  return data;
};
ol.array.extend = function(arr, data) {
  var i;
  var extension = Array.isArray(data) ? data : [data];
  var length = extension.length;
  for (i = 0;i < length;i++) {
    arr[arr.length] = extension[i];
  }
};
ol.array.remove = function(arr, obj) {
  var i = arr.indexOf(obj);
  var found = i > -1;
  if (found) {
    arr.splice(i, 1);
  }
  return found;
};
ol.array.find = function(arr, func) {
  var length = arr.length >>> 0;
  var value;
  for (var i = 0;i < length;i++) {
    value = arr[i];
    if (func(value, i, arr)) {
      return value;
    }
  }
  return null;
};
ol.array.equals = function(arr1, arr2) {
  var len1 = arr1.length;
  if (len1 !== arr2.length) {
    return false;
  }
  for (var i = 0;i < len1;i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};
ol.array.stableSort = function(arr, compareFnc) {
  var length = arr.length;
  var tmp = Array(arr.length);
  var i;
  for (i = 0;i < length;i++) {
    tmp[i] = {index:i, value:arr[i]};
  }
  tmp.sort(function(a, b) {
    return compareFnc(a.value, b.value) || a.index - b.index;
  });
  for (i = 0;i < arr.length;i++) {
    arr[i] = tmp[i].value;
  }
};
ol.array.findIndex = function(arr, func) {
  var index;
  var found = !arr.every(function(el, idx) {
    index = idx;
    return !func(el, idx, arr);
  });
  return found ? index : -1;
};
ol.array.isSorted = function(arr, opt_func, opt_strict) {
  var compare = opt_func || ol.array.numberSafeCompareFunction;
  return arr.every(function(currentVal, index) {
    if (index === 0) {
      return true;
    }
    var res = compare(arr[index - 1], currentVal);
    return !(res > 0 || opt_strict && res === 0);
  });
};
goog.provide("ol.geom.flat.transform");
ol.geom.flat.transform.transform2D = function(flatCoordinates, offset, end, stride, transform, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var i = 0;
  var j;
  for (j = offset;j < end;j += stride) {
    var x = flatCoordinates[j];
    var y = flatCoordinates[j + 1];
    dest[i++] = transform[0] * x + transform[2] * y + transform[4];
    dest[i++] = transform[1] * x + transform[3] * y + transform[5];
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};
ol.geom.flat.transform.rotate = function(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var anchorX = anchor[0];
  var anchorY = anchor[1];
  var i = 0;
  for (var j = offset;j < end;j += stride) {
    var deltaX = flatCoordinates[j] - anchorX;
    var deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + deltaX * cos - deltaY * sin;
    dest[i++] = anchorY + deltaX * sin + deltaY * cos;
    for (var k = j + 2;k < j + stride;++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};
ol.geom.flat.transform.scale = function(flatCoordinates, offset, end, stride, sx, sy, anchor, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var anchorX = anchor[0];
  var anchorY = anchor[1];
  var i = 0;
  for (var j = offset;j < end;j += stride) {
    var deltaX = flatCoordinates[j] - anchorX;
    var deltaY = flatCoordinates[j + 1] - anchorY;
    dest[i++] = anchorX + sx * deltaX;
    dest[i++] = anchorY + sy * deltaY;
    for (var k = j + 2;k < j + stride;++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};
ol.geom.flat.transform.translate = function(flatCoordinates, offset, end, stride, deltaX, deltaY, opt_dest) {
  var dest = opt_dest ? opt_dest : [];
  var i = 0;
  var j, k;
  for (j = offset;j < end;j += stride) {
    dest[i++] = flatCoordinates[j] + deltaX;
    dest[i++] = flatCoordinates[j + 1] + deltaY;
    for (k = j + 2;k < j + stride;++k) {
      dest[i++] = flatCoordinates[k];
    }
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
};
goog.provide("ol.geom.SimpleGeometry");
goog.require("ol");
goog.require("ol.functions");
goog.require("ol.extent");
goog.require("ol.geom.Geometry");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.flat.transform");
goog.require("ol.obj");
ol.geom.SimpleGeometry = function() {
  ol.geom.Geometry.call(this);
  this.layout = ol.geom.GeometryLayout.XY;
  this.stride = 2;
  this.flatCoordinates = null;
};
ol.inherits(ol.geom.SimpleGeometry, ol.geom.Geometry);
ol.geom.SimpleGeometry.getLayoutForStride_ = function(stride) {
  var layout;
  if (stride == 2) {
    layout = ol.geom.GeometryLayout.XY;
  } else {
    if (stride == 3) {
      layout = ol.geom.GeometryLayout.XYZ;
    } else {
      if (stride == 4) {
        layout = ol.geom.GeometryLayout.XYZM;
      }
    }
  }
  ol.DEBUG && console.assert(layout, "unsupported stride: " + stride);
  return (layout);
};
ol.geom.SimpleGeometry.getStrideForLayout = function(layout) {
  var stride;
  if (layout == ol.geom.GeometryLayout.XY) {
    stride = 2;
  } else {
    if (layout == ol.geom.GeometryLayout.XYZ || layout == ol.geom.GeometryLayout.XYM) {
      stride = 3;
    } else {
      if (layout == ol.geom.GeometryLayout.XYZM) {
        stride = 4;
      }
    }
  }
  ol.DEBUG && console.assert(stride, "unsupported layout: " + layout);
  return (stride);
};
ol.geom.SimpleGeometry.prototype.containsXY = ol.functions.FALSE;
ol.geom.SimpleGeometry.prototype.computeExtent = function(extent) {
  return ol.extent.createOrUpdateFromFlatCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
};
ol.geom.SimpleGeometry.prototype.getCoordinates = function() {
};
ol.geom.SimpleGeometry.prototype.getFirstCoordinate = function() {
  return this.flatCoordinates.slice(0, this.stride);
};
ol.geom.SimpleGeometry.prototype.getFlatCoordinates = function() {
  return this.flatCoordinates;
};
ol.geom.SimpleGeometry.prototype.getLastCoordinate = function() {
  return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
};
ol.geom.SimpleGeometry.prototype.getLayout = function() {
  return this.layout;
};
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometry = function(squaredTolerance) {
  if (this.simplifiedGeometryRevision != this.getRevision()) {
    ol.obj.clear(this.simplifiedGeometryCache);
    this.simplifiedGeometryMaxMinSquaredTolerance = 0;
    this.simplifiedGeometryRevision = this.getRevision();
  }
  if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance) {
    return this;
  }
  var key = squaredTolerance.toString();
  if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
    return this.simplifiedGeometryCache[key];
  } else {
    var simplifiedGeometry = this.getSimplifiedGeometryInternal(squaredTolerance);
    var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
    if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
      this.simplifiedGeometryCache[key] = simplifiedGeometry;
      return simplifiedGeometry;
    } else {
      this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
      return this;
    }
  }
};
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  return this;
};
ol.geom.SimpleGeometry.prototype.getStride = function() {
  return this.stride;
};
ol.geom.SimpleGeometry.prototype.setFlatCoordinatesInternal = function(layout, flatCoordinates) {
  this.stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
  this.layout = layout;
  this.flatCoordinates = flatCoordinates;
};
ol.geom.SimpleGeometry.prototype.setCoordinates = function(coordinates, opt_layout) {
};
ol.geom.SimpleGeometry.prototype.setLayout = function(layout, coordinates, nesting) {
  var stride;
  if (layout) {
    stride = ol.geom.SimpleGeometry.getStrideForLayout(layout);
  } else {
    var i;
    for (i = 0;i < nesting;++i) {
      if (coordinates.length === 0) {
        this.layout = ol.geom.GeometryLayout.XY;
        this.stride = 2;
        return;
      } else {
        coordinates = (coordinates[0]);
      }
    }
    stride = coordinates.length;
    layout = ol.geom.SimpleGeometry.getLayoutForStride_(stride);
  }
  this.layout = layout;
  this.stride = stride;
};
ol.geom.SimpleGeometry.prototype.applyTransform = function(transformFn) {
  if (this.flatCoordinates) {
    transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
    this.changed();
  }
};
ol.geom.SimpleGeometry.prototype.rotate = function(angle, anchor) {
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.rotate(flatCoordinates, 0, flatCoordinates.length, stride, angle, anchor, flatCoordinates);
    this.changed();
  }
};
ol.geom.SimpleGeometry.prototype.scale = function(sx, opt_sy, opt_anchor) {
  var sy = opt_sy;
  if (sy === undefined) {
    sy = sx;
  }
  var anchor = opt_anchor;
  if (!anchor) {
    anchor = ol.extent.getCenter(this.getExtent());
  }
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.scale(flatCoordinates, 0, flatCoordinates.length, stride, sx, sy, anchor, flatCoordinates);
    this.changed();
  }
};
ol.geom.SimpleGeometry.prototype.translate = function(deltaX, deltaY) {
  var flatCoordinates = this.getFlatCoordinates();
  if (flatCoordinates) {
    var stride = this.getStride();
    ol.geom.flat.transform.translate(flatCoordinates, 0, flatCoordinates.length, stride, deltaX, deltaY, flatCoordinates);
    this.changed();
  }
};
ol.geom.SimpleGeometry.transform2D = function(simpleGeometry, transform, opt_dest) {
  var flatCoordinates = simpleGeometry.getFlatCoordinates();
  if (!flatCoordinates) {
    return null;
  } else {
    var stride = simpleGeometry.getStride();
    return ol.geom.flat.transform.transform2D(flatCoordinates, 0, flatCoordinates.length, stride, transform, opt_dest);
  }
};
goog.provide("ol.geom.flat.closest");
goog.require("ol");
goog.require("ol.math");
ol.geom.flat.closest.point = function(flatCoordinates, offset1, offset2, stride, x, y, closestPoint) {
  var x1 = flatCoordinates[offset1];
  var y1 = flatCoordinates[offset1 + 1];
  var dx = flatCoordinates[offset2] - x1;
  var dy = flatCoordinates[offset2 + 1] - y1;
  var i, offset;
  if (dx === 0 && dy === 0) {
    offset = offset1;
  } else {
    var t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      offset = offset2;
    } else {
      if (t > 0) {
        for (i = 0;i < stride;++i) {
          closestPoint[i] = ol.math.lerp(flatCoordinates[offset1 + i], flatCoordinates[offset2 + i], t);
        }
        closestPoint.length = stride;
        return;
      } else {
        offset = offset1;
      }
    }
  }
  for (i = 0;i < stride;++i) {
    closestPoint[i] = flatCoordinates[offset + i];
  }
  closestPoint.length = stride;
};
ol.geom.flat.closest.getMaxSquaredDelta = function(flatCoordinates, offset, end, stride, maxSquaredDelta) {
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  for (offset += stride;offset < end;offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var squaredDelta = ol.math.squaredDistance(x1, y1, x2, y2);
    if (squaredDelta > maxSquaredDelta) {
      maxSquaredDelta = squaredDelta;
    }
    x1 = x2;
    y1 = y2;
  }
  return maxSquaredDelta;
};
ol.geom.flat.closest.getsMaxSquaredDelta = function(flatCoordinates, offset, ends, stride, maxSquaredDelta) {
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    maxSquaredDelta = ol.geom.flat.closest.getMaxSquaredDelta(flatCoordinates, offset, end, stride, maxSquaredDelta);
    offset = end;
  }
  return maxSquaredDelta;
};
ol.geom.flat.closest.getssMaxSquaredDelta = function(flatCoordinates, offset, endss, stride, maxSquaredDelta) {
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    maxSquaredDelta = ol.geom.flat.closest.getsMaxSquaredDelta(flatCoordinates, offset, ends, stride, maxSquaredDelta);
    offset = ends[ends.length - 1];
  }
  return maxSquaredDelta;
};
ol.geom.flat.closest.getClosestPoint = function(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
  if (offset == end) {
    return minSquaredDistance;
  }
  var i, squaredDistance;
  if (maxDelta === 0) {
    squaredDistance = ol.math.squaredDistance(x, y, flatCoordinates[offset], flatCoordinates[offset + 1]);
    if (squaredDistance < minSquaredDistance) {
      for (i = 0;i < stride;++i) {
        closestPoint[i] = flatCoordinates[offset + i];
      }
      closestPoint.length = stride;
      return squaredDistance;
    } else {
      return minSquaredDistance;
    }
  }
  ol.DEBUG && console.assert(maxDelta > 0, "maxDelta should be larger than 0");
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var index = offset + stride;
  while (index < end) {
    ol.geom.flat.closest.point(flatCoordinates, index - stride, index, stride, x, y, tmpPoint);
    squaredDistance = ol.math.squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (i = 0;i < stride;++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
      index += stride;
    } else {
      index += stride * Math.max((Math.sqrt(squaredDistance) - Math.sqrt(minSquaredDistance)) / maxDelta | 0, 1);
    }
  }
  if (isRing) {
    ol.geom.flat.closest.point(flatCoordinates, end - stride, offset, stride, x, y, tmpPoint);
    squaredDistance = ol.math.squaredDistance(x, y, tmpPoint[0], tmpPoint[1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (i = 0;i < stride;++i) {
        closestPoint[i] = tmpPoint[i];
      }
      closestPoint.length = stride;
    }
  }
  return minSquaredDistance;
};
ol.geom.flat.closest.getsClosestPoint = function(flatCoordinates, offset, ends, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    minSquaredDistance = ol.geom.flat.closest.getClosestPoint(flatCoordinates, offset, end, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
    offset = end;
  }
  return minSquaredDistance;
};
ol.geom.flat.closest.getssClosestPoint = function(flatCoordinates, offset, endss, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, opt_tmpPoint) {
  var tmpPoint = opt_tmpPoint ? opt_tmpPoint : [NaN, NaN];
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    minSquaredDistance = ol.geom.flat.closest.getsClosestPoint(flatCoordinates, offset, ends, stride, maxDelta, isRing, x, y, closestPoint, minSquaredDistance, tmpPoint);
    offset = ends[ends.length - 1];
  }
  return minSquaredDistance;
};
goog.provide("ol.geom.flat.deflate");
goog.require("ol");
ol.geom.flat.deflate.coordinate = function(flatCoordinates, offset, coordinate, stride) {
  ol.DEBUG && console.assert(coordinate.length == stride, "length of the coordinate array should match stride");
  var i, ii;
  for (i = 0, ii = coordinate.length;i < ii;++i) {
    flatCoordinates[offset++] = coordinate[i];
  }
  return offset;
};
ol.geom.flat.deflate.coordinates = function(flatCoordinates, offset, coordinates, stride) {
  var i, ii;
  for (i = 0, ii = coordinates.length;i < ii;++i) {
    var coordinate = coordinates[i];
    ol.DEBUG && console.assert(coordinate.length == stride, "length of coordinate array should match stride");
    var j;
    for (j = 0;j < stride;++j) {
      flatCoordinates[offset++] = coordinate[j];
    }
  }
  return offset;
};
ol.geom.flat.deflate.coordinatess = function(flatCoordinates, offset, coordinatess, stride, opt_ends) {
  var ends = opt_ends ? opt_ends : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatess.length;j < jj;++j) {
    var end = ol.geom.flat.deflate.coordinates(flatCoordinates, offset, coordinatess[j], stride);
    ends[i++] = end;
    offset = end;
  }
  ends.length = i;
  return ends;
};
ol.geom.flat.deflate.coordinatesss = function(flatCoordinates, offset, coordinatesss, stride, opt_endss) {
  var endss = opt_endss ? opt_endss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = coordinatesss.length;j < jj;++j) {
    var ends = ol.geom.flat.deflate.coordinatess(flatCoordinates, offset, coordinatesss[j], stride, endss[i]);
    endss[i++] = ends;
    offset = ends[ends.length - 1];
  }
  endss.length = i;
  return endss;
};
goog.provide("ol.geom.flat.inflate");
ol.geom.flat.inflate.coordinates = function(flatCoordinates, offset, end, stride, opt_coordinates) {
  var coordinates = opt_coordinates !== undefined ? opt_coordinates : [];
  var i = 0;
  var j;
  for (j = offset;j < end;j += stride) {
    coordinates[i++] = flatCoordinates.slice(j, j + stride);
  }
  coordinates.length = i;
  return coordinates;
};
ol.geom.flat.inflate.coordinatess = function(flatCoordinates, offset, ends, stride, opt_coordinatess) {
  var coordinatess = opt_coordinatess !== undefined ? opt_coordinatess : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = ends.length;j < jj;++j) {
    var end = ends[j];
    coordinatess[i++] = ol.geom.flat.inflate.coordinates(flatCoordinates, offset, end, stride, coordinatess[i]);
    offset = end;
  }
  coordinatess.length = i;
  return coordinatess;
};
ol.geom.flat.inflate.coordinatesss = function(flatCoordinates, offset, endss, stride, opt_coordinatesss) {
  var coordinatesss = opt_coordinatesss !== undefined ? opt_coordinatesss : [];
  var i = 0;
  var j, jj;
  for (j = 0, jj = endss.length;j < jj;++j) {
    var ends = endss[j];
    coordinatesss[i++] = ol.geom.flat.inflate.coordinatess(flatCoordinates, offset, ends, stride, coordinatesss[i]);
    offset = ends[ends.length - 1];
  }
  coordinatesss.length = i;
  return coordinatesss;
};
goog.provide("ol.geom.flat.interpolate");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.math");
ol.geom.flat.interpolate.lineString = function(flatCoordinates, offset, end, stride, fraction, opt_dest) {
  ol.DEBUG && console.assert(0 <= fraction && fraction <= 1, "fraction should be in between 0 and 1");
  var pointX = NaN;
  var pointY = NaN;
  var n = (end - offset) / stride;
  if (n === 0) {
    ol.DEBUG && console.assert(false, "n cannot be 0");
  } else {
    if (n == 1) {
      pointX = flatCoordinates[offset];
      pointY = flatCoordinates[offset + 1];
    } else {
      if (n == 2) {
        pointX = (1 - fraction) * flatCoordinates[offset] + fraction * flatCoordinates[offset + stride];
        pointY = (1 - fraction) * flatCoordinates[offset + 1] + fraction * flatCoordinates[offset + stride + 1];
      } else {
        var x1 = flatCoordinates[offset];
        var y1 = flatCoordinates[offset + 1];
        var length = 0;
        var cumulativeLengths = [0];
        var i;
        for (i = offset + stride;i < end;i += stride) {
          var x2 = flatCoordinates[i];
          var y2 = flatCoordinates[i + 1];
          length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
          cumulativeLengths.push(length);
          x1 = x2;
          y1 = y2;
        }
        var target = fraction * length;
        var index = ol.array.binarySearch(cumulativeLengths, target);
        if (index < 0) {
          var t = (target - cumulativeLengths[-index - 2]) / (cumulativeLengths[-index - 1] - cumulativeLengths[-index - 2]);
          var o = offset + (-index - 2) * stride;
          pointX = ol.math.lerp(flatCoordinates[o], flatCoordinates[o + stride], t);
          pointY = ol.math.lerp(flatCoordinates[o + 1], flatCoordinates[o + stride + 1], t);
        } else {
          pointX = flatCoordinates[offset + index * stride];
          pointY = flatCoordinates[offset + index * stride + 1];
        }
      }
    }
  }
  if (opt_dest) {
    opt_dest[0] = pointX;
    opt_dest[1] = pointY;
    return opt_dest;
  } else {
    return [pointX, pointY];
  }
};
ol.geom.flat.lineStringCoordinateAtM = function(flatCoordinates, offset, end, stride, m, extrapolate) {
  if (end == offset) {
    return null;
  }
  var coordinate;
  if (m < flatCoordinates[offset + stride - 1]) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(offset, offset + stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  } else {
    if (flatCoordinates[end - 1] < m) {
      if (extrapolate) {
        coordinate = flatCoordinates.slice(end - stride, end);
        coordinate[stride - 1] = m;
        return coordinate;
      } else {
        return null;
      }
    }
  }
  if (m == flatCoordinates[offset + stride - 1]) {
    return flatCoordinates.slice(offset, offset + stride);
  }
  var lo = offset / stride;
  var hi = end / stride;
  while (lo < hi) {
    var mid = lo + hi >> 1;
    if (m < flatCoordinates[(mid + 1) * stride - 1]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  var m0 = flatCoordinates[lo * stride - 1];
  if (m == m0) {
    return flatCoordinates.slice((lo - 1) * stride, (lo - 1) * stride + stride);
  }
  var m1 = flatCoordinates[(lo + 1) * stride - 1];
  ol.DEBUG && console.assert(m0 < m, "m0 should be less than m");
  ol.DEBUG && console.assert(m <= m1, "m should be less than or equal to m1");
  var t = (m - m0) / (m1 - m0);
  coordinate = [];
  var i;
  for (i = 0;i < stride - 1;++i) {
    coordinate.push(ol.math.lerp(flatCoordinates[(lo - 1) * stride + i], flatCoordinates[lo * stride + i], t));
  }
  coordinate.push(m);
  ol.DEBUG && console.assert(coordinate.length == stride, "length of coordinate array should match stride");
  return coordinate;
};
ol.geom.flat.lineStringsCoordinateAtM = function(flatCoordinates, offset, ends, stride, m, extrapolate, interpolate) {
  if (interpolate) {
    return ol.geom.flat.lineStringCoordinateAtM(flatCoordinates, offset, ends[ends.length - 1], stride, m, extrapolate);
  }
  var coordinate;
  if (m < flatCoordinates[stride - 1]) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(0, stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  if (flatCoordinates[flatCoordinates.length - 1] < m) {
    if (extrapolate) {
      coordinate = flatCoordinates.slice(flatCoordinates.length - stride);
      coordinate[stride - 1] = m;
      return coordinate;
    } else {
      return null;
    }
  }
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    if (offset == end) {
      continue;
    }
    if (m < flatCoordinates[offset + stride - 1]) {
      return null;
    } else {
      if (m <= flatCoordinates[end - 1]) {
        return ol.geom.flat.lineStringCoordinateAtM(flatCoordinates, offset, end, stride, m, false);
      }
    }
    offset = end;
  }
  ol.DEBUG && console.assert(false, "ol.geom.flat.lineStringsCoordinateAtM should have returned");
  return null;
};
goog.provide("ol.geom.flat.contains");
goog.require("ol");
goog.require("ol.extent");
ol.geom.flat.contains.linearRingContainsExtent = function(flatCoordinates, offset, end, stride, extent) {
  var outside = ol.extent.forEachCorner(extent, function(coordinate) {
    return !ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, offset, end, stride, coordinate[0], coordinate[1]);
  });
  return !outside;
};
ol.geom.flat.contains.linearRingContainsXY = function(flatCoordinates, offset, end, stride, x, y) {
  var contains = false;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (;offset < end;offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    var intersect = y1 > y != y2 > y && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1;
    if (intersect) {
      contains = !contains;
    }
    x1 = x2;
    y1 = y2;
  }
  return contains;
};
ol.geom.flat.contains.linearRingsContainsXY = function(flatCoordinates, offset, ends, stride, x, y) {
  ol.DEBUG && console.assert(ends.length > 0, "ends should not be an empty array");
  if (ends.length === 0) {
    return false;
  }
  if (!ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, offset, ends[0], stride, x, y)) {
    return false;
  }
  var i, ii;
  for (i = 1, ii = ends.length;i < ii;++i) {
    if (ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false;
    }
  }
  return true;
};
ol.geom.flat.contains.linearRingssContainsXY = function(flatCoordinates, offset, endss, stride, x, y) {
  ol.DEBUG && console.assert(endss.length > 0, "endss should not be an empty array");
  if (endss.length === 0) {
    return false;
  }
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    if (ol.geom.flat.contains.linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};
goog.provide("ol.geom.flat.segments");
ol.geom.flat.segments.forEach = function(flatCoordinates, offset, end, stride, callback, opt_this) {
  var point1 = [flatCoordinates[offset], flatCoordinates[offset + 1]];
  var point2 = [];
  var ret;
  for (;offset + stride < end;offset += stride) {
    point2[0] = flatCoordinates[offset + stride];
    point2[1] = flatCoordinates[offset + stride + 1];
    ret = callback.call(opt_this, point1, point2);
    if (ret) {
      return ret;
    }
    point1[0] = point2[0];
    point1[1] = point2[1];
  }
  return false;
};
goog.provide("ol.geom.flat.intersectsextent");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.geom.flat.contains");
goog.require("ol.geom.flat.segments");
ol.geom.flat.intersectsextent.lineString = function(flatCoordinates, offset, end, stride, extent) {
  var coordinatesExtent = ol.extent.extendFlatCoordinates(ol.extent.createEmpty(), flatCoordinates, offset, end, stride);
  if (!ol.extent.intersects(extent, coordinatesExtent)) {
    return false;
  }
  if (ol.extent.containsExtent(extent, coordinatesExtent)) {
    return true;
  }
  if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2]) {
    return true;
  }
  if (coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) {
    return true;
  }
  return ol.geom.flat.segments.forEach(flatCoordinates, offset, end, stride, function(point1, point2) {
    return ol.extent.intersectsSegment(extent, point1, point2);
  });
};
ol.geom.flat.intersectsextent.lineStrings = function(flatCoordinates, offset, ends, stride, extent) {
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    if (ol.geom.flat.intersectsextent.lineString(flatCoordinates, offset, ends[i], stride, extent)) {
      return true;
    }
    offset = ends[i];
  }
  return false;
};
ol.geom.flat.intersectsextent.linearRing = function(flatCoordinates, offset, end, stride, extent) {
  if (ol.geom.flat.intersectsextent.lineString(flatCoordinates, offset, end, stride, extent)) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[1])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, offset, end, stride, extent[0], extent[3])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[1])) {
    return true;
  }
  if (ol.geom.flat.contains.linearRingContainsXY(flatCoordinates, offset, end, stride, extent[2], extent[3])) {
    return true;
  }
  return false;
};
ol.geom.flat.intersectsextent.linearRings = function(flatCoordinates, offset, ends, stride, extent) {
  ol.DEBUG && console.assert(ends.length > 0, "ends should not be an empty array");
  if (!ol.geom.flat.intersectsextent.linearRing(flatCoordinates, offset, ends[0], stride, extent)) {
    return false;
  }
  if (ends.length === 1) {
    return true;
  }
  var i, ii;
  for (i = 1, ii = ends.length;i < ii;++i) {
    if (ol.geom.flat.contains.linearRingContainsExtent(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
      return false;
    }
  }
  return true;
};
ol.geom.flat.intersectsextent.linearRingss = function(flatCoordinates, offset, endss, stride, extent) {
  ol.DEBUG && console.assert(endss.length > 0, "endss should not be an empty array");
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    if (ol.geom.flat.intersectsextent.linearRings(flatCoordinates, offset, ends, stride, extent)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
};
goog.provide("ol.geom.flat.length");
ol.geom.flat.length.lineString = function(flatCoordinates, offset, end, stride) {
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  var length = 0;
  var i;
  for (i = offset + stride;i < end;i += stride) {
    var x2 = flatCoordinates[i];
    var y2 = flatCoordinates[i + 1];
    length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    x1 = x2;
    y1 = y2;
  }
  return length;
};
ol.geom.flat.length.linearRing = function(flatCoordinates, offset, end, stride) {
  var perimeter = ol.geom.flat.length.lineString(flatCoordinates, offset, end, stride);
  var dx = flatCoordinates[end - stride] - flatCoordinates[offset];
  var dy = flatCoordinates[end - stride + 1] - flatCoordinates[offset + 1];
  perimeter += Math.sqrt(dx * dx + dy * dy);
  return perimeter;
};
goog.provide("ol.geom.flat.simplify");
goog.require("ol.math");
ol.geom.flat.simplify.lineString = function(flatCoordinates, offset, end, stride, squaredTolerance, highQuality, opt_simplifiedFlatCoordinates) {
  var simplifiedFlatCoordinates = opt_simplifiedFlatCoordinates !== undefined ? opt_simplifiedFlatCoordinates : [];
  if (!highQuality) {
    end = ol.geom.flat.simplify.radialDistance(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, 0);
    flatCoordinates = simplifiedFlatCoordinates;
    offset = 0;
    stride = 2;
  }
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, 0);
  return simplifiedFlatCoordinates;
};
ol.geom.flat.simplify.douglasPeucker = function(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  var n = (end - offset) / stride;
  if (n < 3) {
    for (;offset < end;offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  var markers = new Array(n);
  markers[0] = 1;
  markers[n - 1] = 1;
  var stack = [offset, end - stride];
  var index = 0;
  var i;
  while (stack.length > 0) {
    var last = stack.pop();
    var first = stack.pop();
    var maxSquaredDistance = 0;
    var x1 = flatCoordinates[first];
    var y1 = flatCoordinates[first + 1];
    var x2 = flatCoordinates[last];
    var y2 = flatCoordinates[last + 1];
    for (i = first + stride;i < last;i += stride) {
      var x = flatCoordinates[i];
      var y = flatCoordinates[i + 1];
      var squaredDistance = ol.math.squaredSegmentDistance(x, y, x1, y1, x2, y2);
      if (squaredDistance > maxSquaredDistance) {
        index = i;
        maxSquaredDistance = squaredDistance;
      }
    }
    if (maxSquaredDistance > squaredTolerance) {
      markers[(index - offset) / stride] = 1;
      if (first + stride < index) {
        stack.push(first, index);
      }
      if (index + stride < last) {
        stack.push(index, last);
      }
    }
  }
  for (i = 0;i < n;++i) {
    if (markers[i]) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + i * stride];
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + i * stride + 1];
    }
  }
  return simplifiedOffset;
};
ol.geom.flat.simplify.douglasPeuckers = function(flatCoordinates, offset, ends, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    simplifiedOffset = ol.geom.flat.simplify.douglasPeucker(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset);
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
};
ol.geom.flat.simplify.douglasPeuckerss = function(flatCoordinates, offset, endss, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    var simplifiedEnds = [];
    simplifiedOffset = ol.geom.flat.simplify.douglasPeuckers(flatCoordinates, offset, ends, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
};
ol.geom.flat.simplify.radialDistance = function(flatCoordinates, offset, end, stride, squaredTolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  if (end <= offset + stride) {
    for (;offset < end;offset += stride) {
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset];
      simplifiedFlatCoordinates[simplifiedOffset++] = flatCoordinates[offset + 1];
    }
    return simplifiedOffset;
  }
  var x1 = flatCoordinates[offset];
  var y1 = flatCoordinates[offset + 1];
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  var x2 = x1;
  var y2 = y1;
  for (offset += stride;offset < end;offset += stride) {
    x2 = flatCoordinates[offset];
    y2 = flatCoordinates[offset + 1];
    if (ol.math.squaredDistance(x1, y1, x2, y2) > squaredTolerance) {
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      x1 = x2;
      y1 = y2;
    }
  }
  if (x2 != x1 || y2 != y1) {
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  }
  return simplifiedOffset;
};
ol.geom.flat.simplify.snap = function(value, tolerance) {
  return tolerance * Math.round(value / tolerance);
};
ol.geom.flat.simplify.quantize = function(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset) {
  if (offset == end) {
    return simplifiedOffset;
  }
  var x1 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
  var y1 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
  offset += stride;
  simplifiedFlatCoordinates[simplifiedOffset++] = x1;
  simplifiedFlatCoordinates[simplifiedOffset++] = y1;
  var x2, y2;
  do {
    x2 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
    y2 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    if (offset == end) {
      simplifiedFlatCoordinates[simplifiedOffset++] = x2;
      simplifiedFlatCoordinates[simplifiedOffset++] = y2;
      return simplifiedOffset;
    }
  } while (x2 == x1 && y2 == y1);
  while (offset < end) {
    var x3, y3;
    x3 = ol.geom.flat.simplify.snap(flatCoordinates[offset], tolerance);
    y3 = ol.geom.flat.simplify.snap(flatCoordinates[offset + 1], tolerance);
    offset += stride;
    if (x3 == x2 && y3 == y2) {
      continue;
    }
    var dx1 = x2 - x1;
    var dy1 = y2 - y1;
    var dx2 = x3 - x1;
    var dy2 = y3 - y1;
    if (dx1 * dy2 == dy1 * dx2 && (dx1 < 0 && dx2 < dx1 || dx1 == dx2 || dx1 > 0 && dx2 > dx1) && (dy1 < 0 && dy2 < dy1 || dy1 == dy2 || dy1 > 0 && dy2 > dy1)) {
      x2 = x3;
      y2 = y3;
      continue;
    }
    simplifiedFlatCoordinates[simplifiedOffset++] = x2;
    simplifiedFlatCoordinates[simplifiedOffset++] = y2;
    x1 = x2;
    y1 = y2;
    x2 = x3;
    y2 = y3;
  }
  simplifiedFlatCoordinates[simplifiedOffset++] = x2;
  simplifiedFlatCoordinates[simplifiedOffset++] = y2;
  return simplifiedOffset;
};
ol.geom.flat.simplify.quantizes = function(flatCoordinates, offset, ends, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds) {
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    simplifiedOffset = ol.geom.flat.simplify.quantize(flatCoordinates, offset, end, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset);
    simplifiedEnds.push(simplifiedOffset);
    offset = end;
  }
  return simplifiedOffset;
};
ol.geom.flat.simplify.quantizess = function(flatCoordinates, offset, endss, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEndss) {
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    var simplifiedEnds = [];
    simplifiedOffset = ol.geom.flat.simplify.quantizes(flatCoordinates, offset, ends, stride, tolerance, simplifiedFlatCoordinates, simplifiedOffset, simplifiedEnds);
    simplifiedEndss.push(simplifiedEnds);
    offset = ends[ends.length - 1];
  }
  return simplifiedOffset;
};
goog.provide("ol.geom.LineString");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.closest");
goog.require("ol.geom.flat.deflate");
goog.require("ol.geom.flat.inflate");
goog.require("ol.geom.flat.interpolate");
goog.require("ol.geom.flat.intersectsextent");
goog.require("ol.geom.flat.length");
goog.require("ol.geom.flat.segments");
goog.require("ol.geom.flat.simplify");
ol.geom.LineString = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.flatMidpoint_ = null;
  this.flatMidpointRevision_ = -1;
  this.maxDelta_ = -1;
  this.maxDeltaRevision_ = -1;
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.LineString, ol.geom.SimpleGeometry);
ol.geom.LineString.prototype.appendCoordinate = function(coordinate) {
  ol.DEBUG && console.assert(coordinate.length == this.stride, "length of coordinate array should match stride");
  if (!this.flatCoordinates) {
    this.flatCoordinates = coordinate.slice();
  } else {
    ol.array.extend(this.flatCoordinates, coordinate);
  }
  this.changed();
};
ol.geom.LineString.prototype.clone = function() {
  var lineString = new ol.geom.LineString(null);
  lineString.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return lineString;
};
ol.geom.LineString.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getMaxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
};
ol.geom.LineString.prototype.forEachSegment = function(callback, opt_this) {
  return ol.geom.flat.segments.forEach(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, callback, opt_this);
};
ol.geom.LineString.prototype.getCoordinateAtM = function(m, opt_extrapolate) {
  if (this.layout != ol.geom.GeometryLayout.XYM && this.layout != ol.geom.GeometryLayout.XYZM) {
    return null;
  }
  var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
  return ol.geom.flat.lineStringCoordinateAtM(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, m, extrapolate);
};
ol.geom.LineString.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};
ol.geom.LineString.prototype.getCoordinateAt = function(fraction, opt_dest) {
  return ol.geom.flat.interpolate.lineString(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, fraction, opt_dest);
};
ol.geom.LineString.prototype.getLength = function() {
  return ol.geom.flat.length.lineString(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};
ol.geom.LineString.prototype.getFlatMidpoint = function() {
  if (this.flatMidpointRevision_ != this.getRevision()) {
    this.flatMidpoint_ = this.getCoordinateAt(.5, this.flatMidpoint_);
    this.flatMidpointRevision_ = this.getRevision();
  }
  return this.flatMidpoint_;
};
ol.geom.LineString.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
  var simplifiedLineString = new ol.geom.LineString(null);
  simplifiedLineString.setFlatCoordinates(ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates);
  return simplifiedLineString;
};
ol.geom.LineString.prototype.getType = function() {
  return ol.geom.GeometryType.LINE_STRING;
};
ol.geom.LineString.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.lineString(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
};
ol.geom.LineString.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};
ol.geom.LineString.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};
goog.provide("ol.format.IGC");
goog.require("ol");
goog.require("ol.Feature");
goog.require("ol.format.Feature");
goog.require("ol.format.TextFeature");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.LineString");
goog.require("ol.proj");
ol.format.IGC = function(opt_options) {
  var options = opt_options ? opt_options : {};
  ol.format.TextFeature.call(this);
  this.defaultDataProjection = ol.proj.get("EPSG:4326");
  this.altitudeMode_ = options.altitudeMode ? options.altitudeMode : ol.format.IGC.Z.NONE;
};
ol.inherits(ol.format.IGC, ol.format.TextFeature);
ol.format.IGC.EXTENSIONS_ = [".igc"];
ol.format.IGC.B_RECORD_RE_ = /^B(\d{2})(\d{2})(\d{2})(\d{2})(\d{5})([NS])(\d{3})(\d{5})([EW])([AV])(\d{5})(\d{5})/;
ol.format.IGC.H_RECORD_RE_ = /^H.([A-Z]{3}).*?:(.*)/;
ol.format.IGC.HFDTE_RECORD_RE_ = /^HFDTE(\d{2})(\d{2})(\d{2})/;
ol.format.IGC.NEWLINE_RE_ = /\r\n|\r|\n/;
ol.format.IGC.prototype.getExtensions = function() {
  return ol.format.IGC.EXTENSIONS_;
};
ol.format.IGC.prototype.readFeature;
ol.format.IGC.prototype.readFeatureFromText = function(text, opt_options) {
  var altitudeMode = this.altitudeMode_;
  var lines = text.split(ol.format.IGC.NEWLINE_RE_);
  var properties = {};
  var flatCoordinates = [];
  var year = 2E3;
  var month = 0;
  var day = 1;
  var lastDateTime = -1;
  var i, ii;
  for (i = 0, ii = lines.length;i < ii;++i) {
    var line = lines[i];
    var m;
    if (line.charAt(0) == "B") {
      m = ol.format.IGC.B_RECORD_RE_.exec(line);
      if (m) {
        var hour = parseInt(m[1], 10);
        var minute = parseInt(m[2], 10);
        var second = parseInt(m[3], 10);
        var y = parseInt(m[4], 10) + parseInt(m[5], 10) / 6E4;
        if (m[6] == "S") {
          y = -y;
        }
        var x = parseInt(m[7], 10) + parseInt(m[8], 10) / 6E4;
        if (m[9] == "W") {
          x = -x;
        }
        flatCoordinates.push(x, y);
        if (altitudeMode != ol.format.IGC.Z.NONE) {
          var z;
          if (altitudeMode == ol.format.IGC.Z.GPS) {
            z = parseInt(m[11], 10);
          } else {
            if (altitudeMode == ol.format.IGC.Z.BAROMETRIC) {
              z = parseInt(m[12], 10);
            } else {
              ol.DEBUG && console.assert(false, "Unknown altitude mode.");
              z = 0;
            }
          }
          flatCoordinates.push(z);
        }
        var dateTime = Date.UTC(year, month, day, hour, minute, second);
        if (dateTime < lastDateTime) {
          dateTime = Date.UTC(year, month, day + 1, hour, minute, second);
        }
        flatCoordinates.push(dateTime / 1E3);
        lastDateTime = dateTime;
      }
    } else {
      if (line.charAt(0) == "H") {
        m = ol.format.IGC.HFDTE_RECORD_RE_.exec(line);
        if (m) {
          day = parseInt(m[1], 10);
          month = parseInt(m[2], 10) - 1;
          year = 2E3 + parseInt(m[3], 10);
        } else {
          m = ol.format.IGC.H_RECORD_RE_.exec(line);
          if (m) {
            properties[m[1]] = m[2].trim();
          }
        }
      }
    }
  }
  if (flatCoordinates.length === 0) {
    return null;
  }
  var lineString = new ol.geom.LineString(null);
  var layout = altitudeMode == ol.format.IGC.Z.NONE ? ol.geom.GeometryLayout.XYM : ol.geom.GeometryLayout.XYZM;
  lineString.setFlatCoordinates(layout, flatCoordinates);
  var feature = new ol.Feature(ol.format.Feature.transformWithOptions(lineString, false, opt_options));
  feature.setProperties(properties);
  return feature;
};
ol.format.IGC.prototype.readFeatures;
ol.format.IGC.prototype.readFeaturesFromText = function(text, opt_options) {
  var feature = this.readFeatureFromText(text, opt_options);
  if (feature) {
    return [feature];
  } else {
    return [];
  }
};
ol.format.IGC.prototype.readProjection;
ol.format.IGC.Z = {BAROMETRIC:"barometric", GPS:"gps", NONE:"none"};
goog.provide("ol.MapEvent");
goog.require("ol");
goog.require("ol.events.Event");
ol.MapEvent = function(type, map, opt_frameState) {
  ol.events.Event.call(this, type);
  this.map = map;
  this.frameState = opt_frameState !== undefined ? opt_frameState : null;
};
ol.inherits(ol.MapEvent, ol.events.Event);
ol.MapEvent.Type = {POSTRENDER:"postrender", MOVEEND:"moveend"};
goog.provide("ol.Overlay");
goog.require("ol");
goog.require("ol.MapEvent");
goog.require("ol.Object");
goog.require("ol.dom");
goog.require("ol.events");
goog.require("ol.extent");
ol.Overlay = function(options) {
  ol.Object.call(this);
  this.id_ = options.id;
  this.insertFirst_ = options.insertFirst !== undefined ? options.insertFirst : true;
  this.stopEvent_ = options.stopEvent !== undefined ? options.stopEvent : true;
  this.element_ = document.createElement("DIV");
  this.element_.className = "ol-overlay-container";
  this.element_.style.position = "absolute";
  this.autoPan = options.autoPan !== undefined ? options.autoPan : false;
  this.autoPanAnimation_ = options.autoPanAnimation || ({});
  this.autoPanMargin_ = options.autoPanMargin !== undefined ? options.autoPanMargin : 20;
  this.rendered_ = {bottom_:"", left_:"", right_:"", top_:"", visible:true};
  this.mapPostrenderListenerKey_ = null;
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Overlay.Property.ELEMENT), this.handleElementChanged, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Overlay.Property.MAP), this.handleMapChanged, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Overlay.Property.OFFSET), this.handleOffsetChanged, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Overlay.Property.POSITION), this.handlePositionChanged, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Overlay.Property.POSITIONING), this.handlePositioningChanged, this);
  if (options.element !== undefined) {
    this.setElement(options.element);
  }
  this.setOffset(options.offset !== undefined ? options.offset : [0, 0]);
  this.setPositioning(options.positioning !== undefined ? (options.positioning) : ol.Overlay.Positioning.TOP_LEFT);
  if (options.position !== undefined) {
    this.setPosition(options.position);
  }
};
ol.inherits(ol.Overlay, ol.Object);
ol.Overlay.prototype.getElement = function() {
  return (this.get(ol.Overlay.Property.ELEMENT));
};
ol.Overlay.prototype.getId = function() {
  return this.id_;
};
ol.Overlay.prototype.getMap = function() {
  return (this.get(ol.Overlay.Property.MAP));
};
ol.Overlay.prototype.getOffset = function() {
  return (this.get(ol.Overlay.Property.OFFSET));
};
ol.Overlay.prototype.getPosition = function() {
  return (this.get(ol.Overlay.Property.POSITION));
};
ol.Overlay.prototype.getPositioning = function() {
  return (this.get(ol.Overlay.Property.POSITIONING));
};
ol.Overlay.prototype.handleElementChanged = function() {
  ol.dom.removeChildren(this.element_);
  var element = this.getElement();
  if (element) {
    this.element_.appendChild(element);
  }
};
ol.Overlay.prototype.handleMapChanged = function() {
  if (this.mapPostrenderListenerKey_) {
    ol.dom.removeNode(this.element_);
    ol.events.unlistenByKey(this.mapPostrenderListenerKey_);
    this.mapPostrenderListenerKey_ = null;
  }
  var map = this.getMap();
  if (map) {
    this.mapPostrenderListenerKey_ = ol.events.listen(map, ol.MapEvent.Type.POSTRENDER, this.render, this);
    this.updatePixelPosition();
    var container = this.stopEvent_ ? map.getOverlayContainerStopEvent() : map.getOverlayContainer();
    if (this.insertFirst_) {
      container.insertBefore(this.element_, container.childNodes[0] || null);
    } else {
      container.appendChild(this.element_);
    }
  }
};
ol.Overlay.prototype.render = function() {
  this.updatePixelPosition();
};
ol.Overlay.prototype.handleOffsetChanged = function() {
  this.updatePixelPosition();
};
ol.Overlay.prototype.handlePositionChanged = function() {
  this.updatePixelPosition();
  if (this.get(ol.Overlay.Property.POSITION) !== undefined && this.autoPan) {
    this.panIntoView_();
  }
};
ol.Overlay.prototype.handlePositioningChanged = function() {
  this.updatePixelPosition();
};
ol.Overlay.prototype.setElement = function(element) {
  this.set(ol.Overlay.Property.ELEMENT, element);
};
ol.Overlay.prototype.setMap = function(map) {
  this.set(ol.Overlay.Property.MAP, map);
};
ol.Overlay.prototype.setOffset = function(offset) {
  this.set(ol.Overlay.Property.OFFSET, offset);
};
ol.Overlay.prototype.setPosition = function(position) {
  this.set(ol.Overlay.Property.POSITION, position);
};
ol.Overlay.prototype.panIntoView_ = function() {
  var map = this.getMap();
  if (map === undefined || !map.getTargetElement()) {
    return;
  }
  var mapRect = this.getRect_(map.getTargetElement(), map.getSize());
  var element = (this.getElement());
  var overlayRect = this.getRect_(element, [ol.dom.outerWidth(element), ol.dom.outerHeight(element)]);
  var margin = this.autoPanMargin_;
  if (!ol.extent.containsExtent(mapRect, overlayRect)) {
    var offsetLeft = overlayRect[0] - mapRect[0];
    var offsetRight = mapRect[2] - overlayRect[2];
    var offsetTop = overlayRect[1] - mapRect[1];
    var offsetBottom = mapRect[3] - overlayRect[3];
    var delta = [0, 0];
    if (offsetLeft < 0) {
      delta[0] = offsetLeft - margin;
    } else {
      if (offsetRight < 0) {
        delta[0] = Math.abs(offsetRight) + margin;
      }
    }
    if (offsetTop < 0) {
      delta[1] = offsetTop - margin;
    } else {
      if (offsetBottom < 0) {
        delta[1] = Math.abs(offsetBottom) + margin;
      }
    }
    if (delta[0] !== 0 || delta[1] !== 0) {
      var center = (map.getView().getCenter());
      var centerPx = map.getPixelFromCoordinate(center);
      var newCenterPx = [centerPx[0] + delta[0], centerPx[1] + delta[1]];
      map.getView().animate({center:map.getCoordinateFromPixel(newCenterPx), duration:this.autoPanAnimation_.duration, easing:this.autoPanAnimation_.easing});
    }
  }
};
ol.Overlay.prototype.getRect_ = function(element, size) {
  var box = element.getBoundingClientRect();
  var offsetX = box.left + window.pageXOffset;
  var offsetY = box.top + window.pageYOffset;
  return [offsetX, offsetY, offsetX + size[0], offsetY + size[1]];
};
ol.Overlay.prototype.setPositioning = function(positioning) {
  this.set(ol.Overlay.Property.POSITIONING, positioning);
};
ol.Overlay.prototype.setVisible = function(visible) {
  if (this.rendered_.visible !== visible) {
    this.element_.style.display = visible ? "" : "none";
    this.rendered_.visible = visible;
  }
};
ol.Overlay.prototype.updatePixelPosition = function() {
  var map = this.getMap();
  var position = this.getPosition();
  if (map === undefined || !map.isRendered() || position === undefined) {
    this.setVisible(false);
    return;
  }
  var pixel = map.getPixelFromCoordinate(position);
  var mapSize = map.getSize();
  this.updateRenderedPosition(pixel, mapSize);
};
ol.Overlay.prototype.updateRenderedPosition = function(pixel, mapSize) {
  var style = this.element_.style;
  var offset = this.getOffset();
  var positioning = this.getPositioning();
  ol.DEBUG && console.assert(positioning !== undefined, "positioning should be defined");
  var offsetX = offset[0];
  var offsetY = offset[1];
  if (positioning == ol.Overlay.Positioning.BOTTOM_RIGHT || positioning == ol.Overlay.Positioning.CENTER_RIGHT || positioning == ol.Overlay.Positioning.TOP_RIGHT) {
    if (this.rendered_.left_ !== "") {
      this.rendered_.left_ = style.left = "";
    }
    var right = Math.round(mapSize[0] - pixel[0] - offsetX) + "px";
    if (this.rendered_.right_ != right) {
      this.rendered_.right_ = style.right = right;
    }
  } else {
    if (this.rendered_.right_ !== "") {
      this.rendered_.right_ = style.right = "";
    }
    if (positioning == ol.Overlay.Positioning.BOTTOM_CENTER || positioning == ol.Overlay.Positioning.CENTER_CENTER || positioning == ol.Overlay.Positioning.TOP_CENTER) {
      offsetX -= this.element_.offsetWidth / 2;
    }
    var left = Math.round(pixel[0] + offsetX) + "px";
    if (this.rendered_.left_ != left) {
      this.rendered_.left_ = style.left = left;
    }
  }
  if (positioning == ol.Overlay.Positioning.BOTTOM_LEFT || positioning == ol.Overlay.Positioning.BOTTOM_CENTER || positioning == ol.Overlay.Positioning.BOTTOM_RIGHT) {
    if (this.rendered_.top_ !== "") {
      this.rendered_.top_ = style.top = "";
    }
    var bottom = Math.round(mapSize[1] - pixel[1] - offsetY) + "px";
    if (this.rendered_.bottom_ != bottom) {
      this.rendered_.bottom_ = style.bottom = bottom;
    }
  } else {
    if (this.rendered_.bottom_ !== "") {
      this.rendered_.bottom_ = style.bottom = "";
    }
    if (positioning == ol.Overlay.Positioning.CENTER_LEFT || positioning == ol.Overlay.Positioning.CENTER_CENTER || positioning == ol.Overlay.Positioning.CENTER_RIGHT) {
      offsetY -= this.element_.offsetHeight / 2;
    }
    var top = Math.round(pixel[1] + offsetY) + "px";
    if (this.rendered_.top_ != top) {
      this.rendered_.top_ = style.top = top;
    }
  }
  this.setVisible(true);
};
ol.Overlay.Positioning = {BOTTOM_LEFT:"bottom-left", BOTTOM_CENTER:"bottom-center", BOTTOM_RIGHT:"bottom-right", CENTER_LEFT:"center-left", CENTER_CENTER:"center-center", CENTER_RIGHT:"center-right", TOP_LEFT:"top-left", TOP_CENTER:"top-center", TOP_RIGHT:"top-right"};
ol.Overlay.Property = {ELEMENT:"element", MAP:"map", OFFSET:"offset", POSITION:"position", POSITIONING:"positioning"};
goog.provide("ol.control.Control");
goog.require("ol.events");
goog.require("ol");
goog.require("ol.MapEvent");
goog.require("ol.Object");
goog.require("ol.dom");
ol.control.Control = function(options) {
  ol.Object.call(this);
  this.element = options.element ? options.element : null;
  this.target_ = null;
  this.map_ = null;
  this.listenerKeys = [];
  this.render = options.render ? options.render : ol.nullFunction;
  if (options.target) {
    this.setTarget(options.target);
  }
};
ol.inherits(ol.control.Control, ol.Object);
ol.control.Control.prototype.disposeInternal = function() {
  ol.dom.removeNode(this.element);
  ol.Object.prototype.disposeInternal.call(this);
};
ol.control.Control.prototype.getMap = function() {
  return this.map_;
};
ol.control.Control.prototype.setMap = function(map) {
  if (this.map_) {
    ol.dom.removeNode(this.element);
  }
  for (var i = 0, ii = this.listenerKeys.length;i < ii;++i) {
    ol.events.unlistenByKey(this.listenerKeys[i]);
  }
  this.listenerKeys.length = 0;
  this.map_ = map;
  if (this.map_) {
    var target = this.target_ ? this.target_ : map.getOverlayContainerStopEvent();
    target.appendChild(this.element);
    if (this.render !== ol.nullFunction) {
      this.listenerKeys.push(ol.events.listen(map, ol.MapEvent.Type.POSTRENDER, this.render, this));
    }
    map.render();
  }
};
ol.control.Control.prototype.setTarget = function(target) {
  this.target_ = typeof target === "string" ? document.getElementById(target) : target;
};
goog.provide("ol.css");
ol.css.CLASS_HIDDEN = "ol-hidden";
ol.css.CLASS_UNSELECTABLE = "ol-unselectable";
ol.css.CLASS_UNSUPPORTED = "ol-unsupported";
ol.css.CLASS_CONTROL = "ol-control";
goog.provide("ol.control.ScaleLine");
goog.require("ol");
goog.require("ol.Object");
goog.require("ol.asserts");
goog.require("ol.control.Control");
goog.require("ol.css");
goog.require("ol.events");
goog.require("ol.proj.METERS_PER_UNIT");
goog.require("ol.proj.Units");
ol.control.ScaleLine = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var className = options.className !== undefined ? options.className : "ol-scale-line";
  this.innerElement_ = document.createElement("DIV");
  this.innerElement_.className = className + "-inner";
  this.element_ = document.createElement("DIV");
  this.element_.className = className + " " + ol.css.CLASS_UNSELECTABLE;
  this.element_.appendChild(this.innerElement_);
  this.viewState_ = null;
  this.minWidth_ = options.minWidth !== undefined ? options.minWidth : 64;
  this.renderedVisible_ = false;
  this.renderedWidth_ = undefined;
  this.renderedHTML_ = "";
  var render = options.render ? options.render : ol.control.ScaleLine.render;
  ol.control.Control.call(this, {element:this.element_, render:render, target:options.target});
  ol.events.listen(this, ol.Object.getChangeEventType(ol.control.ScaleLine.Property.UNITS), this.handleUnitsChanged_, this);
  this.setUnits((options.units) || ol.control.ScaleLine.Units.METRIC);
};
ol.inherits(ol.control.ScaleLine, ol.control.Control);
ol.control.ScaleLine.LEADING_DIGITS = [1, 2, 5];
ol.control.ScaleLine.prototype.getUnits = function() {
  return (this.get(ol.control.ScaleLine.Property.UNITS));
};
ol.control.ScaleLine.render = function(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    this.viewState_ = null;
  } else {
    this.viewState_ = frameState.viewState;
  }
  this.updateElement_();
};
ol.control.ScaleLine.prototype.handleUnitsChanged_ = function() {
  this.updateElement_();
};
ol.control.ScaleLine.prototype.setUnits = function(units) {
  this.set(ol.control.ScaleLine.Property.UNITS, units);
};
ol.control.ScaleLine.prototype.updateElement_ = function() {
  var viewState = this.viewState_;
  if (!viewState) {
    if (this.renderedVisible_) {
      this.element_.style.display = "none";
      this.renderedVisible_ = false;
    }
    return;
  }
  var center = viewState.center;
  var projection = viewState.projection;
  var metersPerUnit = projection.getMetersPerUnit();
  var pointResolution = projection.getPointResolution(viewState.resolution, center) * metersPerUnit;
  var nominalCount = this.minWidth_ * pointResolution;
  var suffix = "";
  var units = this.getUnits();
  if (units == ol.control.ScaleLine.Units.DEGREES) {
    var metersPerDegree = ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES];
    pointResolution /= metersPerDegree;
    if (nominalCount < metersPerDegree / 60) {
      suffix = "\u2033";
      pointResolution *= 3600;
    } else {
      if (nominalCount < metersPerDegree) {
        suffix = "\u2032";
        pointResolution *= 60;
      } else {
        suffix = "\u00b0";
      }
    }
  } else {
    if (units == ol.control.ScaleLine.Units.IMPERIAL) {
      if (nominalCount < .9144) {
        suffix = "in";
        pointResolution /= .0254;
      } else {
        if (nominalCount < 1609.344) {
          suffix = "ft";
          pointResolution /= .3048;
        } else {
          suffix = "mi";
          pointResolution /= 1609.344;
        }
      }
    } else {
      if (units == ol.control.ScaleLine.Units.NAUTICAL) {
        pointResolution /= 1852;
        suffix = "nm";
      } else {
        if (units == ol.control.ScaleLine.Units.METRIC) {
          if (nominalCount < 1) {
            suffix = "mm";
            pointResolution *= 1E3;
          } else {
            if (nominalCount < 1E3) {
              suffix = "m";
            } else {
              suffix = "km";
              pointResolution /= 1E3;
            }
          }
        } else {
          if (units == ol.control.ScaleLine.Units.US) {
            if (nominalCount < .9144) {
              suffix = "in";
              pointResolution *= 39.37;
            } else {
              if (nominalCount < 1609.344) {
                suffix = "ft";
                pointResolution /= .30480061;
              } else {
                suffix = "mi";
                pointResolution /= 1609.3472;
              }
            }
          } else {
            ol.asserts.assert(false, 33);
          }
        }
      }
    }
  }
  var i = 3 * Math.floor(Math.log(this.minWidth_ * pointResolution) / Math.log(10));
  var count, width;
  while (true) {
    count = ol.control.ScaleLine.LEADING_DIGITS[(i % 3 + 3) % 3] * Math.pow(10, Math.floor(i / 3));
    width = Math.round(count / pointResolution);
    if (isNaN(width)) {
      this.element_.style.display = "none";
      this.renderedVisible_ = false;
      return;
    } else {
      if (width >= this.minWidth_) {
        break;
      }
    }
    ++i;
  }
  var html = count + " " + suffix;
  if (this.renderedHTML_ != html) {
    this.innerElement_.innerHTML = html;
    this.renderedHTML_ = html;
  }
  if (this.renderedWidth_ != width) {
    this.innerElement_.style.width = width + "px";
    this.renderedWidth_ = width;
  }
  if (!this.renderedVisible_) {
    this.element_.style.display = "";
    this.renderedVisible_ = true;
  }
};
ol.control.ScaleLine.Property = {UNITS:"units"};
ol.control.ScaleLine.Units = {DEGREES:"degrees", IMPERIAL:"imperial", NAUTICAL:"nautical", METRIC:"metric", US:"us"};
goog.provide("ol.tilecoord");
ol.tilecoord.createOrUpdate = function(z, x, y, opt_tileCoord) {
  if (opt_tileCoord !== undefined) {
    opt_tileCoord[0] = z;
    opt_tileCoord[1] = x;
    opt_tileCoord[2] = y;
    return opt_tileCoord;
  } else {
    return [z, x, y];
  }
};
ol.tilecoord.getKeyZXY = function(z, x, y) {
  return z + "/" + x + "/" + y;
};
ol.tilecoord.hash = function(tileCoord) {
  return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
};
ol.tilecoord.quadKey = function(tileCoord) {
  var z = tileCoord[0];
  var digits = new Array(z);
  var mask = 1 << z - 1;
  var i, charCode;
  for (i = 0;i < z;++i) {
    charCode = 48;
    if (tileCoord[1] & mask) {
      charCode += 1;
    }
    if (tileCoord[2] & mask) {
      charCode += 2;
    }
    digits[i] = String.fromCharCode(charCode);
    mask >>= 1;
  }
  return digits.join("");
};
ol.tilecoord.withinExtentAndZ = function(tileCoord, tileGrid) {
  var z = tileCoord[0];
  var x = tileCoord[1];
  var y = tileCoord[2];
  if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
    return false;
  }
  var extent = tileGrid.getExtent();
  var tileRange;
  if (!extent) {
    tileRange = tileGrid.getFullTileRange(z);
  } else {
    tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
  }
  if (!tileRange) {
    return true;
  } else {
    return tileRange.containsXY(x, y);
  }
};
goog.provide("ol.TileUrlFunction");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.math");
goog.require("ol.tilecoord");
ol.TileUrlFunction.createFromTemplate = function(template, tileGrid) {
  var zRegEx = /\{z\}/g;
  var xRegEx = /\{x\}/g;
  var yRegEx = /\{y\}/g;
  var dashYRegEx = /\{-y\}/g;
  return function(tileCoord, pixelRatio, projection) {
    if (!tileCoord) {
      return undefined;
    } else {
      return template.replace(zRegEx, tileCoord[0].toString()).replace(xRegEx, tileCoord[1].toString()).replace(yRegEx, function() {
        var y = -tileCoord[2] - 1;
        return y.toString();
      }).replace(dashYRegEx, function() {
        var z = tileCoord[0];
        var range = tileGrid.getFullTileRange(z);
        ol.asserts.assert(range, 55);
        var y = range.getHeight() + tileCoord[2];
        return y.toString();
      });
    }
  };
};
ol.TileUrlFunction.createFromTemplates = function(templates, tileGrid) {
  var len = templates.length;
  var tileUrlFunctions = new Array(len);
  for (var i = 0;i < len;++i) {
    tileUrlFunctions[i] = ol.TileUrlFunction.createFromTemplate(templates[i], tileGrid);
  }
  return ol.TileUrlFunction.createFromTileUrlFunctions(tileUrlFunctions);
};
ol.TileUrlFunction.createFromTileUrlFunctions = function(tileUrlFunctions) {
  ol.DEBUG && console.assert(tileUrlFunctions.length > 0, "Length of tile url functions should be greater than 0");
  if (tileUrlFunctions.length === 1) {
    return tileUrlFunctions[0];
  }
  return function(tileCoord, pixelRatio, projection) {
    if (!tileCoord) {
      return undefined;
    } else {
      var h = ol.tilecoord.hash(tileCoord);
      var index = ol.math.modulo(h, tileUrlFunctions.length);
      return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
    }
  };
};
ol.TileUrlFunction.nullTileUrlFunction = function(tileCoord, pixelRatio, projection) {
  return undefined;
};
ol.TileUrlFunction.expandUrl = function(url) {
  var urls = [];
  var match = /\{([a-z])-([a-z])\}/.exec(url);
  if (match) {
    var startCharCode = match[1].charCodeAt(0);
    var stopCharCode = match[2].charCodeAt(0);
    var charCode;
    for (charCode = startCharCode;charCode <= stopCharCode;++charCode) {
      urls.push(url.replace(match[0], String.fromCharCode(charCode)));
    }
    return urls;
  }
  match = match = /\{(\d+)-(\d+)\}/.exec(url);
  if (match) {
    var stop = parseInt(match[2], 10);
    for (var i = parseInt(match[1], 10);i <= stop;i++) {
      urls.push(url.replace(match[0], i.toString()));
    }
    return urls;
  }
  urls.push(url);
  return urls;
};
goog.provide("ol.Tile");
goog.require("ol");
goog.require("ol.events.EventTarget");
goog.require("ol.events.EventType");
ol.Tile = function(tileCoord, state) {
  ol.events.EventTarget.call(this);
  this.tileCoord = tileCoord;
  this.state = state;
  this.interimTile = null;
  this.key = "";
};
ol.inherits(ol.Tile, ol.events.EventTarget);
ol.Tile.prototype.changed = function() {
  this.dispatchEvent(ol.events.EventType.CHANGE);
};
ol.Tile.prototype.getImage = function() {
};
ol.Tile.prototype.getKey = function() {
  return this.key + "/" + this.tileCoord;
};
ol.Tile.prototype.getInterimTile = function() {
  if (!this.interimTile) {
    return this;
  }
  var tile = this.interimTile;
  do {
    if (tile.getState() == ol.Tile.State.LOADED) {
      return tile;
    }
    tile = tile.interimTile;
  } while (tile);
  return this;
};
ol.Tile.prototype.refreshInterimChain = function() {
  if (!this.interimTile) {
    return;
  }
  var tile = this.interimTile;
  var prev = this;
  do {
    if (tile.getState() == ol.Tile.State.LOADED) {
      tile.interimTile = null;
      break;
    } else {
      if (tile.getState() == ol.Tile.State.LOADING) {
        prev = tile;
      } else {
        if (tile.getState() == ol.Tile.State.IDLE) {
          prev.interimTile = tile.interimTile;
        } else {
          prev = tile;
        }
      }
    }
    tile = prev.interimTile;
  } while (tile);
};
ol.Tile.prototype.getTileCoord = function() {
  return this.tileCoord;
};
ol.Tile.prototype.getState = function() {
  return this.state;
};
ol.Tile.prototype.load = function() {
};
ol.Tile.State = {IDLE:0, LOADING:1, LOADED:2, ERROR:3, EMPTY:4, ABORT:5};
goog.provide("ol.ImageTile");
goog.require("ol");
goog.require("ol.Tile");
goog.require("ol.events");
goog.require("ol.events.EventType");
ol.ImageTile = function(tileCoord, state, src, crossOrigin, tileLoadFunction) {
  ol.Tile.call(this, tileCoord, state);
  this.src_ = src;
  this.image_ = new Image;
  if (crossOrigin !== null) {
    this.image_.crossOrigin = crossOrigin;
  }
  this.imageListenerKeys_ = null;
  this.tileLoadFunction_ = tileLoadFunction;
};
ol.inherits(ol.ImageTile, ol.Tile);
ol.ImageTile.prototype.disposeInternal = function() {
  if (this.state == ol.Tile.State.LOADING) {
    this.unlistenImage_();
  }
  if (this.interimTile) {
    this.interimTile.dispose();
  }
  this.state = ol.Tile.State.ABORT;
  this.changed();
  ol.Tile.prototype.disposeInternal.call(this);
};
ol.ImageTile.prototype.getImage = function() {
  return this.image_;
};
ol.ImageTile.prototype.getKey = function() {
  return this.src_;
};
ol.ImageTile.prototype.handleImageError_ = function() {
  this.state = ol.Tile.State.ERROR;
  this.unlistenImage_();
  this.changed();
};
ol.ImageTile.prototype.handleImageLoad_ = function() {
  if (this.image_.naturalWidth && this.image_.naturalHeight) {
    this.state = ol.Tile.State.LOADED;
  } else {
    this.state = ol.Tile.State.EMPTY;
  }
  this.unlistenImage_();
  this.changed();
};
ol.ImageTile.prototype.load = function() {
  if (this.state == ol.Tile.State.IDLE || this.state == ol.Tile.State.ERROR) {
    this.state = ol.Tile.State.LOADING;
    this.changed();
    ol.DEBUG && console.assert(!this.imageListenerKeys_, "this.imageListenerKeys_ should be null");
    this.imageListenerKeys_ = [ol.events.listenOnce(this.image_, ol.events.EventType.ERROR, this.handleImageError_, this), ol.events.listenOnce(this.image_, ol.events.EventType.LOAD, this.handleImageLoad_, this)];
    this.tileLoadFunction_(this, this.src_);
  }
};
ol.ImageTile.prototype.unlistenImage_ = function() {
  this.imageListenerKeys_.forEach(ol.events.unlistenByKey);
  this.imageListenerKeys_ = null;
};
goog.provide("ol.structs.LRUCache");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.obj");
ol.structs.LRUCache = function() {
  this.count_ = 0;
  this.entries_ = {};
  this.oldest_ = null;
  this.newest_ = null;
};
if (ol.DEBUG) {
  ol.structs.LRUCache.prototype.assertValid = function() {
    if (this.count_ === 0) {
      console.assert(ol.obj.isEmpty(this.entries_), "entries must be an empty object (count = 0)");
      console.assert(!this.oldest_, "oldest must be null (count = 0)");
      console.assert(!this.newest_, "newest must be null (count = 0)");
    } else {
      console.assert(Object.keys(this.entries_).length == this.count_, "number of entries matches count");
      console.assert(this.oldest_, "we have an oldest entry");
      console.assert(!this.oldest_.older, "no entry is older than oldest");
      console.assert(this.newest_, "we have a newest entry");
      console.assert(!this.newest_.newer, "no entry is newer than newest");
      var i, entry;
      var older = null;
      i = 0;
      for (entry = this.oldest_;entry;entry = entry.newer) {
        console.assert(entry.older === older, "entry.older links to correct older");
        older = entry;
        ++i;
      }
      console.assert(i == this.count_, "iterated correct amount of times");
      var newer = null;
      i = 0;
      for (entry = this.newest_;entry;entry = entry.older) {
        console.assert(entry.newer === newer, "entry.newer links to correct newer");
        newer = entry;
        ++i;
      }
      console.assert(i == this.count_, "iterated correct amount of times");
    }
  };
}
ol.structs.LRUCache.prototype.clear = function() {
  this.count_ = 0;
  this.entries_ = {};
  this.oldest_ = null;
  this.newest_ = null;
};
ol.structs.LRUCache.prototype.containsKey = function(key) {
  return this.entries_.hasOwnProperty(key);
};
ol.structs.LRUCache.prototype.forEach = function(f, opt_this) {
  var entry = this.oldest_;
  while (entry) {
    f.call(opt_this, entry.value_, entry.key_, this);
    entry = entry.newer;
  }
};
ol.structs.LRUCache.prototype.get = function(key) {
  var entry = this.entries_[key];
  ol.asserts.assert(entry !== undefined, 15);
  if (entry === this.newest_) {
    return entry.value_;
  } else {
    if (entry === this.oldest_) {
      this.oldest_ = (this.oldest_.newer);
      this.oldest_.older = null;
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
  }
  entry.newer = null;
  entry.older = this.newest_;
  this.newest_.newer = entry;
  this.newest_ = entry;
  return entry.value_;
};
ol.structs.LRUCache.prototype.getCount = function() {
  return this.count_;
};
ol.structs.LRUCache.prototype.getKeys = function() {
  var keys = new Array(this.count_);
  var i = 0;
  var entry;
  for (entry = this.newest_;entry;entry = entry.older) {
    keys[i++] = entry.key_;
  }
  ol.DEBUG && console.assert(i == this.count_, "iterated correct number of times");
  return keys;
};
ol.structs.LRUCache.prototype.getValues = function() {
  var values = new Array(this.count_);
  var i = 0;
  var entry;
  for (entry = this.newest_;entry;entry = entry.older) {
    values[i++] = entry.value_;
  }
  ol.DEBUG && console.assert(i == this.count_, "iterated correct number of times");
  return values;
};
ol.structs.LRUCache.prototype.peekLast = function() {
  ol.DEBUG && console.assert(this.oldest_, "oldest must not be null");
  return this.oldest_.value_;
};
ol.structs.LRUCache.prototype.peekLastKey = function() {
  ol.DEBUG && console.assert(this.oldest_, "oldest must not be null");
  return this.oldest_.key_;
};
ol.structs.LRUCache.prototype.pop = function() {
  ol.DEBUG && console.assert(this.oldest_, "oldest must not be null");
  ol.DEBUG && console.assert(this.newest_, "newest must not be null");
  var entry = this.oldest_;
  ol.DEBUG && console.assert(entry.key_ in this.entries_, "oldest is indexed in entries");
  delete this.entries_[entry.key_];
  if (entry.newer) {
    entry.newer.older = null;
  }
  this.oldest_ = (entry.newer);
  if (!this.oldest_) {
    this.newest_ = null;
  }
  --this.count_;
  return entry.value_;
};
ol.structs.LRUCache.prototype.replace = function(key, value) {
  this.get(key);
  this.entries_[key].value_ = value;
};
ol.structs.LRUCache.prototype.set = function(key, value) {
  ol.DEBUG && console.assert(!(key in {}), 'key is not a standard property of objects (e.g. "__proto__")');
  ol.asserts.assert(!(key in this.entries_), 16);
  var entry = ({key_:key, newer:null, older:this.newest_, value_:value});
  if (!this.newest_) {
    this.oldest_ = entry;
  } else {
    this.newest_.newer = entry;
  }
  this.newest_ = entry;
  this.entries_[key] = entry;
  ++this.count_;
};
goog.provide("ol.TileCache");
goog.require("ol");
goog.require("ol.structs.LRUCache");
ol.TileCache = function(opt_highWaterMark) {
  ol.structs.LRUCache.call(this);
  this.highWaterMark_ = opt_highWaterMark !== undefined ? opt_highWaterMark : 2048;
};
ol.inherits(ol.TileCache, ol.structs.LRUCache);
ol.TileCache.prototype.canExpireCache = function() {
  return this.getCount() > this.highWaterMark_;
};
ol.TileCache.prototype.expireCache = function(usedTiles) {
  var tile, zKey;
  while (this.canExpireCache()) {
    tile = this.peekLast();
    zKey = tile.tileCoord[0].toString();
    if (zKey in usedTiles && usedTiles[zKey].contains(tile.tileCoord)) {
      break;
    } else {
      this.pop().dispose();
    }
  }
};
goog.provide("ol.reproj");
goog.require("ol");
goog.require("ol.dom");
goog.require("ol.extent");
goog.require("ol.math");
goog.require("ol.proj");
ol.reproj.browserAntialiasesClip_ = function() {
  var isOpera = navigator.userAgent.indexOf("OPR") > -1;
  var isIEedge = navigator.userAgent.indexOf("Edge") > -1;
  return !(!navigator.userAgent.match("CriOS") && "chrome" in window && navigator.vendor === "Google Inc." && isOpera == false && isIEedge == false);
}();
ol.reproj.calculateSourceResolution = function(sourceProj, targetProj, targetCenter, targetResolution) {
  var sourceCenter = ol.proj.transform(targetCenter, targetProj, sourceProj);
  var sourceResolution = targetProj.getPointResolution(targetResolution, targetCenter);
  var targetMetersPerUnit = targetProj.getMetersPerUnit();
  if (targetMetersPerUnit !== undefined) {
    sourceResolution *= targetMetersPerUnit;
  }
  var sourceMetersPerUnit = sourceProj.getMetersPerUnit();
  if (sourceMetersPerUnit !== undefined) {
    sourceResolution /= sourceMetersPerUnit;
  }
  var compensationFactor = sourceProj.getPointResolution(sourceResolution, sourceCenter) / sourceResolution;
  if (isFinite(compensationFactor) && compensationFactor > 0) {
    sourceResolution /= compensationFactor;
  }
  return sourceResolution;
};
ol.reproj.enlargeClipPoint_ = function(centroidX, centroidY, x, y) {
  var dX = x - centroidX, dY = y - centroidY;
  var distance = Math.sqrt(dX * dX + dY * dY);
  return [Math.round(x + dX / distance), Math.round(y + dY / distance)];
};
ol.reproj.render = function(width, height, pixelRatio, sourceResolution, sourceExtent, targetResolution, targetExtent, triangulation, sources, gutter, opt_renderEdges) {
  var context = ol.dom.createCanvasContext2D(Math.round(pixelRatio * width), Math.round(pixelRatio * height));
  if (sources.length === 0) {
    return context.canvas;
  }
  context.scale(pixelRatio, pixelRatio);
  var sourceDataExtent = ol.extent.createEmpty();
  sources.forEach(function(src, i, arr) {
    ol.extent.extend(sourceDataExtent, src.extent);
  });
  var canvasWidthInUnits = ol.extent.getWidth(sourceDataExtent);
  var canvasHeightInUnits = ol.extent.getHeight(sourceDataExtent);
  var stitchContext = ol.dom.createCanvasContext2D(Math.round(pixelRatio * canvasWidthInUnits / sourceResolution), Math.round(pixelRatio * canvasHeightInUnits / sourceResolution));
  var stitchScale = pixelRatio / sourceResolution;
  sources.forEach(function(src, i, arr) {
    var xPos = src.extent[0] - sourceDataExtent[0];
    var yPos = -(src.extent[3] - sourceDataExtent[3]);
    var srcWidth = ol.extent.getWidth(src.extent);
    var srcHeight = ol.extent.getHeight(src.extent);
    stitchContext.drawImage(src.image, gutter, gutter, src.image.width - 2 * gutter, src.image.height - 2 * gutter, xPos * stitchScale, yPos * stitchScale, srcWidth * stitchScale, srcHeight * stitchScale);
  });
  var targetTopLeft = ol.extent.getTopLeft(targetExtent);
  triangulation.getTriangles().forEach(function(triangle, i, arr) {
    var source = triangle.source, target = triangle.target;
    var x0 = source[0][0], y0 = source[0][1], x1 = source[1][0], y1 = source[1][1], x2 = source[2][0], y2 = source[2][1];
    var u0 = (target[0][0] - targetTopLeft[0]) / targetResolution, v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution;
    var u1 = (target[1][0] - targetTopLeft[0]) / targetResolution, v1 = -(target[1][1] - targetTopLeft[1]) / targetResolution;
    var u2 = (target[2][0] - targetTopLeft[0]) / targetResolution, v2 = -(target[2][1] - targetTopLeft[1]) / targetResolution;
    var sourceNumericalShiftX = x0, sourceNumericalShiftY = y0;
    x0 = 0;
    y0 = 0;
    x1 -= sourceNumericalShiftX;
    y1 -= sourceNumericalShiftY;
    x2 -= sourceNumericalShiftX;
    y2 -= sourceNumericalShiftY;
    var augmentedMatrix = [[x1, y1, 0, 0, u1 - u0], [x2, y2, 0, 0, u2 - u0], [0, 0, x1, y1, v1 - v0], [0, 0, x2, y2, v2 - v0]];
    var affineCoefs = ol.math.solveLinearSystem(augmentedMatrix);
    if (!affineCoefs) {
      return;
    }
    context.save();
    context.beginPath();
    if (ol.reproj.browserAntialiasesClip_) {
      var centroidX = (u0 + u1 + u2) / 3, centroidY = (v0 + v1 + v2) / 3;
      var p0 = ol.reproj.enlargeClipPoint_(centroidX, centroidY, u0, v0);
      var p1 = ol.reproj.enlargeClipPoint_(centroidX, centroidY, u1, v1);
      var p2 = ol.reproj.enlargeClipPoint_(centroidX, centroidY, u2, v2);
      context.moveTo(p1[0], p1[1]);
      context.lineTo(p0[0], p0[1]);
      context.lineTo(p2[0], p2[1]);
    } else {
      context.moveTo(u1, v1);
      context.lineTo(u0, v0);
      context.lineTo(u2, v2);
    }
    context.clip();
    context.transform(affineCoefs[0], affineCoefs[2], affineCoefs[1], affineCoefs[3], u0, v0);
    context.translate(sourceDataExtent[0] - sourceNumericalShiftX, sourceDataExtent[3] - sourceNumericalShiftY);
    context.scale(sourceResolution / pixelRatio, -sourceResolution / pixelRatio);
    context.drawImage(stitchContext.canvas, 0, 0);
    context.restore();
  });
  if (opt_renderEdges) {
    context.save();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    triangulation.getTriangles().forEach(function(triangle, i, arr) {
      var target = triangle.target;
      var u0 = (target[0][0] - targetTopLeft[0]) / targetResolution, v0 = -(target[0][1] - targetTopLeft[1]) / targetResolution;
      var u1 = (target[1][0] - targetTopLeft[0]) / targetResolution, v1 = -(target[1][1] - targetTopLeft[1]) / targetResolution;
      var u2 = (target[2][0] - targetTopLeft[0]) / targetResolution, v2 = -(target[2][1] - targetTopLeft[1]) / targetResolution;
      context.beginPath();
      context.moveTo(u1, v1);
      context.lineTo(u0, v0);
      context.lineTo(u2, v2);
      context.closePath();
      context.stroke();
    });
    context.restore();
  }
  return context.canvas;
};
goog.provide("ol.reproj.Triangulation");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.math");
goog.require("ol.proj");
ol.reproj.Triangulation = function(sourceProj, targetProj, targetExtent, maxSourceExtent, errorThreshold) {
  this.sourceProj_ = sourceProj;
  this.targetProj_ = targetProj;
  var transformInvCache = {};
  var transformInv = ol.proj.getTransform(this.targetProj_, this.sourceProj_);
  this.transformInv_ = function(c) {
    var key = c[0] + "/" + c[1];
    if (!transformInvCache[key]) {
      transformInvCache[key] = transformInv(c);
    }
    return transformInvCache[key];
  };
  this.maxSourceExtent_ = maxSourceExtent;
  this.errorThresholdSquared_ = errorThreshold * errorThreshold;
  this.triangles_ = [];
  this.wrapsXInSource_ = false;
  this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!maxSourceExtent && !!this.sourceProj_.getExtent() && ol.extent.getWidth(maxSourceExtent) == ol.extent.getWidth(this.sourceProj_.getExtent());
  this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? ol.extent.getWidth(this.sourceProj_.getExtent()) : null;
  this.targetWorldWidth_ = this.targetProj_.getExtent() ? ol.extent.getWidth(this.targetProj_.getExtent()) : null;
  var destinationTopLeft = ol.extent.getTopLeft(targetExtent);
  var destinationTopRight = ol.extent.getTopRight(targetExtent);
  var destinationBottomRight = ol.extent.getBottomRight(targetExtent);
  var destinationBottomLeft = ol.extent.getBottomLeft(targetExtent);
  var sourceTopLeft = this.transformInv_(destinationTopLeft);
  var sourceTopRight = this.transformInv_(destinationTopRight);
  var sourceBottomRight = this.transformInv_(destinationBottomRight);
  var sourceBottomLeft = this.transformInv_(destinationBottomLeft);
  this.addQuad_(destinationTopLeft, destinationTopRight, destinationBottomRight, destinationBottomLeft, sourceTopLeft, sourceTopRight, sourceBottomRight, sourceBottomLeft, ol.RASTER_REPROJECTION_MAX_SUBDIVISION);
  if (this.wrapsXInSource_) {
    ol.DEBUG && console.assert(this.sourceWorldWidth_ !== null);
    var leftBound = Infinity;
    this.triangles_.forEach(function(triangle, i, arr) {
      leftBound = Math.min(leftBound, triangle.source[0][0], triangle.source[1][0], triangle.source[2][0]);
    });
    this.triangles_.forEach(function(triangle) {
      if (Math.max(triangle.source[0][0], triangle.source[1][0], triangle.source[2][0]) - leftBound > this.sourceWorldWidth_ / 2) {
        var newTriangle = [[triangle.source[0][0], triangle.source[0][1]], [triangle.source[1][0], triangle.source[1][1]], [triangle.source[2][0], triangle.source[2][1]]];
        if (newTriangle[0][0] - leftBound > this.sourceWorldWidth_ / 2) {
          newTriangle[0][0] -= this.sourceWorldWidth_;
        }
        if (newTriangle[1][0] - leftBound > this.sourceWorldWidth_ / 2) {
          newTriangle[1][0] -= this.sourceWorldWidth_;
        }
        if (newTriangle[2][0] - leftBound > this.sourceWorldWidth_ / 2) {
          newTriangle[2][0] -= this.sourceWorldWidth_;
        }
        var minX = Math.min(newTriangle[0][0], newTriangle[1][0], newTriangle[2][0]);
        var maxX = Math.max(newTriangle[0][0], newTriangle[1][0], newTriangle[2][0]);
        if (maxX - minX < this.sourceWorldWidth_ / 2) {
          triangle.source = newTriangle;
        }
      }
    }, this);
  }
  transformInvCache = {};
};
ol.reproj.Triangulation.prototype.addTriangle_ = function(a, b, c, aSrc, bSrc, cSrc) {
  this.triangles_.push({source:[aSrc, bSrc, cSrc], target:[a, b, c]});
};
ol.reproj.Triangulation.prototype.addQuad_ = function(a, b, c, d, aSrc, bSrc, cSrc, dSrc, maxSubdivision) {
  var sourceQuadExtent = ol.extent.boundingExtent([aSrc, bSrc, cSrc, dSrc]);
  var sourceCoverageX = this.sourceWorldWidth_ ? ol.extent.getWidth(sourceQuadExtent) / this.sourceWorldWidth_ : null;
  var sourceWorldWidth = (this.sourceWorldWidth_);
  var wrapsX = this.sourceProj_.canWrapX() && sourceCoverageX > .5 && sourceCoverageX < 1;
  var needsSubdivision = false;
  if (maxSubdivision > 0) {
    if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
      var targetQuadExtent = ol.extent.boundingExtent([a, b, c, d]);
      var targetCoverageX = ol.extent.getWidth(targetQuadExtent) / this.targetWorldWidth_;
      needsSubdivision |= targetCoverageX > ol.RASTER_REPROJECTION_MAX_TRIANGLE_WIDTH;
    }
    if (!wrapsX && this.sourceProj_.isGlobal() && sourceCoverageX) {
      needsSubdivision |= sourceCoverageX > ol.RASTER_REPROJECTION_MAX_TRIANGLE_WIDTH;
    }
  }
  if (!needsSubdivision && this.maxSourceExtent_) {
    if (!ol.extent.intersects(sourceQuadExtent, this.maxSourceExtent_)) {
      return;
    }
  }
  if (!needsSubdivision) {
    if (!isFinite(aSrc[0]) || !isFinite(aSrc[1]) || !isFinite(bSrc[0]) || !isFinite(bSrc[1]) || !isFinite(cSrc[0]) || !isFinite(cSrc[1]) || !isFinite(dSrc[0]) || !isFinite(dSrc[1])) {
      if (maxSubdivision > 0) {
        needsSubdivision = true;
      } else {
        return;
      }
    }
  }
  if (maxSubdivision > 0) {
    if (!needsSubdivision) {
      var center = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
      var centerSrc = this.transformInv_(center);
      var dx;
      if (wrapsX) {
        var centerSrcEstimX = (ol.math.modulo(aSrc[0], sourceWorldWidth) + ol.math.modulo(cSrc[0], sourceWorldWidth)) / 2;
        dx = centerSrcEstimX - ol.math.modulo(centerSrc[0], sourceWorldWidth);
      } else {
        dx = (aSrc[0] + cSrc[0]) / 2 - centerSrc[0];
      }
      var dy = (aSrc[1] + cSrc[1]) / 2 - centerSrc[1];
      var centerSrcErrorSquared = dx * dx + dy * dy;
      needsSubdivision = centerSrcErrorSquared > this.errorThresholdSquared_;
    }
    if (needsSubdivision) {
      if (Math.abs(a[0] - c[0]) <= Math.abs(a[1] - c[1])) {
        var bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
        var bcSrc = this.transformInv_(bc);
        var da = [(d[0] + a[0]) / 2, (d[1] + a[1]) / 2];
        var daSrc = this.transformInv_(da);
        this.addQuad_(a, b, bc, da, aSrc, bSrc, bcSrc, daSrc, maxSubdivision - 1);
        this.addQuad_(da, bc, c, d, daSrc, bcSrc, cSrc, dSrc, maxSubdivision - 1);
      } else {
        var ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        var abSrc = this.transformInv_(ab);
        var cd = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2];
        var cdSrc = this.transformInv_(cd);
        this.addQuad_(a, ab, cd, d, aSrc, abSrc, cdSrc, dSrc, maxSubdivision - 1);
        this.addQuad_(ab, b, c, cd, abSrc, bSrc, cSrc, cdSrc, maxSubdivision - 1);
      }
      return;
    }
  }
  if (wrapsX) {
    if (!this.canWrapXInSource_) {
      return;
    }
    this.wrapsXInSource_ = true;
  }
  this.addTriangle_(a, c, d, aSrc, cSrc, dSrc);
  this.addTriangle_(a, b, c, aSrc, bSrc, cSrc);
};
ol.reproj.Triangulation.prototype.calculateSourceExtent = function() {
  var extent = ol.extent.createEmpty();
  this.triangles_.forEach(function(triangle, i, arr) {
    var src = triangle.source;
    ol.extent.extendCoordinate(extent, src[0]);
    ol.extent.extendCoordinate(extent, src[1]);
    ol.extent.extendCoordinate(extent, src[2]);
  });
  return extent;
};
ol.reproj.Triangulation.prototype.getTriangles = function() {
  return this.triangles_;
};
goog.provide("ol.reproj.Tile");
goog.require("ol");
goog.require("ol.Tile");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.math");
goog.require("ol.reproj");
goog.require("ol.reproj.Triangulation");
ol.reproj.Tile = function(sourceProj, sourceTileGrid, targetProj, targetTileGrid, tileCoord, wrappedTileCoord, pixelRatio, gutter, getTileFunction, opt_errorThreshold, opt_renderEdges) {
  ol.Tile.call(this, tileCoord, ol.Tile.State.IDLE);
  this.renderEdges_ = opt_renderEdges !== undefined ? opt_renderEdges : false;
  this.pixelRatio_ = pixelRatio;
  this.gutter_ = gutter;
  this.canvas_ = null;
  this.sourceTileGrid_ = sourceTileGrid;
  this.targetTileGrid_ = targetTileGrid;
  this.wrappedTileCoord_ = wrappedTileCoord ? wrappedTileCoord : tileCoord;
  this.sourceTiles_ = [];
  this.sourcesListenerKeys_ = null;
  this.sourceZ_ = 0;
  var targetExtent = targetTileGrid.getTileCoordExtent(this.wrappedTileCoord_);
  var maxTargetExtent = this.targetTileGrid_.getExtent();
  var maxSourceExtent = this.sourceTileGrid_.getExtent();
  var limitedTargetExtent = maxTargetExtent ? ol.extent.getIntersection(targetExtent, maxTargetExtent) : targetExtent;
  if (ol.extent.getArea(limitedTargetExtent) === 0) {
    this.state = ol.Tile.State.EMPTY;
    return;
  }
  var sourceProjExtent = sourceProj.getExtent();
  if (sourceProjExtent) {
    if (!maxSourceExtent) {
      maxSourceExtent = sourceProjExtent;
    } else {
      maxSourceExtent = ol.extent.getIntersection(maxSourceExtent, sourceProjExtent);
    }
  }
  var targetResolution = targetTileGrid.getResolution(this.wrappedTileCoord_[0]);
  var targetCenter = ol.extent.getCenter(limitedTargetExtent);
  var sourceResolution = ol.reproj.calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution);
  if (!isFinite(sourceResolution) || sourceResolution <= 0) {
    this.state = ol.Tile.State.EMPTY;
    return;
  }
  var errorThresholdInPixels = opt_errorThreshold !== undefined ? opt_errorThreshold : ol.DEFAULT_RASTER_REPROJECTION_ERROR_THRESHOLD;
  this.triangulation_ = new ol.reproj.Triangulation(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels);
  if (this.triangulation_.getTriangles().length === 0) {
    this.state = ol.Tile.State.EMPTY;
    return;
  }
  this.sourceZ_ = sourceTileGrid.getZForResolution(sourceResolution);
  var sourceExtent = this.triangulation_.calculateSourceExtent();
  if (maxSourceExtent) {
    if (sourceProj.canWrapX()) {
      sourceExtent[1] = ol.math.clamp(sourceExtent[1], maxSourceExtent[1], maxSourceExtent[3]);
      sourceExtent[3] = ol.math.clamp(sourceExtent[3], maxSourceExtent[1], maxSourceExtent[3]);
    } else {
      sourceExtent = ol.extent.getIntersection(sourceExtent, maxSourceExtent);
    }
  }
  if (!ol.extent.getArea(sourceExtent)) {
    this.state = ol.Tile.State.EMPTY;
  } else {
    var sourceRange = sourceTileGrid.getTileRangeForExtentAndZ(sourceExtent, this.sourceZ_);
    var tilesRequired = sourceRange.getWidth() * sourceRange.getHeight();
    if (ol.DEBUG && !(tilesRequired < ol.RASTER_REPROJECTION_MAX_SOURCE_TILES)) {
      console.assert(false, "reasonable number of tiles is required");
      this.state = ol.Tile.State.ERROR;
      return;
    }
    for (var srcX = sourceRange.minX;srcX <= sourceRange.maxX;srcX++) {
      for (var srcY = sourceRange.minY;srcY <= sourceRange.maxY;srcY++) {
        var tile = getTileFunction(this.sourceZ_, srcX, srcY, pixelRatio);
        if (tile) {
          this.sourceTiles_.push(tile);
        }
      }
    }
    if (this.sourceTiles_.length === 0) {
      this.state = ol.Tile.State.EMPTY;
    }
  }
};
ol.inherits(ol.reproj.Tile, ol.Tile);
ol.reproj.Tile.prototype.disposeInternal = function() {
  if (this.state == ol.Tile.State.LOADING) {
    this.unlistenSources_();
  }
  ol.Tile.prototype.disposeInternal.call(this);
};
ol.reproj.Tile.prototype.getImage = function() {
  return this.canvas_;
};
ol.reproj.Tile.prototype.reproject_ = function() {
  var sources = [];
  this.sourceTiles_.forEach(function(tile, i, arr) {
    if (tile && tile.getState() == ol.Tile.State.LOADED) {
      sources.push({extent:this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord), image:tile.getImage()});
    }
  }, this);
  this.sourceTiles_.length = 0;
  if (sources.length === 0) {
    this.state = ol.Tile.State.ERROR;
  } else {
    var z = this.wrappedTileCoord_[0];
    var size = this.targetTileGrid_.getTileSize(z);
    var width = typeof size === "number" ? size : size[0];
    var height = typeof size === "number" ? size : size[1];
    var targetResolution = this.targetTileGrid_.getResolution(z);
    var sourceResolution = this.sourceTileGrid_.getResolution(this.sourceZ_);
    var targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
    this.canvas_ = ol.reproj.render(width, height, this.pixelRatio_, sourceResolution, this.sourceTileGrid_.getExtent(), targetResolution, targetExtent, this.triangulation_, sources, this.gutter_, this.renderEdges_);
    this.state = ol.Tile.State.LOADED;
  }
  this.changed();
};
ol.reproj.Tile.prototype.load = function() {
  if (this.state == ol.Tile.State.IDLE) {
    this.state = ol.Tile.State.LOADING;
    this.changed();
    var leftToLoad = 0;
    ol.DEBUG && console.assert(!this.sourcesListenerKeys_, "this.sourcesListenerKeys_ should be null");
    this.sourcesListenerKeys_ = [];
    this.sourceTiles_.forEach(function(tile, i, arr) {
      var state = tile.getState();
      if (state == ol.Tile.State.IDLE || state == ol.Tile.State.LOADING) {
        leftToLoad++;
        var sourceListenKey;
        sourceListenKey = ol.events.listen(tile, ol.events.EventType.CHANGE, function(e) {
          var state = tile.getState();
          if (state == ol.Tile.State.LOADED || state == ol.Tile.State.ERROR || state == ol.Tile.State.EMPTY) {
            ol.events.unlistenByKey(sourceListenKey);
            leftToLoad--;
            ol.DEBUG && console.assert(leftToLoad >= 0, "leftToLoad should not be negative");
            if (leftToLoad === 0) {
              this.unlistenSources_();
              this.reproject_();
            }
          }
        }, this);
        this.sourcesListenerKeys_.push(sourceListenKey);
      }
    }, this);
    this.sourceTiles_.forEach(function(tile, i, arr) {
      var state = tile.getState();
      if (state == ol.Tile.State.IDLE) {
        tile.load();
      }
    });
    if (leftToLoad === 0) {
      setTimeout(this.reproject_.bind(this), 0);
    }
  }
};
ol.reproj.Tile.prototype.unlistenSources_ = function() {
  this.sourcesListenerKeys_.forEach(ol.events.unlistenByKey);
  this.sourcesListenerKeys_ = null;
};
goog.provide("ol.size");
ol.size.buffer = function(size, buffer, opt_size) {
  if (opt_size === undefined) {
    opt_size = [0, 0];
  }
  opt_size[0] = size[0] + 2 * buffer;
  opt_size[1] = size[1] + 2 * buffer;
  return opt_size;
};
ol.size.hasArea = function(size) {
  return size[0] > 0 && size[1] > 0;
};
ol.size.scale = function(size, ratio, opt_size) {
  if (opt_size === undefined) {
    opt_size = [0, 0];
  }
  opt_size[0] = size[0] * ratio + .5 | 0;
  opt_size[1] = size[1] * ratio + .5 | 0;
  return opt_size;
};
ol.size.toSize = function(size, opt_size) {
  if (Array.isArray(size)) {
    return size;
  } else {
    if (opt_size === undefined) {
      opt_size = [size, size];
    } else {
      opt_size[0] = opt_size[1] = (size);
    }
    return opt_size;
  }
};
goog.provide("ol.TileRange");
ol.TileRange = function(minX, maxX, minY, maxY) {
  this.minX = minX;
  this.maxX = maxX;
  this.minY = minY;
  this.maxY = maxY;
};
ol.TileRange.createOrUpdate = function(minX, maxX, minY, maxY, tileRange) {
  if (tileRange !== undefined) {
    tileRange.minX = minX;
    tileRange.maxX = maxX;
    tileRange.minY = minY;
    tileRange.maxY = maxY;
    return tileRange;
  } else {
    return new ol.TileRange(minX, maxX, minY, maxY);
  }
};
ol.TileRange.prototype.contains = function(tileCoord) {
  return this.containsXY(tileCoord[1], tileCoord[2]);
};
ol.TileRange.prototype.containsTileRange = function(tileRange) {
  return this.minX <= tileRange.minX && tileRange.maxX <= this.maxX && this.minY <= tileRange.minY && tileRange.maxY <= this.maxY;
};
ol.TileRange.prototype.containsXY = function(x, y) {
  return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
};
ol.TileRange.prototype.equals = function(tileRange) {
  return this.minX == tileRange.minX && this.minY == tileRange.minY && this.maxX == tileRange.maxX && this.maxY == tileRange.maxY;
};
ol.TileRange.prototype.extend = function(tileRange) {
  if (tileRange.minX < this.minX) {
    this.minX = tileRange.minX;
  }
  if (tileRange.maxX > this.maxX) {
    this.maxX = tileRange.maxX;
  }
  if (tileRange.minY < this.minY) {
    this.minY = tileRange.minY;
  }
  if (tileRange.maxY > this.maxY) {
    this.maxY = tileRange.maxY;
  }
};
ol.TileRange.prototype.getHeight = function() {
  return this.maxY - this.minY + 1;
};
ol.TileRange.prototype.getSize = function() {
  return [this.getWidth(), this.getHeight()];
};
ol.TileRange.prototype.getWidth = function() {
  return this.maxX - this.minX + 1;
};
ol.TileRange.prototype.intersects = function(tileRange) {
  return this.minX <= tileRange.maxX && this.maxX >= tileRange.minX && this.minY <= tileRange.maxY && this.maxY >= tileRange.minY;
};
goog.provide("ol.tilegrid.TileGrid");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.TileRange");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.math");
goog.require("ol.size");
goog.require("ol.tilecoord");
ol.tilegrid.TileGrid = function(options) {
  this.minZoom = options.minZoom !== undefined ? options.minZoom : 0;
  this.resolutions_ = options.resolutions;
  ol.asserts.assert(ol.array.isSorted(this.resolutions_, function(a, b) {
    return b - a;
  }, true), 17);
  this.maxZoom = this.resolutions_.length - 1;
  this.origin_ = options.origin !== undefined ? options.origin : null;
  this.origins_ = null;
  if (options.origins !== undefined) {
    this.origins_ = options.origins;
    ol.asserts.assert(this.origins_.length == this.resolutions_.length, 20);
  }
  var extent = options.extent;
  if (extent !== undefined && !this.origin_ && !this.origins_) {
    this.origin_ = ol.extent.getTopLeft(extent);
  }
  ol.asserts.assert(!this.origin_ && this.origins_ || this.origin_ && !this.origins_, 18);
  this.tileSizes_ = null;
  if (options.tileSizes !== undefined) {
    this.tileSizes_ = options.tileSizes;
    ol.asserts.assert(this.tileSizes_.length == this.resolutions_.length, 19);
  }
  this.tileSize_ = options.tileSize !== undefined ? options.tileSize : !this.tileSizes_ ? ol.DEFAULT_TILE_SIZE : null;
  ol.asserts.assert(!this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_, 22);
  this.extent_ = extent !== undefined ? extent : null;
  this.fullTileRanges_ = null;
  this.tmpSize_ = [0, 0];
  if (options.sizes !== undefined) {
    ol.DEBUG && console.assert(options.sizes.length == this.resolutions_.length, "number of sizes and resolutions must be equal");
    this.fullTileRanges_ = options.sizes.map(function(size, z) {
      ol.DEBUG && console.assert(size[0] !== 0, "width must not be 0");
      ol.DEBUG && console.assert(size[1] !== 0, "height must not be 0");
      var tileRange = new ol.TileRange(Math.min(0, size[0]), Math.max(size[0] - 1, -1), Math.min(0, size[1]), Math.max(size[1] - 1, -1));
      return tileRange;
    }, this);
  } else {
    if (extent) {
      this.calculateTileRanges_(extent);
    }
  }
};
ol.tilegrid.TileGrid.tmpTileCoord_ = [0, 0, 0];
ol.tilegrid.TileGrid.prototype.forEachTileCoord = function(extent, zoom, callback) {
  var tileRange = this.getTileRangeForExtentAndZ(extent, zoom);
  for (var i = tileRange.minX, ii = tileRange.maxX;i <= ii;++i) {
    for (var j = tileRange.minY, jj = tileRange.maxY;j <= jj;++j) {
      callback([zoom, i, j]);
    }
  }
};
ol.tilegrid.TileGrid.prototype.forEachTileCoordParentTileRange = function(tileCoord, callback, opt_this, opt_tileRange, opt_extent) {
  var tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
  var z = tileCoord[0] - 1;
  while (z >= this.minZoom) {
    if (callback.call(opt_this, z, this.getTileRangeForExtentAndZ(tileCoordExtent, z, opt_tileRange))) {
      return true;
    }
    --z;
  }
  return false;
};
ol.tilegrid.TileGrid.prototype.getExtent = function() {
  return this.extent_;
};
ol.tilegrid.TileGrid.prototype.getMaxZoom = function() {
  return this.maxZoom;
};
ol.tilegrid.TileGrid.prototype.getMinZoom = function() {
  return this.minZoom;
};
ol.tilegrid.TileGrid.prototype.getOrigin = function(z) {
  if (this.origin_) {
    return this.origin_;
  } else {
    ol.DEBUG && console.assert(this.minZoom <= z && z <= this.maxZoom, "given z is not in allowed range (%s <= %s <= %s)", this.minZoom, z, this.maxZoom);
    return this.origins_[z];
  }
};
ol.tilegrid.TileGrid.prototype.getResolution = function(z) {
  ol.DEBUG && console.assert(this.minZoom <= z && z <= this.maxZoom, "given z is not in allowed range (%s <= %s <= %s)", this.minZoom, z, this.maxZoom);
  return this.resolutions_[z];
};
ol.tilegrid.TileGrid.prototype.getResolutions = function() {
  return this.resolutions_;
};
ol.tilegrid.TileGrid.prototype.getTileCoordChildTileRange = function(tileCoord, opt_tileRange, opt_extent) {
  if (tileCoord[0] < this.maxZoom) {
    var tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
    return this.getTileRangeForExtentAndZ(tileCoordExtent, tileCoord[0] + 1, opt_tileRange);
  } else {
    return null;
  }
};
ol.tilegrid.TileGrid.prototype.getTileRangeExtent = function(z, tileRange, opt_extent) {
  var origin = this.getOrigin(z);
  var resolution = this.getResolution(z);
  var tileSize = ol.size.toSize(this.getTileSize(z), this.tmpSize_);
  var minX = origin[0] + tileRange.minX * tileSize[0] * resolution;
  var maxX = origin[0] + (tileRange.maxX + 1) * tileSize[0] * resolution;
  var minY = origin[1] + tileRange.minY * tileSize[1] * resolution;
  var maxY = origin[1] + (tileRange.maxY + 1) * tileSize[1] * resolution;
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};
ol.tilegrid.TileGrid.prototype.getTileRangeForExtentAndResolution = function(extent, resolution, opt_tileRange) {
  var tileCoord = ol.tilegrid.TileGrid.tmpTileCoord_;
  this.getTileCoordForXYAndResolution_(extent[0], extent[1], resolution, false, tileCoord);
  var minX = tileCoord[1];
  var minY = tileCoord[2];
  this.getTileCoordForXYAndResolution_(extent[2], extent[3], resolution, true, tileCoord);
  return ol.TileRange.createOrUpdate(minX, tileCoord[1], minY, tileCoord[2], opt_tileRange);
};
ol.tilegrid.TileGrid.prototype.getTileRangeForExtentAndZ = function(extent, z, opt_tileRange) {
  var resolution = this.getResolution(z);
  return this.getTileRangeForExtentAndResolution(extent, resolution, opt_tileRange);
};
ol.tilegrid.TileGrid.prototype.getTileCoordCenter = function(tileCoord) {
  var origin = this.getOrigin(tileCoord[0]);
  var resolution = this.getResolution(tileCoord[0]);
  var tileSize = ol.size.toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
  return [origin[0] + (tileCoord[1] + .5) * tileSize[0] * resolution, origin[1] + (tileCoord[2] + .5) * tileSize[1] * resolution];
};
ol.tilegrid.TileGrid.prototype.getTileCoordExtent = function(tileCoord, opt_extent) {
  var origin = this.getOrigin(tileCoord[0]);
  var resolution = this.getResolution(tileCoord[0]);
  var tileSize = ol.size.toSize(this.getTileSize(tileCoord[0]), this.tmpSize_);
  var minX = origin[0] + tileCoord[1] * tileSize[0] * resolution;
  var minY = origin[1] + tileCoord[2] * tileSize[1] * resolution;
  var maxX = minX + tileSize[0] * resolution;
  var maxY = minY + tileSize[1] * resolution;
  return ol.extent.createOrUpdate(minX, minY, maxX, maxY, opt_extent);
};
ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndResolution = function(coordinate, resolution, opt_tileCoord) {
  return this.getTileCoordForXYAndResolution_(coordinate[0], coordinate[1], resolution, false, opt_tileCoord);
};
ol.tilegrid.TileGrid.prototype.getTileCoordForXYAndResolution_ = function(x, y, resolution, reverseIntersectionPolicy, opt_tileCoord) {
  var z = this.getZForResolution(resolution);
  var scale = resolution / this.getResolution(z);
  var origin = this.getOrigin(z);
  var tileSize = ol.size.toSize(this.getTileSize(z), this.tmpSize_);
  var adjustX = reverseIntersectionPolicy ? .5 : 0;
  var adjustY = reverseIntersectionPolicy ? 0 : .5;
  var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
  var yFromOrigin = Math.floor((y - origin[1]) / resolution + adjustY);
  var tileCoordX = scale * xFromOrigin / tileSize[0];
  var tileCoordY = scale * yFromOrigin / tileSize[1];
  if (reverseIntersectionPolicy) {
    tileCoordX = Math.ceil(tileCoordX) - 1;
    tileCoordY = Math.ceil(tileCoordY) - 1;
  } else {
    tileCoordX = Math.floor(tileCoordX);
    tileCoordY = Math.floor(tileCoordY);
  }
  return ol.tilecoord.createOrUpdate(z, tileCoordX, tileCoordY, opt_tileCoord);
};
ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndZ = function(coordinate, z, opt_tileCoord) {
  var resolution = this.getResolution(z);
  return this.getTileCoordForXYAndResolution_(coordinate[0], coordinate[1], resolution, false, opt_tileCoord);
};
ol.tilegrid.TileGrid.prototype.getTileCoordResolution = function(tileCoord) {
  ol.DEBUG && console.assert(this.minZoom <= tileCoord[0] && tileCoord[0] <= this.maxZoom, "z of given tilecoord is not in allowed range (%s <= %s <= %s", this.minZoom, tileCoord[0], this.maxZoom);
  return this.resolutions_[tileCoord[0]];
};
ol.tilegrid.TileGrid.prototype.getTileSize = function(z) {
  if (this.tileSize_) {
    return this.tileSize_;
  } else {
    ol.DEBUG && console.assert(this.minZoom <= z && z <= this.maxZoom, "z is not in allowed range (%s <= %s <= %s", this.minZoom, z, this.maxZoom);
    return this.tileSizes_[z];
  }
};
ol.tilegrid.TileGrid.prototype.getFullTileRange = function(z) {
  if (!this.fullTileRanges_) {
    return null;
  } else {
    ol.DEBUG && console.assert(this.minZoom <= z && z <= this.maxZoom, "z is not in allowed range (%s <= %s <= %s", this.minZoom, z, this.maxZoom);
    return this.fullTileRanges_[z];
  }
};
ol.tilegrid.TileGrid.prototype.getZForResolution = function(resolution, opt_direction) {
  var z = ol.array.linearFindNearest(this.resolutions_, resolution, opt_direction || 0);
  return ol.math.clamp(z, this.minZoom, this.maxZoom);
};
ol.tilegrid.TileGrid.prototype.calculateTileRanges_ = function(extent) {
  var length = this.resolutions_.length;
  var fullTileRanges = new Array(length);
  for (var z = this.minZoom;z < length;++z) {
    fullTileRanges[z] = this.getTileRangeForExtentAndZ(extent, z);
  }
  this.fullTileRanges_ = fullTileRanges;
};
goog.provide("ol.tilegrid");
goog.require("ol");
goog.require("ol.size");
goog.require("ol.extent");
goog.require("ol.extent.Corner");
goog.require("ol.obj");
goog.require("ol.proj");
goog.require("ol.proj.METERS_PER_UNIT");
goog.require("ol.proj.Units");
goog.require("ol.tilegrid.TileGrid");
ol.tilegrid.getForProjection = function(projection) {
  var tileGrid = projection.getDefaultTileGrid();
  if (!tileGrid) {
    tileGrid = ol.tilegrid.createForProjection(projection);
    projection.setDefaultTileGrid(tileGrid);
  }
  return tileGrid;
};
ol.tilegrid.wrapX = function(tileGrid, tileCoord, projection) {
  var z = tileCoord[0];
  var center = tileGrid.getTileCoordCenter(tileCoord);
  var projectionExtent = ol.tilegrid.extentFromProjection(projection);
  if (!ol.extent.containsCoordinate(projectionExtent, center)) {
    var worldWidth = ol.extent.getWidth(projectionExtent);
    var worldsAway = Math.ceil((projectionExtent[0] - center[0]) / worldWidth);
    center[0] += worldWidth * worldsAway;
    return tileGrid.getTileCoordForCoordAndZ(center, z);
  } else {
    return tileCoord;
  }
};
ol.tilegrid.createForExtent = function(extent, opt_maxZoom, opt_tileSize, opt_corner) {
  var corner = opt_corner !== undefined ? opt_corner : ol.extent.Corner.TOP_LEFT;
  var resolutions = ol.tilegrid.resolutionsFromExtent(extent, opt_maxZoom, opt_tileSize);
  return new ol.tilegrid.TileGrid({extent:extent, origin:ol.extent.getCorner(extent, corner), resolutions:resolutions, tileSize:opt_tileSize});
};
ol.tilegrid.createXYZ = function(opt_options) {
  var options = ({});
  ol.obj.assign(options, opt_options !== undefined ? opt_options : ({}));
  if (options.extent === undefined) {
    options.extent = ol.proj.get("EPSG:3857").getExtent();
  }
  options.resolutions = ol.tilegrid.resolutionsFromExtent(options.extent, options.maxZoom, options.tileSize);
  delete options.maxZoom;
  return new ol.tilegrid.TileGrid(options);
};
ol.tilegrid.resolutionsFromExtent = function(extent, opt_maxZoom, opt_tileSize) {
  var maxZoom = opt_maxZoom !== undefined ? opt_maxZoom : ol.DEFAULT_MAX_ZOOM;
  var height = ol.extent.getHeight(extent);
  var width = ol.extent.getWidth(extent);
  var tileSize = ol.size.toSize(opt_tileSize !== undefined ? opt_tileSize : ol.DEFAULT_TILE_SIZE);
  var maxResolution = Math.max(width / tileSize[0], height / tileSize[1]);
  var length = maxZoom + 1;
  var resolutions = new Array(length);
  for (var z = 0;z < length;++z) {
    resolutions[z] = maxResolution / Math.pow(2, z);
  }
  return resolutions;
};
ol.tilegrid.createForProjection = function(projection, opt_maxZoom, opt_tileSize, opt_corner) {
  var extent = ol.tilegrid.extentFromProjection(projection);
  return ol.tilegrid.createForExtent(extent, opt_maxZoom, opt_tileSize, opt_corner);
};
ol.tilegrid.extentFromProjection = function(projection) {
  projection = ol.proj.get(projection);
  var extent = projection.getExtent();
  if (!extent) {
    var half = 180 * ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] / projection.getMetersPerUnit();
    extent = ol.extent.createOrUpdate(-half, -half, half, half);
  }
  return extent;
};
goog.provide("ol.Attribution");
goog.require("ol.TileRange");
goog.require("ol.math");
goog.require("ol.tilegrid");
ol.Attribution = function(options) {
  this.html_ = options.html;
  this.tileRanges_ = options.tileRanges ? options.tileRanges : null;
};
ol.Attribution.prototype.getHTML = function() {
  return this.html_;
};
ol.Attribution.prototype.intersectsAnyTileRange = function(tileRanges, tileGrid, projection) {
  if (!this.tileRanges_) {
    return true;
  }
  var i, ii, tileRange, zKey;
  for (zKey in tileRanges) {
    if (!(zKey in this.tileRanges_)) {
      continue;
    }
    tileRange = tileRanges[zKey];
    var testTileRange;
    for (i = 0, ii = this.tileRanges_[zKey].length;i < ii;++i) {
      testTileRange = this.tileRanges_[zKey][i];
      if (testTileRange.intersects(tileRange)) {
        return true;
      }
      var extentTileRange = tileGrid.getTileRangeForExtentAndZ(ol.tilegrid.extentFromProjection(projection), parseInt(zKey, 10));
      var width = extentTileRange.getWidth();
      if (tileRange.minX < extentTileRange.minX || tileRange.maxX > extentTileRange.maxX) {
        if (testTileRange.intersects(new ol.TileRange(ol.math.modulo(tileRange.minX, width), ol.math.modulo(tileRange.maxX, width), tileRange.minY, tileRange.maxY))) {
          return true;
        }
        if (tileRange.getWidth() > width && testTileRange.intersects(extentTileRange)) {
          return true;
        }
      }
    }
  }
  return false;
};
goog.provide("ol.source.State");
ol.source.State = {UNDEFINED:"undefined", LOADING:"loading", READY:"ready", ERROR:"error"};
goog.provide("ol.source.Source");
goog.require("ol");
goog.require("ol.Attribution");
goog.require("ol.Object");
goog.require("ol.proj");
goog.require("ol.source.State");
ol.source.Source = function(options) {
  ol.Object.call(this);
  this.projection_ = ol.proj.get(options.projection);
  this.attributions_ = ol.source.Source.toAttributionsArray_(options.attributions);
  this.logo_ = options.logo;
  this.state_ = options.state !== undefined ? options.state : ol.source.State.READY;
  this.wrapX_ = options.wrapX !== undefined ? options.wrapX : false;
};
ol.inherits(ol.source.Source, ol.Object);
ol.source.Source.toAttributionsArray_ = function(attributionLike) {
  if (typeof attributionLike === "string") {
    return [new ol.Attribution({html:attributionLike})];
  } else {
    if (attributionLike instanceof ol.Attribution) {
      return [attributionLike];
    } else {
      if (Array.isArray(attributionLike)) {
        var len = attributionLike.length;
        var attributions = new Array(len);
        for (var i = 0;i < len;i++) {
          var item = attributionLike[i];
          if (typeof item === "string") {
            attributions[i] = new ol.Attribution({html:item});
          } else {
            attributions[i] = item;
          }
        }
        return attributions;
      } else {
        return null;
      }
    }
  }
};
ol.source.Source.prototype.forEachFeatureAtCoordinate = ol.nullFunction;
ol.source.Source.prototype.getAttributions = function() {
  return this.attributions_;
};
ol.source.Source.prototype.getLogo = function() {
  return this.logo_;
};
ol.source.Source.prototype.getProjection = function() {
  return this.projection_;
};
ol.source.Source.prototype.getResolutions = function() {
};
ol.source.Source.prototype.getState = function() {
  return this.state_;
};
ol.source.Source.prototype.getWrapX = function() {
  return this.wrapX_;
};
ol.source.Source.prototype.refresh = function() {
  this.changed();
};
ol.source.Source.prototype.setAttributions = function(attributions) {
  this.attributions_ = ol.source.Source.toAttributionsArray_(attributions);
  this.changed();
};
ol.source.Source.prototype.setLogo = function(logo) {
  this.logo_ = logo;
};
ol.source.Source.prototype.setState = function(state) {
  this.state_ = state;
  this.changed();
};
goog.provide("ol.source.Tile");
goog.require("ol");
goog.require("ol.Tile");
goog.require("ol.TileCache");
goog.require("ol.events.Event");
goog.require("ol.proj");
goog.require("ol.size");
goog.require("ol.source.Source");
goog.require("ol.tilecoord");
goog.require("ol.tilegrid");
ol.source.Tile = function(options) {
  ol.source.Source.call(this, {attributions:options.attributions, extent:options.extent, logo:options.logo, projection:options.projection, state:options.state, wrapX:options.wrapX});
  this.opaque_ = options.opaque !== undefined ? options.opaque : false;
  this.tilePixelRatio_ = options.tilePixelRatio !== undefined ? options.tilePixelRatio : 1;
  this.tileGrid = options.tileGrid !== undefined ? options.tileGrid : null;
  this.tileCache = new ol.TileCache(options.cacheSize);
  this.tmpSize = [0, 0];
  this.key_ = "";
};
ol.inherits(ol.source.Tile, ol.source.Source);
ol.source.Tile.prototype.canExpireCache = function() {
  return this.tileCache.canExpireCache();
};
ol.source.Tile.prototype.expireCache = function(projection, usedTiles) {
  var tileCache = this.getTileCacheForProjection(projection);
  if (tileCache) {
    tileCache.expireCache(usedTiles);
  }
};
ol.source.Tile.prototype.forEachLoadedTile = function(projection, z, tileRange, callback) {
  var tileCache = this.getTileCacheForProjection(projection);
  if (!tileCache) {
    return false;
  }
  var covered = true;
  var tile, tileCoordKey, loaded;
  for (var x = tileRange.minX;x <= tileRange.maxX;++x) {
    for (var y = tileRange.minY;y <= tileRange.maxY;++y) {
      tileCoordKey = this.getKeyZXY(z, x, y);
      loaded = false;
      if (tileCache.containsKey(tileCoordKey)) {
        tile = (tileCache.get(tileCoordKey));
        loaded = tile.getState() === ol.Tile.State.LOADED;
        if (loaded) {
          loaded = callback(tile) !== false;
        }
      }
      if (!loaded) {
        covered = false;
      }
    }
  }
  return covered;
};
ol.source.Tile.prototype.getGutter = function(projection) {
  return 0;
};
ol.source.Tile.prototype.getKey = function() {
  return this.key_;
};
ol.source.Tile.prototype.setKey = function(key) {
  if (this.key_ !== key) {
    this.key_ = key;
    this.changed();
  }
};
ol.source.Tile.prototype.getKeyZXY = ol.tilecoord.getKeyZXY;
ol.source.Tile.prototype.getOpaque = function(projection) {
  return this.opaque_;
};
ol.source.Tile.prototype.getResolutions = function() {
  return this.tileGrid.getResolutions();
};
ol.source.Tile.prototype.getTile = function(z, x, y, pixelRatio, projection) {
};
ol.source.Tile.prototype.getTileGrid = function() {
  return this.tileGrid;
};
ol.source.Tile.prototype.getTileGridForProjection = function(projection) {
  if (!this.tileGrid) {
    return ol.tilegrid.getForProjection(projection);
  } else {
    return this.tileGrid;
  }
};
ol.source.Tile.prototype.getTileCacheForProjection = function(projection) {
  var thisProj = this.getProjection();
  if (thisProj && !ol.proj.equivalent(thisProj, projection)) {
    return null;
  } else {
    return this.tileCache;
  }
};
ol.source.Tile.prototype.getTilePixelRatio = function(opt_pixelRatio) {
  return this.tilePixelRatio_;
};
ol.source.Tile.prototype.getTilePixelSize = function(z, pixelRatio, projection) {
  var tileGrid = this.getTileGridForProjection(projection);
  var tilePixelRatio = this.getTilePixelRatio(pixelRatio);
  var tileSize = ol.size.toSize(tileGrid.getTileSize(z), this.tmpSize);
  if (tilePixelRatio == 1) {
    return tileSize;
  } else {
    return ol.size.scale(tileSize, tilePixelRatio, this.tmpSize);
  }
};
ol.source.Tile.prototype.getTileCoordForTileUrlFunction = function(tileCoord, opt_projection) {
  var projection = opt_projection !== undefined ? opt_projection : this.getProjection();
  var tileGrid = this.getTileGridForProjection(projection);
  if (this.getWrapX() && projection.isGlobal()) {
    tileCoord = ol.tilegrid.wrapX(tileGrid, tileCoord, projection);
  }
  return ol.tilecoord.withinExtentAndZ(tileCoord, tileGrid) ? tileCoord : null;
};
ol.source.Tile.prototype.refresh = function() {
  this.tileCache.clear();
  this.changed();
};
ol.source.Tile.prototype.useTile = ol.nullFunction;
ol.source.Tile.Event = function(type, tile) {
  ol.events.Event.call(this, type);
  this.tile = tile;
};
ol.inherits(ol.source.Tile.Event, ol.events.Event);
ol.source.Tile.EventType = {TILELOADSTART:"tileloadstart", TILELOADEND:"tileloadend", TILELOADERROR:"tileloaderror"};
goog.provide("ol.source.UrlTile");
goog.require("ol");
goog.require("ol.Tile");
goog.require("ol.TileUrlFunction");
goog.require("ol.source.Tile");
ol.source.UrlTile = function(options) {
  ol.source.Tile.call(this, {attributions:options.attributions, cacheSize:options.cacheSize, extent:options.extent, logo:options.logo, opaque:options.opaque, projection:options.projection, state:options.state, tileGrid:options.tileGrid, tilePixelRatio:options.tilePixelRatio, wrapX:options.wrapX});
  this.tileLoadFunction = options.tileLoadFunction;
  this.tileUrlFunction = this.fixedTileUrlFunction ? this.fixedTileUrlFunction.bind(this) : ol.TileUrlFunction.nullTileUrlFunction;
  this.urls = null;
  if (options.urls) {
    this.setUrls(options.urls);
  } else {
    if (options.url) {
      this.setUrl(options.url);
    }
  }
  if (options.tileUrlFunction) {
    this.setTileUrlFunction(options.tileUrlFunction);
  }
};
ol.inherits(ol.source.UrlTile, ol.source.Tile);
ol.source.UrlTile.prototype.fixedTileUrlFunction;
ol.source.UrlTile.prototype.getTileLoadFunction = function() {
  return this.tileLoadFunction;
};
ol.source.UrlTile.prototype.getTileUrlFunction = function() {
  return this.tileUrlFunction;
};
ol.source.UrlTile.prototype.getUrls = function() {
  return this.urls;
};
ol.source.UrlTile.prototype.handleTileChange = function(event) {
  var tile = (event.target);
  switch(tile.getState()) {
    case ol.Tile.State.LOADING:
      this.dispatchEvent(new ol.source.Tile.Event(ol.source.Tile.EventType.TILELOADSTART, tile));
      break;
    case ol.Tile.State.LOADED:
      this.dispatchEvent(new ol.source.Tile.Event(ol.source.Tile.EventType.TILELOADEND, tile));
      break;
    case ol.Tile.State.ERROR:
      this.dispatchEvent(new ol.source.Tile.Event(ol.source.Tile.EventType.TILELOADERROR, tile));
      break;
    default:
    ;
  }
};
ol.source.UrlTile.prototype.setTileLoadFunction = function(tileLoadFunction) {
  this.tileCache.clear();
  this.tileLoadFunction = tileLoadFunction;
  this.changed();
};
ol.source.UrlTile.prototype.setTileUrlFunction = function(tileUrlFunction, opt_key) {
  this.tileUrlFunction = tileUrlFunction;
  if (typeof opt_key !== "undefined") {
    this.setKey(opt_key);
  } else {
    this.changed();
  }
};
ol.source.UrlTile.prototype.setUrl = function(url) {
  var urls = this.urls = ol.TileUrlFunction.expandUrl(url);
  this.setTileUrlFunction(this.fixedTileUrlFunction ? this.fixedTileUrlFunction.bind(this) : ol.TileUrlFunction.createFromTemplates(urls, this.tileGrid), url);
};
ol.source.UrlTile.prototype.setUrls = function(urls) {
  this.urls = urls;
  var key = urls.join("\n");
  this.setTileUrlFunction(this.fixedTileUrlFunction ? this.fixedTileUrlFunction.bind(this) : ol.TileUrlFunction.createFromTemplates(urls, this.tileGrid), key);
};
ol.source.UrlTile.prototype.useTile = function(z, x, y) {
  var tileCoordKey = this.getKeyZXY(z, x, y);
  if (this.tileCache.containsKey(tileCoordKey)) {
    this.tileCache.get(tileCoordKey);
  }
};
goog.provide("ol.source.TileImage");
goog.require("ol");
goog.require("ol.ImageTile");
goog.require("ol.Tile");
goog.require("ol.TileCache");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.proj");
goog.require("ol.reproj.Tile");
goog.require("ol.source.UrlTile");
goog.require("ol.tilegrid");
ol.source.TileImage = function(options) {
  ol.source.UrlTile.call(this, {attributions:options.attributions, cacheSize:options.cacheSize, extent:options.extent, logo:options.logo, opaque:options.opaque, projection:options.projection, state:options.state, tileGrid:options.tileGrid, tileLoadFunction:options.tileLoadFunction ? options.tileLoadFunction : ol.source.TileImage.defaultTileLoadFunction, tilePixelRatio:options.tilePixelRatio, tileUrlFunction:options.tileUrlFunction, url:options.url, urls:options.urls, wrapX:options.wrapX});
  this.crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : null;
  this.tileClass = options.tileClass !== undefined ? options.tileClass : ol.ImageTile;
  this.tileCacheForProjection = {};
  this.tileGridForProjection = {};
  this.reprojectionErrorThreshold_ = options.reprojectionErrorThreshold;
  this.renderReprojectionEdges_ = false;
};
ol.inherits(ol.source.TileImage, ol.source.UrlTile);
ol.source.TileImage.prototype.canExpireCache = function() {
  if (!ol.ENABLE_RASTER_REPROJECTION) {
    return ol.source.UrlTile.prototype.canExpireCache.call(this);
  }
  if (this.tileCache.canExpireCache()) {
    return true;
  } else {
    for (var key in this.tileCacheForProjection) {
      if (this.tileCacheForProjection[key].canExpireCache()) {
        return true;
      }
    }
  }
  return false;
};
ol.source.TileImage.prototype.expireCache = function(projection, usedTiles) {
  if (!ol.ENABLE_RASTER_REPROJECTION) {
    ol.source.UrlTile.prototype.expireCache.call(this, projection, usedTiles);
    return;
  }
  var usedTileCache = this.getTileCacheForProjection(projection);
  this.tileCache.expireCache(this.tileCache == usedTileCache ? usedTiles : {});
  for (var id in this.tileCacheForProjection) {
    var tileCache = this.tileCacheForProjection[id];
    tileCache.expireCache(tileCache == usedTileCache ? usedTiles : {});
  }
};
ol.source.TileImage.prototype.getGutter = function(projection) {
  if (ol.ENABLE_RASTER_REPROJECTION && this.getProjection() && projection && !ol.proj.equivalent(this.getProjection(), projection)) {
    return 0;
  } else {
    return this.getGutterInternal();
  }
};
ol.source.TileImage.prototype.getGutterInternal = function() {
  return 0;
};
ol.source.TileImage.prototype.getOpaque = function(projection) {
  if (ol.ENABLE_RASTER_REPROJECTION && this.getProjection() && projection && !ol.proj.equivalent(this.getProjection(), projection)) {
    return false;
  } else {
    return ol.source.UrlTile.prototype.getOpaque.call(this, projection);
  }
};
ol.source.TileImage.prototype.getTileGridForProjection = function(projection) {
  if (!ol.ENABLE_RASTER_REPROJECTION) {
    return ol.source.UrlTile.prototype.getTileGridForProjection.call(this, projection);
  }
  var thisProj = this.getProjection();
  if (this.tileGrid && (!thisProj || ol.proj.equivalent(thisProj, projection))) {
    return this.tileGrid;
  } else {
    var projKey = ol.getUid(projection).toString();
    if (!(projKey in this.tileGridForProjection)) {
      this.tileGridForProjection[projKey] = ol.tilegrid.getForProjection(projection);
    }
    return (this.tileGridForProjection[projKey]);
  }
};
ol.source.TileImage.prototype.getTileCacheForProjection = function(projection) {
  if (!ol.ENABLE_RASTER_REPROJECTION) {
    return ol.source.UrlTile.prototype.getTileCacheForProjection.call(this, projection);
  }
  var thisProj = this.getProjection();
  if (!thisProj || ol.proj.equivalent(thisProj, projection)) {
    return this.tileCache;
  } else {
    var projKey = ol.getUid(projection).toString();
    if (!(projKey in this.tileCacheForProjection)) {
      this.tileCacheForProjection[projKey] = new ol.TileCache;
    }
    return this.tileCacheForProjection[projKey];
  }
};
ol.source.TileImage.prototype.createTile_ = function(z, x, y, pixelRatio, projection, key) {
  var tileCoord = [z, x, y];
  var urlTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
  var tileUrl = urlTileCoord ? this.tileUrlFunction(urlTileCoord, pixelRatio, projection) : undefined;
  var tile = new this.tileClass(tileCoord, tileUrl !== undefined ? ol.Tile.State.IDLE : ol.Tile.State.EMPTY, tileUrl !== undefined ? tileUrl : "", this.crossOrigin, this.tileLoadFunction);
  tile.key = key;
  ol.events.listen(tile, ol.events.EventType.CHANGE, this.handleTileChange, this);
  return tile;
};
ol.source.TileImage.prototype.getTile = function(z, x, y, pixelRatio, projection) {
  if (!ol.ENABLE_RASTER_REPROJECTION || !this.getProjection() || !projection || ol.proj.equivalent(this.getProjection(), projection)) {
    return this.getTileInternal(z, x, y, pixelRatio, (projection));
  } else {
    var cache = this.getTileCacheForProjection(projection);
    var tileCoord = [z, x, y];
    var tile;
    var tileCoordKey = this.getKeyZXY.apply(this, tileCoord);
    if (cache.containsKey(tileCoordKey)) {
      tile = (cache.get(tileCoordKey));
    }
    var key = this.getKey();
    if (tile && tile.key == key) {
      return tile;
    } else {
      var sourceProjection = (this.getProjection());
      var sourceTileGrid = this.getTileGridForProjection(sourceProjection);
      var targetTileGrid = this.getTileGridForProjection(projection);
      var wrappedTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
      var newTile = new ol.reproj.Tile(sourceProjection, sourceTileGrid, projection, targetTileGrid, tileCoord, wrappedTileCoord, this.getTilePixelRatio(pixelRatio), this.getGutterInternal(), function(z, x, y, pixelRatio) {
        return this.getTileInternal(z, x, y, pixelRatio, sourceProjection);
      }.bind(this), this.reprojectionErrorThreshold_, this.renderReprojectionEdges_);
      newTile.key = key;
      if (tile) {
        newTile.interimTile = tile;
        cache.replace(tileCoordKey, newTile);
      } else {
        cache.set(tileCoordKey, newTile);
      }
      return newTile;
    }
  }
};
ol.source.TileImage.prototype.getTileInternal = function(z, x, y, pixelRatio, projection) {
  var tile = null;
  var tileCoordKey = this.getKeyZXY(z, x, y);
  var key = this.getKey();
  if (!this.tileCache.containsKey(tileCoordKey)) {
    tile = this.createTile_(z, x, y, pixelRatio, projection, key);
    this.tileCache.set(tileCoordKey, tile);
  } else {
    tile = this.tileCache.get(tileCoordKey);
    if (tile.key != key) {
      var interimTile = tile;
      tile = this.createTile_(z, x, y, pixelRatio, projection, key);
      if (interimTile.getState() == ol.Tile.State.IDLE) {
        tile.interimTile = interimTile.interimTile;
      } else {
        tile.interimTile = interimTile;
      }
      tile.refreshInterimChain();
      this.tileCache.replace(tileCoordKey, tile);
    }
  }
  return tile;
};
ol.source.TileImage.prototype.setRenderReprojectionEdges = function(render) {
  if (!ol.ENABLE_RASTER_REPROJECTION || this.renderReprojectionEdges_ == render) {
    return;
  }
  this.renderReprojectionEdges_ = render;
  for (var id in this.tileCacheForProjection) {
    this.tileCacheForProjection[id].clear();
  }
  this.changed();
};
ol.source.TileImage.prototype.setTileGridForProjection = function(projection, tilegrid) {
  if (ol.ENABLE_RASTER_REPROJECTION) {
    var proj = ol.proj.get(projection);
    if (proj) {
      var projKey = ol.getUid(proj).toString();
      if (!(projKey in this.tileGridForProjection)) {
        this.tileGridForProjection[projKey] = tilegrid;
      }
    }
  }
};
ol.source.TileImage.defaultTileLoadFunction = function(imageTile, src) {
  imageTile.getImage().src = src;
};
goog.provide("ol.tilegrid.WMTS");
goog.require("ol");
goog.require("ol.proj");
goog.require("ol.tilegrid.TileGrid");
ol.tilegrid.WMTS = function(options) {
  ol.DEBUG && console.assert(options.resolutions.length == options.matrixIds.length, "options resolutions and matrixIds must have equal length (%s == %s)", options.resolutions.length, options.matrixIds.length);
  this.matrixIds_ = options.matrixIds;
  ol.tilegrid.TileGrid.call(this, {extent:options.extent, origin:options.origin, origins:options.origins, resolutions:options.resolutions, tileSize:options.tileSize, tileSizes:options.tileSizes, sizes:options.sizes});
};
ol.inherits(ol.tilegrid.WMTS, ol.tilegrid.TileGrid);
ol.tilegrid.WMTS.prototype.getMatrixId = function(z) {
  ol.DEBUG && console.assert(0 <= z && z < this.matrixIds_.length, "attempted to retrieve matrixId for illegal z (%s)", z);
  return this.matrixIds_[z];
};
ol.tilegrid.WMTS.prototype.getMatrixIds = function() {
  return this.matrixIds_;
};
ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet = function(matrixSet, opt_extent) {
  var resolutions = [];
  var matrixIds = [];
  var origins = [];
  var tileSizes = [];
  var sizes = [];
  var supportedCRSPropName = "SupportedCRS";
  var matrixIdsPropName = "TileMatrix";
  var identifierPropName = "Identifier";
  var scaleDenominatorPropName = "ScaleDenominator";
  var topLeftCornerPropName = "TopLeftCorner";
  var tileWidthPropName = "TileWidth";
  var tileHeightPropName = "TileHeight";
  var projection;
  projection = ol.proj.get(matrixSet[supportedCRSPropName].replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, "$1:$3"));
  var metersPerUnit = projection.getMetersPerUnit();
  var switchOriginXY = projection.getAxisOrientation().substr(0, 2) == "ne";
  matrixSet[matrixIdsPropName].sort(function(a, b) {
    return b[scaleDenominatorPropName] - a[scaleDenominatorPropName];
  });
  matrixSet[matrixIdsPropName].forEach(function(elt, index, array) {
    matrixIds.push(elt[identifierPropName]);
    var resolution = elt[scaleDenominatorPropName] * 2.8E-4 / metersPerUnit;
    var tileWidth = elt[tileWidthPropName];
    var tileHeight = elt[tileHeightPropName];
    if (switchOriginXY) {
      origins.push([elt[topLeftCornerPropName][1], elt[topLeftCornerPropName][0]]);
    } else {
      origins.push(elt[topLeftCornerPropName]);
    }
    resolutions.push(resolution);
    tileSizes.push(tileWidth == tileHeight ? tileWidth : [tileWidth, tileHeight]);
    sizes.push([elt["MatrixWidth"], -elt["MatrixHeight"]]);
  });
  return new ol.tilegrid.WMTS({extent:opt_extent, origins:origins, resolutions:resolutions, matrixIds:matrixIds, tileSizes:tileSizes, sizes:sizes});
};
goog.provide("ol.uri");
ol.uri.appendParams = function(uri, params) {
  var keyParams = [];
  Object.keys(params).forEach(function(k) {
    if (params[k] !== null && params[k] !== undefined) {
      keyParams.push(k + "=" + encodeURIComponent(params[k]));
    }
  });
  var qs = keyParams.join("&");
  uri = uri.replace(/[?&]$/, "");
  uri = uri.indexOf("?") === -1 ? uri + "?" : uri + "&";
  return uri + qs;
};
goog.provide("ol.source.WMTS");
goog.require("ol");
goog.require("ol.TileUrlFunction");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.obj");
goog.require("ol.proj");
goog.require("ol.source.TileImage");
goog.require("ol.tilegrid.WMTS");
goog.require("ol.uri");
ol.source.WMTS = function(options) {
  this.version_ = options.version !== undefined ? options.version : "1.0.0";
  this.format_ = options.format !== undefined ? options.format : "image/jpeg";
  this.dimensions_ = options.dimensions !== undefined ? options.dimensions : {};
  this.layer_ = options.layer;
  this.matrixSet_ = options.matrixSet;
  this.style_ = options.style;
  var urls = options.urls;
  if (urls === undefined && options.url !== undefined) {
    urls = ol.TileUrlFunction.expandUrl(options.url);
  }
  this.requestEncoding_ = options.requestEncoding !== undefined ? (options.requestEncoding) : ol.source.WMTS.RequestEncoding.KVP;
  var requestEncoding = this.requestEncoding_;
  var tileGrid = options.tileGrid;
  var context = {"layer":this.layer_, "style":this.style_, "tilematrixset":this.matrixSet_};
  if (requestEncoding == ol.source.WMTS.RequestEncoding.KVP) {
    ol.obj.assign(context, {"Service":"WMTS", "Request":"GetTile", "Version":this.version_, "Format":this.format_});
  }
  var dimensions = this.dimensions_;
  function createFromWMTSTemplate(template) {
    template = requestEncoding == ol.source.WMTS.RequestEncoding.KVP ? ol.uri.appendParams(template, context) : template.replace(/\{(\w+?)\}/g, function(m, p) {
      return p.toLowerCase() in context ? context[p.toLowerCase()] : m;
    });
    return function(tileCoord, pixelRatio, projection) {
      if (!tileCoord) {
        return undefined;
      } else {
        var localContext = {"TileMatrix":tileGrid.getMatrixId(tileCoord[0]), "TileCol":tileCoord[1], "TileRow":-tileCoord[2] - 1};
        ol.obj.assign(localContext, dimensions);
        var url = template;
        if (requestEncoding == ol.source.WMTS.RequestEncoding.KVP) {
          url = ol.uri.appendParams(url, localContext);
        } else {
          url = url.replace(/\{(\w+?)\}/g, function(m, p) {
            return localContext[p];
          });
        }
        return url;
      }
    };
  }
  var tileUrlFunction = urls && urls.length > 0 ? ol.TileUrlFunction.createFromTileUrlFunctions(urls.map(createFromWMTSTemplate)) : ol.TileUrlFunction.nullTileUrlFunction;
  ol.source.TileImage.call(this, {attributions:options.attributions, cacheSize:options.cacheSize, crossOrigin:options.crossOrigin, logo:options.logo, projection:options.projection, reprojectionErrorThreshold:options.reprojectionErrorThreshold, tileClass:options.tileClass, tileGrid:tileGrid, tileLoadFunction:options.tileLoadFunction, tilePixelRatio:options.tilePixelRatio, tileUrlFunction:tileUrlFunction, urls:urls, wrapX:options.wrapX !== undefined ? options.wrapX : false});
  this.setKey(this.getKeyForDimensions_());
};
ol.inherits(ol.source.WMTS, ol.source.TileImage);
ol.source.WMTS.prototype.getDimensions = function() {
  return this.dimensions_;
};
ol.source.WMTS.prototype.getFormat = function() {
  return this.format_;
};
ol.source.WMTS.prototype.getLayer = function() {
  return this.layer_;
};
ol.source.WMTS.prototype.getMatrixSet = function() {
  return this.matrixSet_;
};
ol.source.WMTS.prototype.getRequestEncoding = function() {
  return this.requestEncoding_;
};
ol.source.WMTS.prototype.getStyle = function() {
  return this.style_;
};
ol.source.WMTS.prototype.getVersion = function() {
  return this.version_;
};
ol.source.WMTS.prototype.getKeyForDimensions_ = function() {
  var i = 0;
  var res = [];
  for (var key in this.dimensions_) {
    res[i++] = key + "-" + this.dimensions_[key];
  }
  return res.join("/");
};
ol.source.WMTS.prototype.updateDimensions = function(dimensions) {
  ol.obj.assign(this.dimensions_, dimensions);
  this.setKey(this.getKeyForDimensions_());
};
ol.source.WMTS.optionsFromCapabilities = function(wmtsCap, config) {
  ol.DEBUG && console.assert(config["layer"], 'config "layer" must not be null');
  var layers = wmtsCap["Contents"]["Layer"];
  var l = ol.array.find(layers, function(elt, index, array) {
    return elt["Identifier"] == config["layer"];
  });
  ol.DEBUG && console.assert(l, "found a matching layer in Contents/Layer");
  ol.DEBUG && console.assert(l["TileMatrixSetLink"].length > 0, "layer has TileMatrixSetLink");
  var tileMatrixSets = wmtsCap["Contents"]["TileMatrixSet"];
  var idx, matrixSet;
  if (l["TileMatrixSetLink"].length > 1) {
    if ("projection" in config) {
      idx = ol.array.findIndex(l["TileMatrixSetLink"], function(elt, index, array) {
        var tileMatrixSet = ol.array.find(tileMatrixSets, function(el) {
          return el["Identifier"] == elt["TileMatrixSet"];
        });
        return tileMatrixSet["SupportedCRS"].replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, "$1:$3") == config["projection"];
      });
    } else {
      idx = ol.array.findIndex(l["TileMatrixSetLink"], function(elt, index, array) {
        return elt["TileMatrixSet"] == config["matrixSet"];
      });
    }
  } else {
    idx = 0;
  }
  if (idx < 0) {
    idx = 0;
  }
  matrixSet = (l["TileMatrixSetLink"][idx]["TileMatrixSet"]);
  ol.DEBUG && console.assert(matrixSet, "TileMatrixSet must not be null");
  var format = (l["Format"][0]);
  if ("format" in config) {
    format = config["format"];
  }
  idx = ol.array.findIndex(l["Style"], function(elt, index, array) {
    if ("style" in config) {
      return elt["Title"] == config["style"];
    } else {
      return elt["isDefault"];
    }
  });
  if (idx < 0) {
    idx = 0;
  }
  var style = (l["Style"][idx]["Identifier"]);
  var dimensions = {};
  if ("Dimension" in l) {
    l["Dimension"].forEach(function(elt, index, array) {
      var key = elt["Identifier"];
      var value = elt["Default"];
      if (value !== undefined) {
        ol.DEBUG && console.assert(ol.array.includes(elt["Value"], value), "default value contained in values");
      } else {
        value = elt["Value"][0];
      }
      ol.DEBUG && console.assert(value !== undefined, "value could be found");
      dimensions[key] = value;
    });
  }
  var matrixSets = wmtsCap["Contents"]["TileMatrixSet"];
  var matrixSetObj = ol.array.find(matrixSets, function(elt, index, array) {
    return elt["Identifier"] == matrixSet;
  });
  ol.DEBUG && console.assert(matrixSetObj, "found matrixSet in Contents/TileMatrixSet");
  var projection;
  if ("projection" in config) {
    projection = ol.proj.get(config["projection"]);
  } else {
    projection = ol.proj.get(matrixSetObj["SupportedCRS"].replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, "$1:$3"));
  }
  var wgs84BoundingBox = l["WGS84BoundingBox"];
  var extent, wrapX;
  if (wgs84BoundingBox !== undefined) {
    var wgs84ProjectionExtent = ol.proj.get("EPSG:4326").getExtent();
    wrapX = wgs84BoundingBox[0] == wgs84ProjectionExtent[0] && wgs84BoundingBox[2] == wgs84ProjectionExtent[2];
    extent = ol.proj.transformExtent(wgs84BoundingBox, "EPSG:4326", projection);
    var projectionExtent = projection.getExtent();
    if (projectionExtent) {
      if (!ol.extent.containsExtent(projectionExtent, extent)) {
        extent = undefined;
      }
    }
  }
  var tileGrid = ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet(matrixSetObj, extent);
  var urls = [];
  var requestEncoding = config["requestEncoding"];
  requestEncoding = requestEncoding !== undefined ? requestEncoding : "";
  ol.DEBUG && console.assert(ol.array.includes(["REST", "RESTful", "KVP", ""], requestEncoding), 'requestEncoding (%s) is one of "REST", "RESTful", "KVP" or ""', requestEncoding);
  if ("OperationsMetadata" in wmtsCap && "GetTile" in wmtsCap["OperationsMetadata"]) {
    var gets = wmtsCap["OperationsMetadata"]["GetTile"]["DCP"]["HTTP"]["Get"];
    ol.DEBUG && console.assert(gets.length >= 1);
    for (var i = 0, ii = gets.length;i < ii;++i) {
      var constraint = ol.array.find(gets[i]["Constraint"], function(element) {
        return element["name"] == "GetEncoding";
      });
      var encodings = constraint["AllowedValues"]["Value"];
      ol.DEBUG && console.assert(encodings.length >= 1);
      if (requestEncoding === "") {
        requestEncoding = encodings[0];
      }
      if (requestEncoding === ol.source.WMTS.RequestEncoding.KVP) {
        if (ol.array.includes(encodings, ol.source.WMTS.RequestEncoding.KVP)) {
          urls.push((gets[i]["href"]));
        }
      } else {
        break;
      }
    }
  }
  if (urls.length === 0) {
    requestEncoding = ol.source.WMTS.RequestEncoding.REST;
    l["ResourceURL"].forEach(function(element) {
      if (element["resourceType"] === "tile") {
        format = element["format"];
        urls.push((element["template"]));
      }
    });
  }
  ol.DEBUG && console.assert(urls.length > 0, "At least one URL found");
  return {urls:urls, layer:config["layer"], matrixSet:matrixSet, format:format, projection:projection, requestEncoding:requestEncoding, tileGrid:tileGrid, style:style, dimensions:dimensions, wrapX:wrapX};
};
ol.source.WMTS.RequestEncoding = {KVP:"KVP", REST:"REST"};
goog.provide("ol.style.IconImageCache");
goog.require("ol");
goog.require("ol.color");
ol.style.IconImageCache = function() {
  this.cache_ = {};
  this.cacheSize_ = 0;
  this.maxCacheSize_ = 32;
};
ol.style.IconImageCache.getKey = function(src, crossOrigin, color) {
  ol.DEBUG && console.assert(crossOrigin !== undefined, "argument crossOrigin must be defined");
  var colorString = color ? ol.color.asString(color) : "null";
  return crossOrigin + ":" + src + ":" + colorString;
};
ol.style.IconImageCache.prototype.clear = function() {
  this.cache_ = {};
  this.cacheSize_ = 0;
};
ol.style.IconImageCache.prototype.expire = function() {
  if (this.cacheSize_ > this.maxCacheSize_) {
    var i = 0;
    var key, iconImage;
    for (key in this.cache_) {
      iconImage = this.cache_[key];
      if ((i++ & 3) === 0 && !iconImage.hasListener()) {
        delete this.cache_[key];
        --this.cacheSize_;
      }
    }
  }
};
ol.style.IconImageCache.prototype.get = function(src, crossOrigin, color) {
  var key = ol.style.IconImageCache.getKey(src, crossOrigin, color);
  return key in this.cache_ ? this.cache_[key] : null;
};
ol.style.IconImageCache.prototype.set = function(src, crossOrigin, color, iconImage) {
  var key = ol.style.IconImageCache.getKey(src, crossOrigin, color);
  this.cache_[key] = iconImage;
  ++this.cacheSize_;
};
goog.provide("ol.style");
goog.require("ol.style.IconImageCache");
ol.style.iconImageCache = new ol.style.IconImageCache;
goog.provide("ol.style.IconImage");
goog.require("ol");
goog.require("ol.dom");
goog.require("ol.events");
goog.require("ol.events.EventTarget");
goog.require("ol.events.EventType");
goog.require("ol.Image");
goog.require("ol.style");
ol.style.IconImage = function(image, src, size, crossOrigin, imageState, color) {
  ol.events.EventTarget.call(this);
  this.hitDetectionImage_ = null;
  this.image_ = !image ? new Image : image;
  if (crossOrigin !== null) {
    this.image_.crossOrigin = crossOrigin;
  }
  this.canvas_ = color ? (document.createElement("CANVAS")) : null;
  this.color_ = color;
  this.imageListenerKeys_ = null;
  this.imageState_ = imageState;
  this.size_ = size;
  this.src_ = src;
  this.tainting_ = false;
  if (this.imageState_ == ol.Image.State.LOADED) {
    this.determineTainting_();
  }
};
ol.inherits(ol.style.IconImage, ol.events.EventTarget);
ol.style.IconImage.get = function(image, src, size, crossOrigin, imageState, color) {
  var iconImageCache = ol.style.iconImageCache;
  var iconImage = iconImageCache.get(src, crossOrigin, color);
  if (!iconImage) {
    iconImage = new ol.style.IconImage(image, src, size, crossOrigin, imageState, color);
    iconImageCache.set(src, crossOrigin, color, iconImage);
  }
  return iconImage;
};
ol.style.IconImage.prototype.determineTainting_ = function() {
  var context = ol.dom.createCanvasContext2D(1, 1);
  try {
    context.drawImage(this.image_, 0, 0);
    context.getImageData(0, 0, 1, 1);
  } catch (e) {
    this.tainting_ = true;
  }
};
ol.style.IconImage.prototype.dispatchChangeEvent_ = function() {
  this.dispatchEvent(ol.events.EventType.CHANGE);
};
ol.style.IconImage.prototype.handleImageError_ = function() {
  this.imageState_ = ol.Image.State.ERROR;
  this.unlistenImage_();
  this.dispatchChangeEvent_();
};
ol.style.IconImage.prototype.handleImageLoad_ = function() {
  this.imageState_ = ol.Image.State.LOADED;
  if (this.size_) {
    this.image_.width = this.size_[0];
    this.image_.height = this.size_[1];
  }
  this.size_ = [this.image_.width, this.image_.height];
  this.unlistenImage_();
  this.determineTainting_();
  this.replaceColor_();
  this.dispatchChangeEvent_();
};
ol.style.IconImage.prototype.getImage = function(pixelRatio) {
  return this.canvas_ ? this.canvas_ : this.image_;
};
ol.style.IconImage.prototype.getImageState = function() {
  return this.imageState_;
};
ol.style.IconImage.prototype.getHitDetectionImage = function(pixelRatio) {
  if (!this.hitDetectionImage_) {
    if (this.tainting_) {
      var width = this.size_[0];
      var height = this.size_[1];
      var context = ol.dom.createCanvasContext2D(width, height);
      context.fillRect(0, 0, width, height);
      this.hitDetectionImage_ = context.canvas;
    } else {
      this.hitDetectionImage_ = this.image_;
    }
  }
  return this.hitDetectionImage_;
};
ol.style.IconImage.prototype.getSize = function() {
  return this.size_;
};
ol.style.IconImage.prototype.getSrc = function() {
  return this.src_;
};
ol.style.IconImage.prototype.load = function() {
  if (this.imageState_ == ol.Image.State.IDLE) {
    ol.DEBUG && console.assert(this.src_ !== undefined, "this.src_ must not be undefined");
    ol.DEBUG && console.assert(!this.imageListenerKeys_, "no listener keys existing");
    this.imageState_ = ol.Image.State.LOADING;
    this.imageListenerKeys_ = [ol.events.listenOnce(this.image_, ol.events.EventType.ERROR, this.handleImageError_, this), ol.events.listenOnce(this.image_, ol.events.EventType.LOAD, this.handleImageLoad_, this)];
    try {
      this.image_.src = this.src_;
    } catch (e) {
      this.handleImageError_();
    }
  }
};
ol.style.IconImage.prototype.replaceColor_ = function() {
  if (this.tainting_ || this.color_ === null) {
    return;
  }
  this.canvas_.width = this.image_.width;
  this.canvas_.height = this.image_.height;
  var ctx = this.canvas_.getContext("2d");
  ctx.drawImage(this.image_, 0, 0);
  var imgData = ctx.getImageData(0, 0, this.image_.width, this.image_.height);
  var data = imgData.data;
  var r = this.color_[0] / 255;
  var g = this.color_[1] / 255;
  var b = this.color_[2] / 255;
  for (var i = 0, ii = data.length;i < ii;i += 4) {
    data[i] *= r;
    data[i + 1] *= g;
    data[i + 2] *= b;
  }
  ctx.putImageData(imgData, 0, 0);
};
ol.style.IconImage.prototype.unlistenImage_ = function() {
  this.imageListenerKeys_.forEach(ol.events.unlistenByKey);
  this.imageListenerKeys_ = null;
};
goog.provide("ol.style.Icon");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.color");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.Image");
goog.require("ol.style.IconImage");
goog.require("ol.style.Image");
ol.style.Icon = function(opt_options) {
  var options = opt_options || {};
  this.anchor_ = options.anchor !== undefined ? options.anchor : [.5, .5];
  this.normalizedAnchor_ = null;
  this.anchorOrigin_ = options.anchorOrigin !== undefined ? options.anchorOrigin : ol.style.Icon.Origin.TOP_LEFT;
  this.anchorXUnits_ = options.anchorXUnits !== undefined ? options.anchorXUnits : ol.style.Icon.AnchorUnits.FRACTION;
  this.anchorYUnits_ = options.anchorYUnits !== undefined ? options.anchorYUnits : ol.style.Icon.AnchorUnits.FRACTION;
  this.crossOrigin_ = options.crossOrigin !== undefined ? options.crossOrigin : null;
  var image = options.img !== undefined ? options.img : null;
  var imgSize = options.imgSize !== undefined ? options.imgSize : null;
  var src = options.src;
  ol.asserts.assert(!(src !== undefined && image), 4);
  ol.asserts.assert(!image || image && imgSize, 5);
  if ((src === undefined || src.length === 0) && image) {
    src = image.src || ol.getUid(image).toString();
  }
  ol.asserts.assert(src !== undefined && src.length > 0, 6);
  var imageState = options.src !== undefined ? ol.Image.State.IDLE : ol.Image.State.LOADED;
  this.color_ = options.color !== undefined ? ol.color.asArray(options.color) : null;
  this.iconImage_ = ol.style.IconImage.get(image, (src), imgSize, this.crossOrigin_, imageState, this.color_);
  this.offset_ = options.offset !== undefined ? options.offset : [0, 0];
  this.offsetOrigin_ = options.offsetOrigin !== undefined ? options.offsetOrigin : ol.style.Icon.Origin.TOP_LEFT;
  this.origin_ = null;
  this.size_ = options.size !== undefined ? options.size : null;
  var opacity = options.opacity !== undefined ? options.opacity : 1;
  var rotateWithView = options.rotateWithView !== undefined ? options.rotateWithView : false;
  var rotation = options.rotation !== undefined ? options.rotation : 0;
  var scale = options.scale !== undefined ? options.scale : 1;
  var snapToPixel = options.snapToPixel !== undefined ? options.snapToPixel : true;
  ol.style.Image.call(this, {opacity:opacity, rotation:rotation, scale:scale, snapToPixel:snapToPixel, rotateWithView:rotateWithView});
};
ol.inherits(ol.style.Icon, ol.style.Image);
ol.style.Icon.prototype.clone = function() {
  var oldImage = this.getImage(1);
  var newImage;
  if (this.iconImage_.getImageState() === ol.Image.State.LOADED) {
    if (oldImage.tagName.toUpperCase() === "IMG") {
      newImage = (oldImage.cloneNode(true));
    } else {
      newImage = (document.createElement("canvas"));
      var context = newImage.getContext("2d");
      newImage.width = oldImage.width;
      newImage.height = oldImage.height;
      context.drawImage(oldImage, 0, 0);
    }
  }
  return new ol.style.Icon({anchor:this.anchor_.slice(), anchorOrigin:this.anchorOrigin_, anchorXUnits:this.anchorXUnits_, anchorYUnits:this.anchorYUnits_, crossOrigin:this.crossOrigin_, color:this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || undefined, img:newImage ? newImage : undefined, imgSize:newImage ? this.iconImage_.getSize().slice() : undefined, src:newImage ? undefined : this.getSrc(), offset:this.offset_.slice(), offsetOrigin:this.offsetOrigin_, size:this.size_ !== 
  null ? this.size_.slice() : undefined, opacity:this.getOpacity(), scale:this.getScale(), snapToPixel:this.getSnapToPixel(), rotation:this.getRotation(), rotateWithView:this.getRotateWithView()});
};
ol.style.Icon.prototype.getAnchor = function() {
  if (this.normalizedAnchor_) {
    return this.normalizedAnchor_;
  }
  var anchor = this.anchor_;
  var size = this.getSize();
  if (this.anchorXUnits_ == ol.style.Icon.AnchorUnits.FRACTION || this.anchorYUnits_ == ol.style.Icon.AnchorUnits.FRACTION) {
    if (!size) {
      return null;
    }
    anchor = this.anchor_.slice();
    if (this.anchorXUnits_ == ol.style.Icon.AnchorUnits.FRACTION) {
      anchor[0] *= size[0];
    }
    if (this.anchorYUnits_ == ol.style.Icon.AnchorUnits.FRACTION) {
      anchor[1] *= size[1];
    }
  }
  if (this.anchorOrigin_ != ol.style.Icon.Origin.TOP_LEFT) {
    if (!size) {
      return null;
    }
    if (anchor === this.anchor_) {
      anchor = this.anchor_.slice();
    }
    if (this.anchorOrigin_ == ol.style.Icon.Origin.TOP_RIGHT || this.anchorOrigin_ == ol.style.Icon.Origin.BOTTOM_RIGHT) {
      anchor[0] = -anchor[0] + size[0];
    }
    if (this.anchorOrigin_ == ol.style.Icon.Origin.BOTTOM_LEFT || this.anchorOrigin_ == ol.style.Icon.Origin.BOTTOM_RIGHT) {
      anchor[1] = -anchor[1] + size[1];
    }
  }
  this.normalizedAnchor_ = anchor;
  return this.normalizedAnchor_;
};
ol.style.Icon.prototype.getImage = function(pixelRatio) {
  return this.iconImage_.getImage(pixelRatio);
};
ol.style.Icon.prototype.getImageSize = function() {
  return this.iconImage_.getSize();
};
ol.style.Icon.prototype.getHitDetectionImageSize = function() {
  return this.getImageSize();
};
ol.style.Icon.prototype.getImageState = function() {
  return this.iconImage_.getImageState();
};
ol.style.Icon.prototype.getHitDetectionImage = function(pixelRatio) {
  return this.iconImage_.getHitDetectionImage(pixelRatio);
};
ol.style.Icon.prototype.getOrigin = function() {
  if (this.origin_) {
    return this.origin_;
  }
  var offset = this.offset_;
  if (this.offsetOrigin_ != ol.style.Icon.Origin.TOP_LEFT) {
    var size = this.getSize();
    var iconImageSize = this.iconImage_.getSize();
    if (!size || !iconImageSize) {
      return null;
    }
    offset = offset.slice();
    if (this.offsetOrigin_ == ol.style.Icon.Origin.TOP_RIGHT || this.offsetOrigin_ == ol.style.Icon.Origin.BOTTOM_RIGHT) {
      offset[0] = iconImageSize[0] - size[0] - offset[0];
    }
    if (this.offsetOrigin_ == ol.style.Icon.Origin.BOTTOM_LEFT || this.offsetOrigin_ == ol.style.Icon.Origin.BOTTOM_RIGHT) {
      offset[1] = iconImageSize[1] - size[1] - offset[1];
    }
  }
  this.origin_ = offset;
  return this.origin_;
};
ol.style.Icon.prototype.getSrc = function() {
  return this.iconImage_.getSrc();
};
ol.style.Icon.prototype.getSize = function() {
  return !this.size_ ? this.iconImage_.getSize() : this.size_;
};
ol.style.Icon.prototype.listenImageChange = function(listener, thisArg) {
  return ol.events.listen(this.iconImage_, ol.events.EventType.CHANGE, listener, thisArg);
};
ol.style.Icon.prototype.load = function() {
  this.iconImage_.load();
};
ol.style.Icon.prototype.unlistenImageChange = function(listener, thisArg) {
  ol.events.unlisten(this.iconImage_, ol.events.EventType.CHANGE, listener, thisArg);
};
ol.style.Icon.AnchorUnits = {FRACTION:"fraction", PIXELS:"pixels"};
ol.style.Icon.Origin = {BOTTOM_LEFT:"bottom-left", BOTTOM_RIGHT:"bottom-right", TOP_LEFT:"top-left", TOP_RIGHT:"top-right"};
goog.provide("ol.layer.Base");
goog.provide("ol.layer.LayerProperty");
goog.require("ol");
goog.require("ol.Object");
goog.require("ol.math");
goog.require("ol.obj");
ol.layer.LayerProperty = {OPACITY:"opacity", VISIBLE:"visible", EXTENT:"extent", Z_INDEX:"zIndex", MAX_RESOLUTION:"maxResolution", MIN_RESOLUTION:"minResolution", SOURCE:"source"};
ol.layer.Base = function(options) {
  ol.Object.call(this);
  var properties = ol.obj.assign({}, options);
  properties[ol.layer.LayerProperty.OPACITY] = options.opacity !== undefined ? options.opacity : 1;
  properties[ol.layer.LayerProperty.VISIBLE] = options.visible !== undefined ? options.visible : true;
  properties[ol.layer.LayerProperty.Z_INDEX] = options.zIndex !== undefined ? options.zIndex : 0;
  properties[ol.layer.LayerProperty.MAX_RESOLUTION] = options.maxResolution !== undefined ? options.maxResolution : Infinity;
  properties[ol.layer.LayerProperty.MIN_RESOLUTION] = options.minResolution !== undefined ? options.minResolution : 0;
  this.setProperties(properties);
  this.state_ = ({layer:(this), managed:true});
};
ol.inherits(ol.layer.Base, ol.Object);
ol.layer.Base.prototype.getLayerState = function() {
  this.state_.opacity = ol.math.clamp(this.getOpacity(), 0, 1);
  this.state_.sourceState = this.getSourceState();
  this.state_.visible = this.getVisible();
  this.state_.extent = this.getExtent();
  this.state_.zIndex = this.getZIndex();
  this.state_.maxResolution = this.getMaxResolution();
  this.state_.minResolution = Math.max(this.getMinResolution(), 0);
  return this.state_;
};
ol.layer.Base.prototype.getLayersArray = function(opt_array) {
};
ol.layer.Base.prototype.getLayerStatesArray = function(opt_states) {
};
ol.layer.Base.prototype.getExtent = function() {
  return (this.get(ol.layer.LayerProperty.EXTENT));
};
ol.layer.Base.prototype.getMaxResolution = function() {
  return (this.get(ol.layer.LayerProperty.MAX_RESOLUTION));
};
ol.layer.Base.prototype.getMinResolution = function() {
  return (this.get(ol.layer.LayerProperty.MIN_RESOLUTION));
};
ol.layer.Base.prototype.getOpacity = function() {
  return (this.get(ol.layer.LayerProperty.OPACITY));
};
ol.layer.Base.prototype.getSourceState = function() {
};
ol.layer.Base.prototype.getVisible = function() {
  return (this.get(ol.layer.LayerProperty.VISIBLE));
};
ol.layer.Base.prototype.getZIndex = function() {
  return (this.get(ol.layer.LayerProperty.Z_INDEX));
};
ol.layer.Base.prototype.setExtent = function(extent) {
  this.set(ol.layer.LayerProperty.EXTENT, extent);
};
ol.layer.Base.prototype.setMaxResolution = function(maxResolution) {
  this.set(ol.layer.LayerProperty.MAX_RESOLUTION, maxResolution);
};
ol.layer.Base.prototype.setMinResolution = function(minResolution) {
  this.set(ol.layer.LayerProperty.MIN_RESOLUTION, minResolution);
};
ol.layer.Base.prototype.setOpacity = function(opacity) {
  this.set(ol.layer.LayerProperty.OPACITY, opacity);
};
ol.layer.Base.prototype.setVisible = function(visible) {
  this.set(ol.layer.LayerProperty.VISIBLE, visible);
};
ol.layer.Base.prototype.setZIndex = function(zindex) {
  this.set(ol.layer.LayerProperty.Z_INDEX, zindex);
};
goog.provide("ol.render.Event");
goog.require("ol");
goog.require("ol.events.Event");
ol.render.Event = function(type, opt_vectorContext, opt_frameState, opt_context, opt_glContext) {
  ol.events.Event.call(this, type);
  this.vectorContext = opt_vectorContext;
  this.frameState = opt_frameState;
  this.context = opt_context;
  this.glContext = opt_glContext;
};
ol.inherits(ol.render.Event, ol.events.Event);
ol.render.Event.Type = {POSTCOMPOSE:"postcompose", PRECOMPOSE:"precompose", RENDER:"render"};
goog.provide("ol.layer.Layer");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol");
goog.require("ol.Object");
goog.require("ol.layer.Base");
goog.require("ol.layer.LayerProperty");
goog.require("ol.obj");
goog.require("ol.render.Event");
goog.require("ol.source.State");
ol.layer.Layer = function(options) {
  var baseOptions = ol.obj.assign({}, options);
  delete baseOptions.source;
  ol.layer.Base.call(this, (baseOptions));
  this.mapPrecomposeKey_ = null;
  this.mapRenderKey_ = null;
  this.sourceChangeKey_ = null;
  if (options.map) {
    this.setMap(options.map);
  }
  ol.events.listen(this, ol.Object.getChangeEventType(ol.layer.LayerProperty.SOURCE), this.handleSourcePropertyChange_, this);
  var source = options.source ? options.source : null;
  this.setSource(source);
};
ol.inherits(ol.layer.Layer, ol.layer.Base);
ol.layer.Layer.visibleAtResolution = function(layerState, resolution) {
  return layerState.visible && resolution >= layerState.minResolution && resolution < layerState.maxResolution;
};
ol.layer.Layer.prototype.getLayersArray = function(opt_array) {
  var array = opt_array ? opt_array : [];
  array.push(this);
  return array;
};
ol.layer.Layer.prototype.getLayerStatesArray = function(opt_states) {
  var states = opt_states ? opt_states : [];
  states.push(this.getLayerState());
  return states;
};
ol.layer.Layer.prototype.getSource = function() {
  var source = this.get(ol.layer.LayerProperty.SOURCE);
  return (source) || null;
};
ol.layer.Layer.prototype.getSourceState = function() {
  var source = this.getSource();
  return !source ? ol.source.State.UNDEFINED : source.getState();
};
ol.layer.Layer.prototype.handleSourceChange_ = function() {
  this.changed();
};
ol.layer.Layer.prototype.handleSourcePropertyChange_ = function() {
  if (this.sourceChangeKey_) {
    ol.events.unlistenByKey(this.sourceChangeKey_);
    this.sourceChangeKey_ = null;
  }
  var source = this.getSource();
  if (source) {
    this.sourceChangeKey_ = ol.events.listen(source, ol.events.EventType.CHANGE, this.handleSourceChange_, this);
  }
  this.changed();
};
ol.layer.Layer.prototype.setMap = function(map) {
  if (this.mapPrecomposeKey_) {
    ol.events.unlistenByKey(this.mapPrecomposeKey_);
    this.mapPrecomposeKey_ = null;
  }
  if (!map) {
    this.changed();
  }
  if (this.mapRenderKey_) {
    ol.events.unlistenByKey(this.mapRenderKey_);
    this.mapRenderKey_ = null;
  }
  if (map) {
    this.mapPrecomposeKey_ = ol.events.listen(map, ol.render.Event.Type.PRECOMPOSE, function(evt) {
      var layerState = this.getLayerState();
      layerState.managed = false;
      layerState.zIndex = Infinity;
      evt.frameState.layerStatesArray.push(layerState);
      evt.frameState.layerStates[ol.getUid(this)] = layerState;
    }, this);
    this.mapRenderKey_ = ol.events.listen(this, ol.events.EventType.CHANGE, map.render, map);
    this.changed();
  }
};
ol.layer.Layer.prototype.setSource = function(source) {
  this.set(ol.layer.LayerProperty.SOURCE, source);
};
goog.provide("ol.layer.Tile");
goog.require("ol");
goog.require("ol.layer.Layer");
goog.require("ol.obj");
ol.layer.Tile = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var baseOptions = ol.obj.assign({}, options);
  delete baseOptions.preload;
  delete baseOptions.useInterimTilesOnError;
  ol.layer.Layer.call(this, (baseOptions));
  this.setPreload(options.preload !== undefined ? options.preload : 0);
  this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ? options.useInterimTilesOnError : true);
};
ol.inherits(ol.layer.Tile, ol.layer.Layer);
ol.layer.Tile.prototype.getPreload = function() {
  return (this.get(ol.layer.Tile.Property.PRELOAD));
};
ol.layer.Tile.prototype.getSource;
ol.layer.Tile.prototype.setPreload = function(preload) {
  this.set(ol.layer.Tile.Property.PRELOAD, preload);
};
ol.layer.Tile.prototype.getUseInterimTilesOnError = function() {
  return (this.get(ol.layer.Tile.Property.USE_INTERIM_TILES_ON_ERROR));
};
ol.layer.Tile.prototype.setUseInterimTilesOnError = function(useInterimTilesOnError) {
  this.set(ol.layer.Tile.Property.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
};
ol.layer.Tile.Property = {PRELOAD:"preload", USE_INTERIM_TILES_ON_ERROR:"useInterimTilesOnError"};
goog.provide("ol.layer.Vector");
goog.require("ol");
goog.require("ol.layer.Layer");
goog.require("ol.obj");
goog.require("ol.style.Style");
ol.layer.Vector = function(opt_options) {
  var options = opt_options ? opt_options : ({});
  ol.DEBUG && console.assert(options.renderOrder === undefined || !options.renderOrder || typeof options.renderOrder === "function", "renderOrder must be a comparator function");
  var baseOptions = ol.obj.assign({}, options);
  delete baseOptions.style;
  delete baseOptions.renderBuffer;
  delete baseOptions.updateWhileAnimating;
  delete baseOptions.updateWhileInteracting;
  ol.layer.Layer.call(this, (baseOptions));
  this.renderBuffer_ = options.renderBuffer !== undefined ? options.renderBuffer : 100;
  this.style_ = null;
  this.styleFunction_ = undefined;
  this.setStyle(options.style);
  this.updateWhileAnimating_ = options.updateWhileAnimating !== undefined ? options.updateWhileAnimating : false;
  this.updateWhileInteracting_ = options.updateWhileInteracting !== undefined ? options.updateWhileInteracting : false;
};
ol.inherits(ol.layer.Vector, ol.layer.Layer);
ol.layer.Vector.prototype.getRenderBuffer = function() {
  return this.renderBuffer_;
};
ol.layer.Vector.prototype.getRenderOrder = function() {
  return (this.get(ol.layer.Vector.Property.RENDER_ORDER));
};
ol.layer.Vector.prototype.getSource;
ol.layer.Vector.prototype.getStyle = function() {
  return this.style_;
};
ol.layer.Vector.prototype.getStyleFunction = function() {
  return this.styleFunction_;
};
ol.layer.Vector.prototype.getUpdateWhileAnimating = function() {
  return this.updateWhileAnimating_;
};
ol.layer.Vector.prototype.getUpdateWhileInteracting = function() {
  return this.updateWhileInteracting_;
};
ol.layer.Vector.prototype.setRenderOrder = function(renderOrder) {
  ol.DEBUG && console.assert(renderOrder === undefined || !renderOrder || typeof renderOrder === "function", "renderOrder must be a comparator function");
  this.set(ol.layer.Vector.Property.RENDER_ORDER, renderOrder);
};
ol.layer.Vector.prototype.setStyle = function(style) {
  this.style_ = style !== undefined ? style : ol.style.Style.defaultFunction;
  this.styleFunction_ = style === null ? undefined : ol.style.Style.createFunction(this.style_);
  this.changed();
};
ol.layer.Vector.Property = {RENDER_ORDER:"renderOrder"};
goog.provide("ol.layer.VectorTile");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.layer.Tile");
goog.require("ol.layer.Vector");
goog.require("ol.obj");
ol.layer.VectorTile = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var baseOptions = ol.obj.assign({}, options);
  delete baseOptions.preload;
  delete baseOptions.useInterimTilesOnError;
  ol.layer.Vector.call(this, (baseOptions));
  this.setPreload(options.preload ? options.preload : 0);
  this.setUseInterimTilesOnError(options.useInterimTilesOnError ? options.useInterimTilesOnError : true);
  ol.asserts.assert(options.renderMode == undefined || options.renderMode == ol.layer.VectorTile.RenderType.IMAGE || options.renderMode == ol.layer.VectorTile.RenderType.HYBRID || options.renderMode == ol.layer.VectorTile.RenderType.VECTOR, 28);
  this.renderMode_ = options.renderMode || ol.layer.VectorTile.RenderType.HYBRID;
};
ol.inherits(ol.layer.VectorTile, ol.layer.Vector);
ol.layer.VectorTile.prototype.getPreload = function() {
  return (this.get(ol.layer.VectorTile.Property.PRELOAD));
};
ol.layer.VectorTile.prototype.getRenderMode = function() {
  return this.renderMode_;
};
ol.layer.VectorTile.prototype.getUseInterimTilesOnError = function() {
  return (this.get(ol.layer.VectorTile.Property.USE_INTERIM_TILES_ON_ERROR));
};
ol.layer.VectorTile.prototype.setPreload = function(preload) {
  this.set(ol.layer.Tile.Property.PRELOAD, preload);
};
ol.layer.VectorTile.prototype.setUseInterimTilesOnError = function(useInterimTilesOnError) {
  this.set(ol.layer.Tile.Property.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
};
ol.layer.VectorTile.Property = {PRELOAD:"preload", USE_INTERIM_TILES_ON_ERROR:"useInterimTilesOnError"};
ol.layer.VectorTile.RenderType = {IMAGE:"image", HYBRID:"hybrid", VECTOR:"vector"};
goog.provide("ol.Collection");
goog.require("ol");
goog.require("ol.events.Event");
goog.require("ol.Object");
ol.Collection = function(opt_array) {
  ol.Object.call(this);
  this.array_ = opt_array ? opt_array : [];
  this.updateLength_();
};
ol.inherits(ol.Collection, ol.Object);
ol.Collection.prototype.clear = function() {
  while (this.getLength() > 0) {
    this.pop();
  }
};
ol.Collection.prototype.extend = function(arr) {
  var i, ii;
  for (i = 0, ii = arr.length;i < ii;++i) {
    this.push(arr[i]);
  }
  return this;
};
ol.Collection.prototype.forEach = function(f, opt_this) {
  this.array_.forEach(f, opt_this);
};
ol.Collection.prototype.getArray = function() {
  return this.array_;
};
ol.Collection.prototype.item = function(index) {
  return this.array_[index];
};
ol.Collection.prototype.getLength = function() {
  return (this.get(ol.Collection.Property.LENGTH));
};
ol.Collection.prototype.insertAt = function(index, elem) {
  this.array_.splice(index, 0, elem);
  this.updateLength_();
  this.dispatchEvent(new ol.Collection.Event(ol.Collection.EventType.ADD, elem));
};
ol.Collection.prototype.pop = function() {
  return this.removeAt(this.getLength() - 1);
};
ol.Collection.prototype.push = function(elem) {
  var n = this.array_.length;
  this.insertAt(n, elem);
  return n;
};
ol.Collection.prototype.remove = function(elem) {
  var arr = this.array_;
  var i, ii;
  for (i = 0, ii = arr.length;i < ii;++i) {
    if (arr[i] === elem) {
      return this.removeAt(i);
    }
  }
  return undefined;
};
ol.Collection.prototype.removeAt = function(index) {
  var prev = this.array_[index];
  this.array_.splice(index, 1);
  this.updateLength_();
  this.dispatchEvent(new ol.Collection.Event(ol.Collection.EventType.REMOVE, prev));
  return prev;
};
ol.Collection.prototype.setAt = function(index, elem) {
  var n = this.getLength();
  if (index < n) {
    var prev = this.array_[index];
    this.array_[index] = elem;
    this.dispatchEvent(new ol.Collection.Event(ol.Collection.EventType.REMOVE, prev));
    this.dispatchEvent(new ol.Collection.Event(ol.Collection.EventType.ADD, elem));
  } else {
    var j;
    for (j = n;j < index;++j) {
      this.insertAt(j, undefined);
    }
    this.insertAt(index, elem);
  }
};
ol.Collection.prototype.updateLength_ = function() {
  this.set(ol.Collection.Property.LENGTH, this.array_.length);
};
ol.Collection.Property = {LENGTH:"length"};
ol.Collection.EventType = {ADD:"add", REMOVE:"remove"};
ol.Collection.Event = function(type, opt_element) {
  ol.events.Event.call(this, type);
  this.element = opt_element;
};
ol.inherits(ol.Collection.Event, ol.events.Event);
goog.provide("ol.pointer.EventType");
ol.pointer.EventType = {POINTERMOVE:"pointermove", POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", POINTERCANCEL:"pointercancel"};
goog.provide("ol.pointer.EventSource");
ol.pointer.EventSource = function(dispatcher, mapping) {
  this.dispatcher = dispatcher;
  this.mapping_ = mapping;
};
ol.pointer.EventSource.prototype.getEvents = function() {
  return Object.keys(this.mapping_);
};
ol.pointer.EventSource.prototype.getMapping = function() {
  return this.mapping_;
};
ol.pointer.EventSource.prototype.getHandlerForEvent = function(eventType) {
  return this.mapping_[eventType];
};
goog.provide("ol.pointer.MouseSource");
goog.require("ol");
goog.require("ol.pointer.EventSource");
ol.pointer.MouseSource = function(dispatcher) {
  var mapping = {"mousedown":this.mousedown, "mousemove":this.mousemove, "mouseup":this.mouseup, "mouseover":this.mouseover, "mouseout":this.mouseout};
  ol.pointer.EventSource.call(this, dispatcher, mapping);
  this.pointerMap = dispatcher.pointerMap;
  this.lastTouches = [];
};
ol.inherits(ol.pointer.MouseSource, ol.pointer.EventSource);
ol.pointer.MouseSource.POINTER_ID = 1;
ol.pointer.MouseSource.POINTER_TYPE = "mouse";
ol.pointer.MouseSource.DEDUP_DIST = 25;
ol.pointer.MouseSource.prototype.isEventSimulatedFromTouch_ = function(inEvent) {
  var lts = this.lastTouches;
  var x = inEvent.clientX, y = inEvent.clientY;
  for (var i = 0, l = lts.length, t;i < l && (t = lts[i]);i++) {
    var dx = Math.abs(x - t[0]), dy = Math.abs(y - t[1]);
    if (dx <= ol.pointer.MouseSource.DEDUP_DIST && dy <= ol.pointer.MouseSource.DEDUP_DIST) {
      return true;
    }
  }
  return false;
};
ol.pointer.MouseSource.prepareEvent = function(inEvent, dispatcher) {
  var e = dispatcher.cloneEvent(inEvent, inEvent);
  var pd = e.preventDefault;
  e.preventDefault = function() {
    inEvent.preventDefault();
    pd();
  };
  e.pointerId = ol.pointer.MouseSource.POINTER_ID;
  e.isPrimary = true;
  e.pointerType = ol.pointer.MouseSource.POINTER_TYPE;
  return e;
};
ol.pointer.MouseSource.prototype.mousedown = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    if (ol.pointer.MouseSource.POINTER_ID.toString() in this.pointerMap) {
      this.cancel(inEvent);
    }
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.pointerMap[ol.pointer.MouseSource.POINTER_ID.toString()] = inEvent;
    this.dispatcher.down(e, inEvent);
  }
};
ol.pointer.MouseSource.prototype.mousemove = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.move(e, inEvent);
  }
};
ol.pointer.MouseSource.prototype.mouseup = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var p = this.pointerMap[ol.pointer.MouseSource.POINTER_ID.toString()];
    if (p && p.button === inEvent.button) {
      var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
      this.dispatcher.up(e, inEvent);
      this.cleanupMouse();
    }
  }
};
ol.pointer.MouseSource.prototype.mouseover = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.enterOver(e, inEvent);
  }
};
ol.pointer.MouseSource.prototype.mouseout = function(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.leaveOut(e, inEvent);
  }
};
ol.pointer.MouseSource.prototype.cancel = function(inEvent) {
  var e = ol.pointer.MouseSource.prepareEvent(inEvent, this.dispatcher);
  this.dispatcher.cancel(e, inEvent);
  this.cleanupMouse();
};
ol.pointer.MouseSource.prototype.cleanupMouse = function() {
  delete this.pointerMap[ol.pointer.MouseSource.POINTER_ID.toString()];
};
goog.provide("ol.pointer.MsSource");
goog.require("ol");
goog.require("ol.pointer.EventSource");
ol.pointer.MsSource = function(dispatcher) {
  var mapping = {"MSPointerDown":this.msPointerDown, "MSPointerMove":this.msPointerMove, "MSPointerUp":this.msPointerUp, "MSPointerOut":this.msPointerOut, "MSPointerOver":this.msPointerOver, "MSPointerCancel":this.msPointerCancel, "MSGotPointerCapture":this.msGotPointerCapture, "MSLostPointerCapture":this.msLostPointerCapture};
  ol.pointer.EventSource.call(this, dispatcher, mapping);
  this.pointerMap = dispatcher.pointerMap;
  this.POINTER_TYPES = ["", "unavailable", "touch", "pen", "mouse"];
};
ol.inherits(ol.pointer.MsSource, ol.pointer.EventSource);
ol.pointer.MsSource.prototype.prepareEvent_ = function(inEvent) {
  var e = inEvent;
  if (typeof inEvent.pointerType === "number") {
    e = this.dispatcher.cloneEvent(inEvent, inEvent);
    e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
  }
  return e;
};
ol.pointer.MsSource.prototype.cleanup = function(pointerId) {
  delete this.pointerMap[pointerId.toString()];
};
ol.pointer.MsSource.prototype.msPointerDown = function(inEvent) {
  this.pointerMap[inEvent.pointerId.toString()] = inEvent;
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.down(e, inEvent);
};
ol.pointer.MsSource.prototype.msPointerMove = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.move(e, inEvent);
};
ol.pointer.MsSource.prototype.msPointerUp = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.up(e, inEvent);
  this.cleanup(inEvent.pointerId);
};
ol.pointer.MsSource.prototype.msPointerOut = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.leaveOut(e, inEvent);
};
ol.pointer.MsSource.prototype.msPointerOver = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.enterOver(e, inEvent);
};
ol.pointer.MsSource.prototype.msPointerCancel = function(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.cancel(e, inEvent);
  this.cleanup(inEvent.pointerId);
};
ol.pointer.MsSource.prototype.msLostPointerCapture = function(inEvent) {
  var e = this.dispatcher.makeEvent("lostpointercapture", inEvent, inEvent);
  this.dispatcher.dispatchEvent(e);
};
ol.pointer.MsSource.prototype.msGotPointerCapture = function(inEvent) {
  var e = this.dispatcher.makeEvent("gotpointercapture", inEvent, inEvent);
  this.dispatcher.dispatchEvent(e);
};
goog.provide("ol.pointer.NativeSource");
goog.require("ol");
goog.require("ol.pointer.EventSource");
ol.pointer.NativeSource = function(dispatcher) {
  var mapping = {"pointerdown":this.pointerDown, "pointermove":this.pointerMove, "pointerup":this.pointerUp, "pointerout":this.pointerOut, "pointerover":this.pointerOver, "pointercancel":this.pointerCancel, "gotpointercapture":this.gotPointerCapture, "lostpointercapture":this.lostPointerCapture};
  ol.pointer.EventSource.call(this, dispatcher, mapping);
};
ol.inherits(ol.pointer.NativeSource, ol.pointer.EventSource);
ol.pointer.NativeSource.prototype.pointerDown = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.pointerMove = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.pointerUp = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.pointerOut = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.pointerOver = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.pointerCancel = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.lostPointerCapture = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
ol.pointer.NativeSource.prototype.gotPointerCapture = function(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
};
goog.provide("ol.pointer.PointerEvent");
goog.require("ol");
goog.require("ol.events.Event");
ol.pointer.PointerEvent = function(type, originalEvent, opt_eventDict) {
  ol.events.Event.call(this, type);
  this.originalEvent = originalEvent;
  var eventDict = opt_eventDict ? opt_eventDict : {};
  this.buttons = this.getButtons_(eventDict);
  this.pressure = this.getPressure_(eventDict, this.buttons);
  this.bubbles = "bubbles" in eventDict ? eventDict["bubbles"] : false;
  this.cancelable = "cancelable" in eventDict ? eventDict["cancelable"] : false;
  this.view = "view" in eventDict ? eventDict["view"] : null;
  this.detail = "detail" in eventDict ? eventDict["detail"] : null;
  this.screenX = "screenX" in eventDict ? eventDict["screenX"] : 0;
  this.screenY = "screenY" in eventDict ? eventDict["screenY"] : 0;
  this.clientX = "clientX" in eventDict ? eventDict["clientX"] : 0;
  this.clientY = "clientY" in eventDict ? eventDict["clientY"] : 0;
  this.ctrlKey = "ctrlKey" in eventDict ? eventDict["ctrlKey"] : false;
  this.altKey = "altKey" in eventDict ? eventDict["altKey"] : false;
  this.shiftKey = "shiftKey" in eventDict ? eventDict["shiftKey"] : false;
  this.metaKey = "metaKey" in eventDict ? eventDict["metaKey"] : false;
  this.button = "button" in eventDict ? eventDict["button"] : 0;
  this.relatedTarget = "relatedTarget" in eventDict ? eventDict["relatedTarget"] : null;
  this.pointerId = "pointerId" in eventDict ? eventDict["pointerId"] : 0;
  this.width = "width" in eventDict ? eventDict["width"] : 0;
  this.height = "height" in eventDict ? eventDict["height"] : 0;
  this.tiltX = "tiltX" in eventDict ? eventDict["tiltX"] : 0;
  this.tiltY = "tiltY" in eventDict ? eventDict["tiltY"] : 0;
  this.pointerType = "pointerType" in eventDict ? eventDict["pointerType"] : "";
  this.hwTimestamp = "hwTimestamp" in eventDict ? eventDict["hwTimestamp"] : 0;
  this.isPrimary = "isPrimary" in eventDict ? eventDict["isPrimary"] : false;
  if (originalEvent.preventDefault) {
    this.preventDefault = function() {
      originalEvent.preventDefault();
    };
  }
};
ol.inherits(ol.pointer.PointerEvent, ol.events.Event);
ol.pointer.PointerEvent.prototype.getButtons_ = function(eventDict) {
  var buttons;
  if (eventDict.buttons || ol.pointer.PointerEvent.HAS_BUTTONS) {
    buttons = eventDict.buttons;
  } else {
    switch(eventDict.which) {
      case 1:
        buttons = 1;
        break;
      case 2:
        buttons = 4;
        break;
      case 3:
        buttons = 2;
        break;
      default:
        buttons = 0;
    }
  }
  return buttons;
};
ol.pointer.PointerEvent.prototype.getPressure_ = function(eventDict, buttons) {
  var pressure = 0;
  if (eventDict.pressure) {
    pressure = eventDict.pressure;
  } else {
    pressure = buttons ? .5 : 0;
  }
  return pressure;
};
ol.pointer.PointerEvent.HAS_BUTTONS = false;
(function() {
  try {
    var ev = new MouseEvent("click", {buttons:1});
    ol.pointer.PointerEvent.HAS_BUTTONS = ev.buttons === 1;
  } catch (e) {
  }
})();
goog.provide("ol.pointer.TouchSource");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.pointer.EventSource");
goog.require("ol.pointer.MouseSource");
ol.pointer.TouchSource = function(dispatcher, mouseSource) {
  var mapping = {"touchstart":this.touchstart, "touchmove":this.touchmove, "touchend":this.touchend, "touchcancel":this.touchcancel};
  ol.pointer.EventSource.call(this, dispatcher, mapping);
  this.pointerMap = dispatcher.pointerMap;
  this.mouseSource = mouseSource;
  this.firstTouchId_ = undefined;
  this.clickCount_ = 0;
  this.resetId_ = undefined;
};
ol.inherits(ol.pointer.TouchSource, ol.pointer.EventSource);
ol.pointer.TouchSource.DEDUP_TIMEOUT = 2500;
ol.pointer.TouchSource.CLICK_COUNT_TIMEOUT = 200;
ol.pointer.TouchSource.POINTER_TYPE = "touch";
ol.pointer.TouchSource.prototype.isPrimaryTouch_ = function(inTouch) {
  return this.firstTouchId_ === inTouch.identifier;
};
ol.pointer.TouchSource.prototype.setPrimaryTouch_ = function(inTouch) {
  var count = Object.keys(this.pointerMap).length;
  if (count === 0 || count === 1 && ol.pointer.MouseSource.POINTER_ID.toString() in this.pointerMap) {
    this.firstTouchId_ = inTouch.identifier;
    this.cancelResetClickCount_();
  }
};
ol.pointer.TouchSource.prototype.removePrimaryPointer_ = function(inPointer) {
  if (inPointer.isPrimary) {
    this.firstTouchId_ = undefined;
    this.resetClickCount_();
  }
};
ol.pointer.TouchSource.prototype.resetClickCount_ = function() {
  this.resetId_ = setTimeout(this.resetClickCountHandler_.bind(this), ol.pointer.TouchSource.CLICK_COUNT_TIMEOUT);
};
ol.pointer.TouchSource.prototype.resetClickCountHandler_ = function() {
  this.clickCount_ = 0;
  this.resetId_ = undefined;
};
ol.pointer.TouchSource.prototype.cancelResetClickCount_ = function() {
  if (this.resetId_ !== undefined) {
    clearTimeout(this.resetId_);
  }
};
ol.pointer.TouchSource.prototype.touchToPointer_ = function(browserEvent, inTouch) {
  var e = this.dispatcher.cloneEvent(browserEvent, inTouch);
  e.pointerId = inTouch.identifier + 2;
  e.bubbles = true;
  e.cancelable = true;
  e.detail = this.clickCount_;
  e.button = 0;
  e.buttons = 1;
  e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
  e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
  e.pressure = inTouch.webkitForce || inTouch.force || .5;
  e.isPrimary = this.isPrimaryTouch_(inTouch);
  e.pointerType = ol.pointer.TouchSource.POINTER_TYPE;
  e.clientX = inTouch.clientX;
  e.clientY = inTouch.clientY;
  e.screenX = inTouch.screenX;
  e.screenY = inTouch.screenY;
  return e;
};
ol.pointer.TouchSource.prototype.processTouches_ = function(inEvent, inFunction) {
  var touches = Array.prototype.slice.call(inEvent.changedTouches);
  var count = touches.length;
  function preventDefault() {
    inEvent.preventDefault();
  }
  var i, pointer;
  for (i = 0;i < count;++i) {
    pointer = this.touchToPointer_(inEvent, touches[i]);
    pointer.preventDefault = preventDefault;
    inFunction.call(this, inEvent, pointer);
  }
};
ol.pointer.TouchSource.prototype.findTouch_ = function(touchList, searchId) {
  var l = touchList.length;
  var touch;
  for (var i = 0;i < l;i++) {
    touch = touchList[i];
    if (touch.identifier === searchId) {
      return true;
    }
  }
  return false;
};
ol.pointer.TouchSource.prototype.vacuumTouches_ = function(inEvent) {
  var touchList = inEvent.touches;
  var keys = Object.keys(this.pointerMap);
  var count = keys.length;
  if (count >= touchList.length) {
    var d = [];
    var i, key, value;
    for (i = 0;i < count;++i) {
      key = keys[i];
      value = this.pointerMap[key];
      if (key != ol.pointer.MouseSource.POINTER_ID && !this.findTouch_(touchList, key - 2)) {
        d.push(value.out);
      }
    }
    for (i = 0;i < d.length;++i) {
      this.cancelOut_(inEvent, d[i]);
    }
  }
};
ol.pointer.TouchSource.prototype.touchstart = function(inEvent) {
  this.vacuumTouches_(inEvent);
  this.setPrimaryTouch_(inEvent.changedTouches[0]);
  this.dedupSynthMouse_(inEvent);
  this.clickCount_++;
  this.processTouches_(inEvent, this.overDown_);
};
ol.pointer.TouchSource.prototype.overDown_ = function(browserEvent, inPointer) {
  this.pointerMap[inPointer.pointerId] = {target:inPointer.target, out:inPointer, outTarget:inPointer.target};
  this.dispatcher.over(inPointer, browserEvent);
  this.dispatcher.enter(inPointer, browserEvent);
  this.dispatcher.down(inPointer, browserEvent);
};
ol.pointer.TouchSource.prototype.touchmove = function(inEvent) {
  inEvent.preventDefault();
  this.processTouches_(inEvent, this.moveOverOut_);
};
ol.pointer.TouchSource.prototype.moveOverOut_ = function(browserEvent, inPointer) {
  var event = inPointer;
  var pointer = this.pointerMap[event.pointerId];
  if (!pointer) {
    return;
  }
  var outEvent = pointer.out;
  var outTarget = pointer.outTarget;
  this.dispatcher.move(event, browserEvent);
  if (outEvent && outTarget !== event.target) {
    outEvent.relatedTarget = event.target;
    event.relatedTarget = outTarget;
    outEvent.target = outTarget;
    if (event.target) {
      this.dispatcher.leaveOut(outEvent, browserEvent);
      this.dispatcher.enterOver(event, browserEvent);
    } else {
      event.target = outTarget;
      event.relatedTarget = null;
      this.cancelOut_(browserEvent, event);
    }
  }
  pointer.out = event;
  pointer.outTarget = event.target;
};
ol.pointer.TouchSource.prototype.touchend = function(inEvent) {
  this.dedupSynthMouse_(inEvent);
  this.processTouches_(inEvent, this.upOut_);
};
ol.pointer.TouchSource.prototype.upOut_ = function(browserEvent, inPointer) {
  this.dispatcher.up(inPointer, browserEvent);
  this.dispatcher.out(inPointer, browserEvent);
  this.dispatcher.leave(inPointer, browserEvent);
  this.cleanUpPointer_(inPointer);
};
ol.pointer.TouchSource.prototype.touchcancel = function(inEvent) {
  this.processTouches_(inEvent, this.cancelOut_);
};
ol.pointer.TouchSource.prototype.cancelOut_ = function(browserEvent, inPointer) {
  this.dispatcher.cancel(inPointer, browserEvent);
  this.dispatcher.out(inPointer, browserEvent);
  this.dispatcher.leave(inPointer, browserEvent);
  this.cleanUpPointer_(inPointer);
};
ol.pointer.TouchSource.prototype.cleanUpPointer_ = function(inPointer) {
  delete this.pointerMap[inPointer.pointerId];
  this.removePrimaryPointer_(inPointer);
};
ol.pointer.TouchSource.prototype.dedupSynthMouse_ = function(inEvent) {
  var lts = this.mouseSource.lastTouches;
  var t = inEvent.changedTouches[0];
  if (this.isPrimaryTouch_(t)) {
    var lt = [t.clientX, t.clientY];
    lts.push(lt);
    setTimeout(function() {
      ol.array.remove(lts, lt);
    }, ol.pointer.TouchSource.DEDUP_TIMEOUT);
  }
};
goog.provide("ol.pointer.PointerEventHandler");
goog.require("ol");
goog.require("ol.events");
goog.require("ol.events.EventTarget");
goog.require("ol.has");
goog.require("ol.pointer.EventType");
goog.require("ol.pointer.MouseSource");
goog.require("ol.pointer.MsSource");
goog.require("ol.pointer.NativeSource");
goog.require("ol.pointer.PointerEvent");
goog.require("ol.pointer.TouchSource");
ol.pointer.PointerEventHandler = function(element) {
  ol.events.EventTarget.call(this);
  this.element_ = element;
  this.pointerMap = {};
  this.eventMap_ = {};
  this.eventSourceList_ = [];
  this.registerSources();
};
ol.inherits(ol.pointer.PointerEventHandler, ol.events.EventTarget);
ol.pointer.PointerEventHandler.prototype.registerSources = function() {
  if (ol.has.POINTER) {
    this.registerSource("native", new ol.pointer.NativeSource(this));
  } else {
    if (ol.has.MSPOINTER) {
      this.registerSource("ms", new ol.pointer.MsSource(this));
    } else {
      var mouseSource = new ol.pointer.MouseSource(this);
      this.registerSource("mouse", mouseSource);
      if (ol.has.TOUCH) {
        this.registerSource("touch", new ol.pointer.TouchSource(this, mouseSource));
      }
    }
  }
  this.register_();
};
ol.pointer.PointerEventHandler.prototype.registerSource = function(name, source) {
  var s = source;
  var newEvents = s.getEvents();
  if (newEvents) {
    newEvents.forEach(function(e) {
      var handler = s.getHandlerForEvent(e);
      if (handler) {
        this.eventMap_[e] = handler.bind(s);
      }
    }, this);
    this.eventSourceList_.push(s);
  }
};
ol.pointer.PointerEventHandler.prototype.register_ = function() {
  var l = this.eventSourceList_.length;
  var eventSource;
  for (var i = 0;i < l;i++) {
    eventSource = this.eventSourceList_[i];
    this.addEvents_(eventSource.getEvents());
  }
};
ol.pointer.PointerEventHandler.prototype.unregister_ = function() {
  var l = this.eventSourceList_.length;
  var eventSource;
  for (var i = 0;i < l;i++) {
    eventSource = this.eventSourceList_[i];
    this.removeEvents_(eventSource.getEvents());
  }
};
ol.pointer.PointerEventHandler.prototype.eventHandler_ = function(inEvent) {
  var type = inEvent.type;
  var handler = this.eventMap_[type];
  if (handler) {
    handler(inEvent);
  }
};
ol.pointer.PointerEventHandler.prototype.addEvents_ = function(events) {
  events.forEach(function(eventName) {
    ol.events.listen(this.element_, eventName, this.eventHandler_, this);
  }, this);
};
ol.pointer.PointerEventHandler.prototype.removeEvents_ = function(events) {
  events.forEach(function(e) {
    ol.events.unlisten(this.element_, e, this.eventHandler_, this);
  }, this);
};
ol.pointer.PointerEventHandler.prototype.cloneEvent = function(event, inEvent) {
  var eventCopy = {}, p;
  for (var i = 0, ii = ol.pointer.CLONE_PROPS.length;i < ii;i++) {
    p = ol.pointer.CLONE_PROPS[i][0];
    eventCopy[p] = event[p] || inEvent[p] || ol.pointer.CLONE_PROPS[i][1];
  }
  return eventCopy;
};
ol.pointer.PointerEventHandler.prototype.down = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERDOWN, data, event);
};
ol.pointer.PointerEventHandler.prototype.move = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERMOVE, data, event);
};
ol.pointer.PointerEventHandler.prototype.up = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERUP, data, event);
};
ol.pointer.PointerEventHandler.prototype.enter = function(data, event) {
  data.bubbles = false;
  this.fireEvent(ol.pointer.EventType.POINTERENTER, data, event);
};
ol.pointer.PointerEventHandler.prototype.leave = function(data, event) {
  data.bubbles = false;
  this.fireEvent(ol.pointer.EventType.POINTERLEAVE, data, event);
};
ol.pointer.PointerEventHandler.prototype.over = function(data, event) {
  data.bubbles = true;
  this.fireEvent(ol.pointer.EventType.POINTEROVER, data, event);
};
ol.pointer.PointerEventHandler.prototype.out = function(data, event) {
  data.bubbles = true;
  this.fireEvent(ol.pointer.EventType.POINTEROUT, data, event);
};
ol.pointer.PointerEventHandler.prototype.cancel = function(data, event) {
  this.fireEvent(ol.pointer.EventType.POINTERCANCEL, data, event);
};
ol.pointer.PointerEventHandler.prototype.leaveOut = function(data, event) {
  this.out(data, event);
  if (!this.contains_(data.target, data.relatedTarget)) {
    this.leave(data, event);
  }
};
ol.pointer.PointerEventHandler.prototype.enterOver = function(data, event) {
  this.over(data, event);
  if (!this.contains_(data.target, data.relatedTarget)) {
    this.enter(data, event);
  }
};
ol.pointer.PointerEventHandler.prototype.contains_ = function(container, contained) {
  if (!container || !contained) {
    return false;
  }
  return container.contains(contained);
};
ol.pointer.PointerEventHandler.prototype.makeEvent = function(inType, data, event) {
  return new ol.pointer.PointerEvent(inType, event, data);
};
ol.pointer.PointerEventHandler.prototype.fireEvent = function(inType, data, event) {
  var e = this.makeEvent(inType, data, event);
  this.dispatchEvent(e);
};
ol.pointer.PointerEventHandler.prototype.fireNativeEvent = function(event) {
  var e = this.makeEvent(event.type, event, event);
  this.dispatchEvent(e);
};
ol.pointer.PointerEventHandler.prototype.wrapMouseEvent = function(eventType, event) {
  var pointerEvent = this.makeEvent(eventType, ol.pointer.MouseSource.prepareEvent(event, this), event);
  return pointerEvent;
};
ol.pointer.PointerEventHandler.prototype.disposeInternal = function() {
  this.unregister_();
  ol.events.EventTarget.prototype.disposeInternal.call(this);
};
ol.pointer.CLONE_PROPS = [["bubbles", false], ["cancelable", false], ["view", null], ["detail", null], ["screenX", 0], ["screenY", 0], ["clientX", 0], ["clientY", 0], ["ctrlKey", false], ["altKey", false], ["shiftKey", false], ["metaKey", false], ["button", 0], ["relatedTarget", null], ["buttons", 0], ["pointerId", 0], ["width", 0], ["height", 0], ["pressure", 0], ["tiltX", 0], ["tiltY", 0], ["pointerType", ""], ["hwTimestamp", 0], ["isPrimary", false], ["type", ""], ["target", null], ["currentTarget", 
null], ["which", 0]];
goog.provide("ol.MapBrowserEvent");
goog.provide("ol.MapBrowserEvent.EventType");
goog.provide("ol.MapBrowserEventHandler");
goog.provide("ol.MapBrowserPointerEvent");
goog.require("ol");
goog.require("ol.MapEvent");
goog.require("ol.events");
goog.require("ol.events.EventTarget");
goog.require("ol.events.EventType");
goog.require("ol.pointer.EventType");
goog.require("ol.pointer.PointerEventHandler");
ol.MapBrowserEvent = function(type, map, browserEvent, opt_dragging, opt_frameState) {
  ol.MapEvent.call(this, type, map, opt_frameState);
  this.originalEvent = browserEvent;
  this.pixel = map.getEventPixel(browserEvent);
  this.coordinate = map.getCoordinateFromPixel(this.pixel);
  this.dragging = opt_dragging !== undefined ? opt_dragging : false;
};
ol.inherits(ol.MapBrowserEvent, ol.MapEvent);
ol.MapBrowserEvent.prototype.preventDefault = function() {
  ol.MapEvent.prototype.preventDefault.call(this);
  this.originalEvent.preventDefault();
};
ol.MapBrowserEvent.prototype.stopPropagation = function() {
  ol.MapEvent.prototype.stopPropagation.call(this);
  this.originalEvent.stopPropagation();
};
ol.MapBrowserPointerEvent = function(type, map, pointerEvent, opt_dragging, opt_frameState) {
  ol.MapBrowserEvent.call(this, type, map, pointerEvent.originalEvent, opt_dragging, opt_frameState);
  this.pointerEvent = pointerEvent;
};
ol.inherits(ol.MapBrowserPointerEvent, ol.MapBrowserEvent);
ol.MapBrowserEventHandler = function(map) {
  ol.events.EventTarget.call(this);
  this.map_ = map;
  this.clickTimeoutId_ = 0;
  this.dragging_ = false;
  this.dragListenerKeys_ = [];
  this.down_ = null;
  var element = this.map_.getViewport();
  this.activePointers_ = 0;
  this.trackedTouches_ = {};
  this.pointerEventHandler_ = new ol.pointer.PointerEventHandler(element);
  this.documentPointerEventHandler_ = null;
  this.pointerdownListenerKey_ = ol.events.listen(this.pointerEventHandler_, ol.pointer.EventType.POINTERDOWN, this.handlePointerDown_, this);
  this.relayedListenerKey_ = ol.events.listen(this.pointerEventHandler_, ol.pointer.EventType.POINTERMOVE, this.relayEvent_, this);
};
ol.inherits(ol.MapBrowserEventHandler, ol.events.EventTarget);
ol.MapBrowserEventHandler.prototype.emulateClick_ = function(pointerEvent) {
  var newEvent = new ol.MapBrowserPointerEvent(ol.MapBrowserEvent.EventType.CLICK, this.map_, pointerEvent);
  this.dispatchEvent(newEvent);
  if (this.clickTimeoutId_ !== 0) {
    clearTimeout(this.clickTimeoutId_);
    this.clickTimeoutId_ = 0;
    newEvent = new ol.MapBrowserPointerEvent(ol.MapBrowserEvent.EventType.DBLCLICK, this.map_, pointerEvent);
    this.dispatchEvent(newEvent);
  } else {
    this.clickTimeoutId_ = setTimeout(function() {
      this.clickTimeoutId_ = 0;
      var newEvent = new ol.MapBrowserPointerEvent(ol.MapBrowserEvent.EventType.SINGLECLICK, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);
    }.bind(this), 250);
  }
};
ol.MapBrowserEventHandler.prototype.updateActivePointers_ = function(pointerEvent) {
  var event = pointerEvent;
  if (event.type == ol.MapBrowserEvent.EventType.POINTERUP || event.type == ol.MapBrowserEvent.EventType.POINTERCANCEL) {
    delete this.trackedTouches_[event.pointerId];
  } else {
    if (event.type == ol.MapBrowserEvent.EventType.POINTERDOWN) {
      this.trackedTouches_[event.pointerId] = true;
    }
  }
  this.activePointers_ = Object.keys(this.trackedTouches_).length;
};
ol.MapBrowserEventHandler.prototype.handlePointerUp_ = function(pointerEvent) {
  this.updateActivePointers_(pointerEvent);
  var newEvent = new ol.MapBrowserPointerEvent(ol.MapBrowserEvent.EventType.POINTERUP, this.map_, pointerEvent);
  this.dispatchEvent(newEvent);
  if (!this.dragging_ && this.isMouseActionButton_(pointerEvent)) {
    ol.DEBUG && console.assert(this.down_, "this.down_ must be truthy");
    this.emulateClick_(this.down_);
  }
  ol.DEBUG && console.assert(this.activePointers_ >= 0, "this.activePointers_ should be equal to or larger than 0");
  if (this.activePointers_ === 0) {
    this.dragListenerKeys_.forEach(ol.events.unlistenByKey);
    this.dragListenerKeys_.length = 0;
    this.dragging_ = false;
    this.down_ = null;
    this.documentPointerEventHandler_.dispose();
    this.documentPointerEventHandler_ = null;
  }
};
ol.MapBrowserEventHandler.prototype.isMouseActionButton_ = function(pointerEvent) {
  return pointerEvent.button === 0;
};
ol.MapBrowserEventHandler.prototype.handlePointerDown_ = function(pointerEvent) {
  this.updateActivePointers_(pointerEvent);
  var newEvent = new ol.MapBrowserPointerEvent(ol.MapBrowserEvent.EventType.POINTERDOWN, this.map_, pointerEvent);
  this.dispatchEvent(newEvent);
  this.down_ = pointerEvent;
  if (this.dragListenerKeys_.length === 0) {
    this.documentPointerEventHandler_ = new ol.pointer.PointerEventHandler(document);
    this.dragListenerKeys_.push(ol.events.listen(this.documentPointerEventHandler_, ol.MapBrowserEvent.EventType.POINTERMOVE, this.handlePointerMove_, this), ol.events.listen(this.documentPointerEventHandler_, ol.MapBrowserEvent.EventType.POINTERUP, this.handlePointerUp_, this), ol.events.listen(this.pointerEventHandler_, ol.MapBrowserEvent.EventType.POINTERCANCEL, this.handlePointerUp_, this));
  }
};
ol.MapBrowserEventHandler.prototype.handlePointerMove_ = function(pointerEvent) {
  if (this.isMoving_(pointerEvent)) {
    this.dragging_ = true;
    var newEvent = new ol.MapBrowserPointerEvent(ol.MapBrowserEvent.EventType.POINTERDRAG, this.map_, pointerEvent, this.dragging_);
    this.dispatchEvent(newEvent);
  }
  pointerEvent.preventDefault();
};
ol.MapBrowserEventHandler.prototype.relayEvent_ = function(pointerEvent) {
  var dragging = !!(this.down_ && this.isMoving_(pointerEvent));
  this.dispatchEvent(new ol.MapBrowserPointerEvent(pointerEvent.type, this.map_, pointerEvent, dragging));
};
ol.MapBrowserEventHandler.prototype.isMoving_ = function(pointerEvent) {
  return pointerEvent.clientX != this.down_.clientX || pointerEvent.clientY != this.down_.clientY;
};
ol.MapBrowserEventHandler.prototype.disposeInternal = function() {
  if (this.relayedListenerKey_) {
    ol.events.unlistenByKey(this.relayedListenerKey_);
    this.relayedListenerKey_ = null;
  }
  if (this.pointerdownListenerKey_) {
    ol.events.unlistenByKey(this.pointerdownListenerKey_);
    this.pointerdownListenerKey_ = null;
  }
  this.dragListenerKeys_.forEach(ol.events.unlistenByKey);
  this.dragListenerKeys_.length = 0;
  if (this.documentPointerEventHandler_) {
    this.documentPointerEventHandler_.dispose();
    this.documentPointerEventHandler_ = null;
  }
  if (this.pointerEventHandler_) {
    this.pointerEventHandler_.dispose();
    this.pointerEventHandler_ = null;
  }
  ol.events.EventTarget.prototype.disposeInternal.call(this);
};
ol.MapBrowserEvent.EventType = {SINGLECLICK:"singleclick", CLICK:ol.events.EventType.CLICK, DBLCLICK:ol.events.EventType.DBLCLICK, POINTERDRAG:"pointerdrag", POINTERMOVE:"pointermove", POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", POINTERCANCEL:"pointercancel"};
goog.provide("ol.structs.PriorityQueue");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.obj");
ol.structs.PriorityQueue = function(priorityFunction, keyFunction) {
  this.priorityFunction_ = priorityFunction;
  this.keyFunction_ = keyFunction;
  this.elements_ = [];
  this.priorities_ = [];
  this.queuedElements_ = {};
};
ol.structs.PriorityQueue.DROP = Infinity;
if (ol.DEBUG) {
  ol.structs.PriorityQueue.prototype.assertValid = function() {
    var elements = this.elements_;
    var priorities = this.priorities_;
    var n = elements.length;
    console.assert(priorities.length == n);
    var i, priority;
    for (i = 0;i < (n >> 1) - 1;++i) {
      priority = priorities[i];
      console.assert(priority <= priorities[this.getLeftChildIndex_(i)], "priority smaller than or equal to priority of left child (%s <= %s)", priority, priorities[this.getLeftChildIndex_(i)]);
      console.assert(priority <= priorities[this.getRightChildIndex_(i)], "priority smaller than or equal to priority of right child (%s <= %s)", priority, priorities[this.getRightChildIndex_(i)]);
    }
  };
}
ol.structs.PriorityQueue.prototype.clear = function() {
  this.elements_.length = 0;
  this.priorities_.length = 0;
  ol.obj.clear(this.queuedElements_);
};
ol.structs.PriorityQueue.prototype.dequeue = function() {
  var elements = this.elements_;
  ol.DEBUG && console.assert(elements.length > 0, "must have elements in order to be able to dequeue");
  var priorities = this.priorities_;
  var element = elements[0];
  if (elements.length == 1) {
    elements.length = 0;
    priorities.length = 0;
  } else {
    elements[0] = elements.pop();
    priorities[0] = priorities.pop();
    this.siftUp_(0);
  }
  var elementKey = this.keyFunction_(element);
  ol.DEBUG && console.assert(elementKey in this.queuedElements_, "key %s is not listed as queued", elementKey);
  delete this.queuedElements_[elementKey];
  return element;
};
ol.structs.PriorityQueue.prototype.enqueue = function(element) {
  ol.asserts.assert(!(this.keyFunction_(element) in this.queuedElements_), 31);
  var priority = this.priorityFunction_(element);
  if (priority != ol.structs.PriorityQueue.DROP) {
    this.elements_.push(element);
    this.priorities_.push(priority);
    this.queuedElements_[this.keyFunction_(element)] = true;
    this.siftDown_(0, this.elements_.length - 1);
    return true;
  }
  return false;
};
ol.structs.PriorityQueue.prototype.getCount = function() {
  return this.elements_.length;
};
ol.structs.PriorityQueue.prototype.getLeftChildIndex_ = function(index) {
  return index * 2 + 1;
};
ol.structs.PriorityQueue.prototype.getRightChildIndex_ = function(index) {
  return index * 2 + 2;
};
ol.structs.PriorityQueue.prototype.getParentIndex_ = function(index) {
  return index - 1 >> 1;
};
ol.structs.PriorityQueue.prototype.heapify_ = function() {
  var i;
  for (i = (this.elements_.length >> 1) - 1;i >= 0;i--) {
    this.siftUp_(i);
  }
};
ol.structs.PriorityQueue.prototype.isEmpty = function() {
  return this.elements_.length === 0;
};
ol.structs.PriorityQueue.prototype.isKeyQueued = function(key) {
  return key in this.queuedElements_;
};
ol.structs.PriorityQueue.prototype.isQueued = function(element) {
  return this.isKeyQueued(this.keyFunction_(element));
};
ol.structs.PriorityQueue.prototype.siftUp_ = function(index) {
  var elements = this.elements_;
  var priorities = this.priorities_;
  var count = elements.length;
  var element = elements[index];
  var priority = priorities[index];
  var startIndex = index;
  while (index < count >> 1) {
    var lIndex = this.getLeftChildIndex_(index);
    var rIndex = this.getRightChildIndex_(index);
    var smallerChildIndex = rIndex < count && priorities[rIndex] < priorities[lIndex] ? rIndex : lIndex;
    elements[index] = elements[smallerChildIndex];
    priorities[index] = priorities[smallerChildIndex];
    index = smallerChildIndex;
  }
  elements[index] = element;
  priorities[index] = priority;
  this.siftDown_(startIndex, index);
};
ol.structs.PriorityQueue.prototype.siftDown_ = function(startIndex, index) {
  var elements = this.elements_;
  var priorities = this.priorities_;
  var element = elements[index];
  var priority = priorities[index];
  while (index > startIndex) {
    var parentIndex = this.getParentIndex_(index);
    if (priorities[parentIndex] > priority) {
      elements[index] = elements[parentIndex];
      priorities[index] = priorities[parentIndex];
      index = parentIndex;
    } else {
      break;
    }
  }
  elements[index] = element;
  priorities[index] = priority;
};
ol.structs.PriorityQueue.prototype.reprioritize = function() {
  var priorityFunction = this.priorityFunction_;
  var elements = this.elements_;
  var priorities = this.priorities_;
  var index = 0;
  var n = elements.length;
  var element, i, priority;
  for (i = 0;i < n;++i) {
    element = elements[i];
    priority = priorityFunction(element);
    if (priority == ol.structs.PriorityQueue.DROP) {
      delete this.queuedElements_[this.keyFunction_(element)];
    } else {
      priorities[index] = priority;
      elements[index++] = element;
    }
  }
  elements.length = index;
  priorities.length = index;
  this.heapify_();
};
goog.provide("ol.TileQueue");
goog.require("ol");
goog.require("ol.Tile");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.structs.PriorityQueue");
ol.TileQueue = function(tilePriorityFunction, tileChangeCallback) {
  ol.structs.PriorityQueue.call(this, function(element) {
    return tilePriorityFunction.apply(null, element);
  }, function(element) {
    return (element[0]).getKey();
  });
  this.tileChangeCallback_ = tileChangeCallback;
  this.tilesLoading_ = 0;
  this.tilesLoadingKeys_ = {};
};
ol.inherits(ol.TileQueue, ol.structs.PriorityQueue);
ol.TileQueue.prototype.enqueue = function(element) {
  var added = ol.structs.PriorityQueue.prototype.enqueue.call(this, element);
  if (added) {
    var tile = element[0];
    ol.events.listen(tile, ol.events.EventType.CHANGE, this.handleTileChange, this);
  }
  return added;
};
ol.TileQueue.prototype.getTilesLoading = function() {
  return this.tilesLoading_;
};
ol.TileQueue.prototype.handleTileChange = function(event) {
  var tile = (event.target);
  var state = tile.getState();
  if (state === ol.Tile.State.LOADED || state === ol.Tile.State.ERROR || state === ol.Tile.State.EMPTY || state === ol.Tile.State.ABORT) {
    ol.events.unlisten(tile, ol.events.EventType.CHANGE, this.handleTileChange, this);
    var tileKey = tile.getKey();
    if (tileKey in this.tilesLoadingKeys_) {
      delete this.tilesLoadingKeys_[tileKey];
      --this.tilesLoading_;
    }
    this.tileChangeCallback_();
  }
  ol.DEBUG && console.assert(Object.keys(this.tilesLoadingKeys_).length === this.tilesLoading_);
};
ol.TileQueue.prototype.loadMoreTiles = function(maxTotalLoading, maxNewLoads) {
  var newLoads = 0;
  var tile, tileKey;
  while (this.tilesLoading_ < maxTotalLoading && newLoads < maxNewLoads && this.getCount() > 0) {
    tile = (this.dequeue()[0]);
    tileKey = tile.getKey();
    if (tile.getState() === ol.Tile.State.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
      this.tilesLoadingKeys_[tileKey] = true;
      ++this.tilesLoading_;
      ++newLoads;
      tile.load();
    }
    ol.DEBUG && console.assert(Object.keys(this.tilesLoadingKeys_).length === this.tilesLoading_);
  }
};
goog.provide("ol.CenterConstraint");
goog.require("ol.math");
ol.CenterConstraint.createExtent = function(extent) {
  return function(center) {
    if (center) {
      return [ol.math.clamp(center[0], extent[0], extent[2]), ol.math.clamp(center[1], extent[1], extent[3])];
    } else {
      return undefined;
    }
  };
};
ol.CenterConstraint.none = function(center) {
  return center;
};
goog.provide("ol.Constraints");
ol.Constraints = function(centerConstraint, resolutionConstraint, rotationConstraint) {
  this.center = centerConstraint;
  this.resolution = resolutionConstraint;
  this.rotation = rotationConstraint;
};
goog.provide("ol.ResolutionConstraint");
goog.require("ol.array");
goog.require("ol.math");
ol.ResolutionConstraint.createSnapToResolutions = function(resolutions) {
  return function(resolution, delta, direction) {
    if (resolution !== undefined) {
      var z = ol.array.linearFindNearest(resolutions, resolution, direction);
      z = ol.math.clamp(z + delta, 0, resolutions.length - 1);
      var index = Math.floor(z);
      if (z != index && index < resolutions.length - 1) {
        var power = resolutions[index] / resolutions[index + 1];
        return resolutions[index] / Math.pow(power, z - index);
      } else {
        return resolutions[index];
      }
    } else {
      return undefined;
    }
  };
};
ol.ResolutionConstraint.createSnapToPower = function(power, maxResolution, opt_maxLevel) {
  return function(resolution, delta, direction) {
    if (resolution !== undefined) {
      var offset = -direction / 2 + .5;
      var oldLevel = Math.floor(Math.log(maxResolution / resolution) / Math.log(power) + offset);
      var newLevel = Math.max(oldLevel + delta, 0);
      if (opt_maxLevel !== undefined) {
        newLevel = Math.min(newLevel, opt_maxLevel);
      }
      return maxResolution / Math.pow(power, newLevel);
    } else {
      return undefined;
    }
  };
};
goog.provide("ol.RotationConstraint");
goog.require("ol.math");
ol.RotationConstraint.disable = function(rotation, delta) {
  if (rotation !== undefined) {
    return 0;
  } else {
    return undefined;
  }
};
ol.RotationConstraint.none = function(rotation, delta) {
  if (rotation !== undefined) {
    return rotation + delta;
  } else {
    return undefined;
  }
};
ol.RotationConstraint.createSnapToN = function(n) {
  var theta = 2 * Math.PI / n;
  return function(rotation, delta) {
    if (rotation !== undefined) {
      rotation = Math.floor((rotation + delta) / theta + .5) * theta;
      return rotation;
    } else {
      return undefined;
    }
  };
};
ol.RotationConstraint.createSnapToZero = function(opt_tolerance) {
  var tolerance = opt_tolerance || ol.math.toRadians(5);
  return function(rotation, delta) {
    if (rotation !== undefined) {
      if (Math.abs(rotation + delta) <= tolerance) {
        return 0;
      } else {
        return rotation + delta;
      }
    } else {
      return undefined;
    }
  };
};
goog.provide("ol.string");
ol.string.padNumber = function(number, width, opt_precision) {
  var numberString = opt_precision !== undefined ? number.toFixed(opt_precision) : "" + number;
  var decimal = numberString.indexOf(".");
  decimal = decimal === -1 ? numberString.length : decimal;
  return decimal > width ? numberString : (new Array(1 + width - decimal)).join("0") + numberString;
};
ol.string.compareVersions = function(v1, v2) {
  var s1 = ("" + v1).split(".");
  var s2 = ("" + v2).split(".");
  for (var i = 0;i < Math.max(s1.length, s2.length);i++) {
    var n1 = parseInt(s1[i] || "0", 10);
    var n2 = parseInt(s2[i] || "0", 10);
    if (n1 > n2) {
      return 1;
    }
    if (n2 > n1) {
      return -1;
    }
  }
  return 0;
};
goog.provide("ol.coordinate");
goog.require("ol.math");
goog.require("ol.string");
ol.coordinate.add = function(coordinate, delta) {
  coordinate[0] += delta[0];
  coordinate[1] += delta[1];
  return coordinate;
};
ol.coordinate.closestOnSegment = function(coordinate, segment) {
  var x0 = coordinate[0];
  var y0 = coordinate[1];
  var start = segment[0];
  var end = segment[1];
  var x1 = start[0];
  var y1 = start[1];
  var x2 = end[0];
  var y2 = end[1];
  var dx = x2 - x1;
  var dy = y2 - y1;
  var along = dx === 0 && dy === 0 ? 0 : (dx * (x0 - x1) + dy * (y0 - y1)) / (dx * dx + dy * dy || 0);
  var x, y;
  if (along <= 0) {
    x = x1;
    y = y1;
  } else {
    if (along >= 1) {
      x = x2;
      y = y2;
    } else {
      x = x1 + along * dx;
      y = y1 + along * dy;
    }
  }
  return [x, y];
};
ol.coordinate.createStringXY = function(opt_fractionDigits) {
  return function(coordinate) {
    return ol.coordinate.toStringXY(coordinate, opt_fractionDigits);
  };
};
ol.coordinate.degreesToStringHDMS_ = function(degrees, hemispheres, opt_fractionDigits) {
  var normalizedDegrees = ol.math.modulo(degrees + 180, 360) - 180;
  var x = Math.abs(3600 * normalizedDegrees);
  var dflPrecision = opt_fractionDigits || 0;
  return Math.floor(x / 3600) + "\u00b0 " + ol.string.padNumber(Math.floor(x / 60 % 60), 2) + "\u2032 " + ol.string.padNumber(x % 60, 2, dflPrecision) + "\u2033 " + hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0);
};
ol.coordinate.format = function(coordinate, template, opt_fractionDigits) {
  if (coordinate) {
    return template.replace("{x}", coordinate[0].toFixed(opt_fractionDigits)).replace("{y}", coordinate[1].toFixed(opt_fractionDigits));
  } else {
    return "";
  }
};
ol.coordinate.equals = function(coordinate1, coordinate2) {
  var equals = true;
  for (var i = coordinate1.length - 1;i >= 0;--i) {
    if (coordinate1[i] != coordinate2[i]) {
      equals = false;
      break;
    }
  }
  return equals;
};
ol.coordinate.rotate = function(coordinate, angle) {
  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var x = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  var y = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  coordinate[0] = x;
  coordinate[1] = y;
  return coordinate;
};
ol.coordinate.scale = function(coordinate, scale) {
  coordinate[0] *= scale;
  coordinate[1] *= scale;
  return coordinate;
};
ol.coordinate.sub = function(coordinate, delta) {
  coordinate[0] -= delta[0];
  coordinate[1] -= delta[1];
  return coordinate;
};
ol.coordinate.squaredDistance = function(coord1, coord2) {
  var dx = coord1[0] - coord2[0];
  var dy = coord1[1] - coord2[1];
  return dx * dx + dy * dy;
};
ol.coordinate.squaredDistanceToSegment = function(coordinate, segment) {
  return ol.coordinate.squaredDistance(coordinate, ol.coordinate.closestOnSegment(coordinate, segment));
};
ol.coordinate.toStringHDMS = function(coordinate, opt_fractionDigits) {
  if (coordinate) {
    return ol.coordinate.degreesToStringHDMS_(coordinate[1], "NS", opt_fractionDigits) + " " + ol.coordinate.degreesToStringHDMS_(coordinate[0], "EW", opt_fractionDigits);
  } else {
    return "";
  }
};
ol.coordinate.toStringXY = function(coordinate, opt_fractionDigits) {
  return ol.coordinate.format(coordinate, "{x}, {y}", opt_fractionDigits);
};
goog.provide("ol.easing");
ol.easing.easeIn = function(t) {
  return Math.pow(t, 3);
};
ol.easing.easeOut = function(t) {
  return 1 - ol.easing.easeIn(1 - t);
};
ol.easing.inAndOut = function(t) {
  return 3 * t * t - 2 * t * t * t;
};
ol.easing.linear = function(t) {
  return t;
};
ol.easing.upAndDown = function(t) {
  if (t < .5) {
    return ol.easing.inAndOut(2 * t);
  } else {
    return 1 - ol.easing.inAndOut(2 * (t - .5));
  }
};
goog.provide("ol.geom.flat.area");
ol.geom.flat.area.linearRing = function(flatCoordinates, offset, end, stride) {
  var twiceArea = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (;offset < end;offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    twiceArea += y1 * x2 - x1 * y2;
    x1 = x2;
    y1 = y2;
  }
  return twiceArea / 2;
};
ol.geom.flat.area.linearRings = function(flatCoordinates, offset, ends, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    area += ol.geom.flat.area.linearRing(flatCoordinates, offset, end, stride);
    offset = end;
  }
  return area;
};
ol.geom.flat.area.linearRingss = function(flatCoordinates, offset, endss, stride) {
  var area = 0;
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    area += ol.geom.flat.area.linearRings(flatCoordinates, offset, ends, stride);
    offset = ends[ends.length - 1];
  }
  return area;
};
goog.provide("ol.geom.LinearRing");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.area");
goog.require("ol.geom.flat.closest");
goog.require("ol.geom.flat.deflate");
goog.require("ol.geom.flat.inflate");
goog.require("ol.geom.flat.simplify");
ol.geom.LinearRing = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.maxDelta_ = -1;
  this.maxDeltaRevision_ = -1;
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.LinearRing, ol.geom.SimpleGeometry);
ol.geom.LinearRing.prototype.clone = function() {
  var linearRing = new ol.geom.LinearRing(null);
  linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return linearRing;
};
ol.geom.LinearRing.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getMaxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};
ol.geom.LinearRing.prototype.getArea = function() {
  return ol.geom.flat.area.linearRing(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};
ol.geom.LinearRing.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};
ol.geom.LinearRing.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
  var simplifiedLinearRing = new ol.geom.LinearRing(null);
  simplifiedLinearRing.setFlatCoordinates(ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates);
  return simplifiedLinearRing;
};
ol.geom.LinearRing.prototype.getType = function() {
  return ol.geom.GeometryType.LINEAR_RING;
};
ol.geom.LinearRing.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};
ol.geom.LinearRing.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};
goog.provide("ol.geom.Point");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.deflate");
goog.require("ol.math");
ol.geom.Point = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.Point, ol.geom.SimpleGeometry);
ol.geom.Point.prototype.clone = function() {
  var point = new ol.geom.Point(null);
  point.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return point;
};
ol.geom.Point.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  var flatCoordinates = this.flatCoordinates;
  var squaredDistance = ol.math.squaredDistance(x, y, flatCoordinates[0], flatCoordinates[1]);
  if (squaredDistance < minSquaredDistance) {
    var stride = this.stride;
    var i;
    for (i = 0;i < stride;++i) {
      closestPoint[i] = flatCoordinates[i];
    }
    closestPoint.length = stride;
    return squaredDistance;
  } else {
    return minSquaredDistance;
  }
};
ol.geom.Point.prototype.getCoordinates = function() {
  return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
};
ol.geom.Point.prototype.computeExtent = function(extent) {
  return ol.extent.createOrUpdateFromCoordinate(this.flatCoordinates, extent);
};
ol.geom.Point.prototype.getType = function() {
  return ol.geom.GeometryType.POINT;
};
ol.geom.Point.prototype.intersectsExtent = function(extent) {
  return ol.extent.containsXY(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
};
ol.geom.Point.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinate(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};
ol.geom.Point.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};
goog.provide("ol.geom.flat.interiorpoint");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.geom.flat.contains");
ol.geom.flat.interiorpoint.linearRings = function(flatCoordinates, offset, ends, stride, flatCenters, flatCentersOffset, opt_dest) {
  var i, ii, x, x1, x2, y1, y2;
  var y = flatCenters[flatCentersOffset + 1];
  var intersections = [];
  var end = ends[0];
  x1 = flatCoordinates[end - stride];
  y1 = flatCoordinates[end - stride + 1];
  for (i = offset;i < end;i += stride) {
    x2 = flatCoordinates[i];
    y2 = flatCoordinates[i + 1];
    if (y <= y1 && y2 <= y || y1 <= y && y <= y2) {
      x = (y - y1) / (y2 - y1) * (x2 - x1) + x1;
      intersections.push(x);
    }
    x1 = x2;
    y1 = y2;
  }
  var pointX = NaN;
  var maxSegmentLength = -Infinity;
  intersections.sort(ol.array.numberSafeCompareFunction);
  x1 = intersections[0];
  for (i = 1, ii = intersections.length;i < ii;++i) {
    x2 = intersections[i];
    var segmentLength = Math.abs(x2 - x1);
    if (segmentLength > maxSegmentLength) {
      x = (x1 + x2) / 2;
      if (ol.geom.flat.contains.linearRingsContainsXY(flatCoordinates, offset, ends, stride, x, y)) {
        pointX = x;
        maxSegmentLength = segmentLength;
      }
    }
    x1 = x2;
  }
  if (isNaN(pointX)) {
    pointX = flatCenters[flatCentersOffset];
  }
  if (opt_dest) {
    opt_dest.push(pointX, y);
    return opt_dest;
  } else {
    return [pointX, y];
  }
};
ol.geom.flat.interiorpoint.linearRingss = function(flatCoordinates, offset, endss, stride, flatCenters) {
  ol.DEBUG && console.assert(2 * endss.length == flatCenters.length, "endss.length times 2 should be flatCenters.length");
  var interiorPoints = [];
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    interiorPoints = ol.geom.flat.interiorpoint.linearRings(flatCoordinates, offset, ends, stride, flatCenters, 2 * i, interiorPoints);
    offset = ends[ends.length - 1];
  }
  return interiorPoints;
};
goog.provide("ol.geom.flat.reverse");
ol.geom.flat.reverse.coordinates = function(flatCoordinates, offset, end, stride) {
  while (offset < end - stride) {
    var i;
    for (i = 0;i < stride;++i) {
      var tmp = flatCoordinates[offset + i];
      flatCoordinates[offset + i] = flatCoordinates[end - stride + i];
      flatCoordinates[end - stride + i] = tmp;
    }
    offset += stride;
    end -= stride;
  }
};
goog.provide("ol.geom.flat.orient");
goog.require("ol");
goog.require("ol.geom.flat.reverse");
ol.geom.flat.orient.linearRingIsClockwise = function(flatCoordinates, offset, end, stride) {
  var edge = 0;
  var x1 = flatCoordinates[end - stride];
  var y1 = flatCoordinates[end - stride + 1];
  for (;offset < end;offset += stride) {
    var x2 = flatCoordinates[offset];
    var y2 = flatCoordinates[offset + 1];
    edge += (x2 - x1) * (y2 + y1);
    x1 = x2;
    y1 = y2;
  }
  return edge > 0;
};
ol.geom.flat.orient.linearRingsAreOriented = function(flatCoordinates, offset, ends, stride, opt_right) {
  var right = opt_right !== undefined ? opt_right : false;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(flatCoordinates, offset, end, stride);
    if (i === 0) {
      if (right && isClockwise || !right && !isClockwise) {
        return false;
      }
    } else {
      if (right && !isClockwise || !right && isClockwise) {
        return false;
      }
    }
    offset = end;
  }
  return true;
};
ol.geom.flat.orient.linearRingssAreOriented = function(flatCoordinates, offset, endss, stride, opt_right) {
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    if (!ol.geom.flat.orient.linearRingsAreOriented(flatCoordinates, offset, endss[i], stride, opt_right)) {
      return false;
    }
  }
  return true;
};
ol.geom.flat.orient.orientLinearRings = function(flatCoordinates, offset, ends, stride, opt_right) {
  var right = opt_right !== undefined ? opt_right : false;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    var isClockwise = ol.geom.flat.orient.linearRingIsClockwise(flatCoordinates, offset, end, stride);
    var reverse = i === 0 ? right && isClockwise || !right && !isClockwise : right && !isClockwise || !right && isClockwise;
    if (reverse) {
      ol.geom.flat.reverse.coordinates(flatCoordinates, offset, end, stride);
    }
    offset = end;
  }
  return offset;
};
ol.geom.flat.orient.orientLinearRingss = function(flatCoordinates, offset, endss, stride, opt_right) {
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    offset = ol.geom.flat.orient.orientLinearRings(flatCoordinates, offset, endss[i], stride, opt_right);
  }
  return offset;
};
goog.provide("ol.geom.Polygon");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.LinearRing");
goog.require("ol.geom.Point");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.area");
goog.require("ol.geom.flat.closest");
goog.require("ol.geom.flat.contains");
goog.require("ol.geom.flat.deflate");
goog.require("ol.geom.flat.inflate");
goog.require("ol.geom.flat.interiorpoint");
goog.require("ol.geom.flat.intersectsextent");
goog.require("ol.geom.flat.orient");
goog.require("ol.geom.flat.simplify");
goog.require("ol.math");
ol.geom.Polygon = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.ends_ = [];
  this.flatInteriorPointRevision_ = -1;
  this.flatInteriorPoint_ = null;
  this.maxDelta_ = -1;
  this.maxDeltaRevision_ = -1;
  this.orientedRevision_ = -1;
  this.orientedFlatCoordinates_ = null;
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.Polygon, ol.geom.SimpleGeometry);
ol.geom.Polygon.prototype.appendLinearRing = function(linearRing) {
  ol.DEBUG && console.assert(linearRing.getLayout() == this.layout, "layout of linearRing should match layout");
  if (!this.flatCoordinates) {
    this.flatCoordinates = linearRing.getFlatCoordinates().slice();
  } else {
    ol.array.extend(this.flatCoordinates, linearRing.getFlatCoordinates());
  }
  this.ends_.push(this.flatCoordinates.length);
  this.changed();
};
ol.geom.Polygon.prototype.clone = function() {
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(this.layout, this.flatCoordinates.slice(), this.ends_.slice());
  return polygon;
};
ol.geom.Polygon.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getsMaxSquaredDelta(this.flatCoordinates, 0, this.ends_, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getsClosestPoint(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};
ol.geom.Polygon.prototype.containsXY = function(x, y) {
  return ol.geom.flat.contains.linearRingsContainsXY(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
};
ol.geom.Polygon.prototype.getArea = function() {
  return ol.geom.flat.area.linearRings(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
};
ol.geom.Polygon.prototype.getCoordinates = function(opt_right) {
  var flatCoordinates;
  if (opt_right !== undefined) {
    flatCoordinates = this.getOrientedFlatCoordinates().slice();
    ol.geom.flat.orient.orientLinearRings(flatCoordinates, 0, this.ends_, this.stride, opt_right);
  } else {
    flatCoordinates = this.flatCoordinates;
  }
  return ol.geom.flat.inflate.coordinatess(flatCoordinates, 0, this.ends_, this.stride);
};
ol.geom.Polygon.prototype.getEnds = function() {
  return this.ends_;
};
ol.geom.Polygon.prototype.getFlatInteriorPoint = function() {
  if (this.flatInteriorPointRevision_ != this.getRevision()) {
    var flatCenter = ol.extent.getCenter(this.getExtent());
    this.flatInteriorPoint_ = ol.geom.flat.interiorpoint.linearRings(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, flatCenter, 0);
    this.flatInteriorPointRevision_ = this.getRevision();
  }
  return this.flatInteriorPoint_;
};
ol.geom.Polygon.prototype.getInteriorPoint = function() {
  return new ol.geom.Point(this.getFlatInteriorPoint());
};
ol.geom.Polygon.prototype.getLinearRingCount = function() {
  return this.ends_.length;
};
ol.geom.Polygon.prototype.getLinearRing = function(index) {
  ol.DEBUG && console.assert(0 <= index && index < this.ends_.length, "index should be in between 0 and and length of this.ends_");
  if (index < 0 || this.ends_.length <= index) {
    return null;
  }
  var linearRing = new ol.geom.LinearRing(null);
  linearRing.setFlatCoordinates(this.layout, this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]));
  return linearRing;
};
ol.geom.Polygon.prototype.getLinearRings = function() {
  var layout = this.layout;
  var flatCoordinates = this.flatCoordinates;
  var ends = this.ends_;
  var linearRings = [];
  var offset = 0;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    var linearRing = new ol.geom.LinearRing(null);
    linearRing.setFlatCoordinates(layout, flatCoordinates.slice(offset, end));
    linearRings.push(linearRing);
    offset = end;
  }
  return linearRings;
};
ol.geom.Polygon.prototype.getOrientedFlatCoordinates = function() {
  if (this.orientedRevision_ != this.getRevision()) {
    var flatCoordinates = this.flatCoordinates;
    if (ol.geom.flat.orient.linearRingsAreOriented(flatCoordinates, 0, this.ends_, this.stride)) {
      this.orientedFlatCoordinates_ = flatCoordinates;
    } else {
      this.orientedFlatCoordinates_ = flatCoordinates.slice();
      this.orientedFlatCoordinates_.length = ol.geom.flat.orient.orientLinearRings(this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
    }
    this.orientedRevision_ = this.getRevision();
  }
  return this.orientedFlatCoordinates_;
};
ol.geom.Polygon.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  var simplifiedEnds = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.quantizes(this.flatCoordinates, 0, this.ends_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEnds);
  var simplifiedPolygon = new ol.geom.Polygon(null);
  simplifiedPolygon.setFlatCoordinates(ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEnds);
  return simplifiedPolygon;
};
ol.geom.Polygon.prototype.getType = function() {
  return ol.geom.GeometryType.POLYGON;
};
ol.geom.Polygon.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.linearRings(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
};
ol.geom.Polygon.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ends_);
  } else {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = ol.geom.flat.deflate.coordinatess(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
};
ol.geom.Polygon.prototype.setFlatCoordinates = function(layout, flatCoordinates, ends) {
  if (!flatCoordinates) {
    ol.DEBUG && console.assert(ends && ends.length === 0, "ends must be an empty array");
  } else {
    if (ends.length === 0) {
      ol.DEBUG && console.assert(flatCoordinates.length === 0, "flatCoordinates should be an empty array");
    } else {
      ol.DEBUG && console.assert(flatCoordinates.length == ends[ends.length - 1], "the length of flatCoordinates should be the last entry of ends");
    }
  }
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.ends_ = ends;
  this.changed();
};
ol.geom.Polygon.circular = function(sphere, center, radius, opt_n) {
  var n = opt_n ? opt_n : 32;
  var flatCoordinates = [];
  var i;
  for (i = 0;i < n;++i) {
    ol.array.extend(flatCoordinates, sphere.offset(center, radius, 2 * Math.PI * i / n));
  }
  flatCoordinates.push(flatCoordinates[0], flatCoordinates[1]);
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
  return polygon;
};
ol.geom.Polygon.fromExtent = function(extent) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var flatCoordinates = [minX, minY, minX, maxY, maxX, maxY, maxX, minY, minX, minY];
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(ol.geom.GeometryLayout.XY, flatCoordinates, [flatCoordinates.length]);
  return polygon;
};
ol.geom.Polygon.fromCircle = function(circle, opt_sides, opt_angle) {
  var sides = opt_sides ? opt_sides : 32;
  var stride = circle.getStride();
  var layout = circle.getLayout();
  var polygon = new ol.geom.Polygon(null, layout);
  var arrayLength = stride * (sides + 1);
  var flatCoordinates = new Array(arrayLength);
  for (var i = 0;i < arrayLength;i++) {
    flatCoordinates[i] = 0;
  }
  var ends = [flatCoordinates.length];
  polygon.setFlatCoordinates(layout, flatCoordinates, ends);
  ol.geom.Polygon.makeRegular(polygon, circle.getCenter(), circle.getRadius(), opt_angle);
  return polygon;
};
ol.geom.Polygon.makeRegular = function(polygon, center, radius, opt_angle) {
  var flatCoordinates = polygon.getFlatCoordinates();
  var layout = polygon.getLayout();
  var stride = polygon.getStride();
  var ends = polygon.getEnds();
  ol.DEBUG && console.assert(ends.length === 1, "only 1 ring is supported");
  var sides = flatCoordinates.length / stride - 1;
  var startAngle = opt_angle ? opt_angle : 0;
  var angle, offset;
  for (var i = 0;i <= sides;++i) {
    offset = i * stride;
    angle = startAngle + ol.math.modulo(i, sides) * 2 * Math.PI / sides;
    flatCoordinates[offset] = center[0] + radius * Math.cos(angle);
    flatCoordinates[offset + 1] = center[1] + radius * Math.sin(angle);
  }
  polygon.setFlatCoordinates(layout, flatCoordinates, ends);
};
goog.provide("ol.View");
goog.require("ol");
goog.require("ol.CenterConstraint");
goog.require("ol.Constraints");
goog.require("ol.Object");
goog.require("ol.ResolutionConstraint");
goog.require("ol.RotationConstraint");
goog.require("ol.array");
goog.require("ol.asserts");
goog.require("ol.coordinate");
goog.require("ol.easing");
goog.require("ol.extent");
goog.require("ol.geom.Polygon");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.proj");
goog.require("ol.proj.METERS_PER_UNIT");
goog.require("ol.proj.Units");
ol.View = function(opt_options) {
  ol.Object.call(this);
  var options = opt_options || {};
  this.hints_ = [0, 0];
  this.animations_ = [];
  this.updateAnimationKey_;
  this.updateAnimations_ = this.updateAnimations_.bind(this);
  var properties = {};
  properties[ol.View.Property.CENTER] = options.center !== undefined ? options.center : null;
  this.projection_ = ol.proj.createProjection(options.projection, "EPSG:3857");
  var resolutionConstraintInfo = ol.View.createResolutionConstraint_(options);
  this.maxResolution_ = resolutionConstraintInfo.maxResolution;
  this.minResolution_ = resolutionConstraintInfo.minResolution;
  this.zoomFactor_ = resolutionConstraintInfo.zoomFactor;
  this.resolutions_ = options.resolutions;
  this.minZoom_ = resolutionConstraintInfo.minZoom;
  var centerConstraint = ol.View.createCenterConstraint_(options);
  var resolutionConstraint = resolutionConstraintInfo.constraint;
  var rotationConstraint = ol.View.createRotationConstraint_(options);
  this.constraints_ = new ol.Constraints(centerConstraint, resolutionConstraint, rotationConstraint);
  if (options.resolution !== undefined) {
    properties[ol.View.Property.RESOLUTION] = options.resolution;
  } else {
    if (options.zoom !== undefined) {
      properties[ol.View.Property.RESOLUTION] = this.constrainResolution(this.maxResolution_, options.zoom - this.minZoom_);
    }
  }
  properties[ol.View.Property.ROTATION] = options.rotation !== undefined ? options.rotation : 0;
  this.setProperties(properties);
};
ol.inherits(ol.View, ol.Object);
ol.View.prototype.animate = function(var_args) {
  var start = Date.now();
  var center = this.getCenter().slice();
  var resolution = this.getResolution();
  var rotation = this.getRotation();
  var animationCount = arguments.length;
  var callback;
  if (animationCount > 1 && typeof arguments[animationCount - 1] === "function") {
    callback = arguments[animationCount - 1];
    --animationCount;
  }
  var series = [];
  for (var i = 0;i < animationCount;++i) {
    var options = (arguments[i]);
    var animation = ({start:start, complete:false, anchor:options.anchor, duration:options.duration || 1E3, easing:options.easing || ol.easing.inAndOut});
    if (options.center) {
      animation.sourceCenter = center;
      animation.targetCenter = options.center;
      center = animation.targetCenter;
    }
    if (options.zoom !== undefined) {
      animation.sourceResolution = resolution;
      animation.targetResolution = this.constrainResolution(this.maxResolution_, options.zoom - this.minZoom_, 0);
      resolution = animation.targetResolution;
    } else {
      if (options.resolution) {
        animation.sourceResolution = this.getResolution();
        animation.targetResolution = options.resolution;
        resolution = animation.targetResolution;
      }
    }
    if (options.rotation !== undefined) {
      animation.sourceRotation = rotation;
      animation.targetRotation = options.rotation;
      rotation = animation.targetRotation;
    }
    animation.callback = callback;
    start += animation.duration;
    series.push(animation);
  }
  this.animations_.push(series);
  this.setHint(ol.View.Hint.ANIMATING, 1);
  this.updateAnimations_();
};
ol.View.prototype.getAnimating = function() {
  return this.getHints()[ol.View.Hint.ANIMATING] > 0;
};
ol.View.prototype.cancelAnimations = function() {
  this.setHint(ol.View.Hint.ANIMATING, -this.getHints()[ol.View.Hint.ANIMATING]);
  for (var i = 0, ii = this.animations_.length;i < ii;++i) {
    var series = this.animations_[i];
    if (series[0].callback) {
      series[0].callback(false);
    }
  }
  this.animations_.length = 0;
  this.changed();
};
ol.View.prototype.updateAnimations_ = function() {
  if (this.updateAnimationKey_ !== undefined) {
    cancelAnimationFrame(this.updateAnimationKey_);
    this.updateAnimationKey_ = undefined;
  }
  if (!this.getAnimating()) {
    return;
  }
  var now = Date.now();
  var more = false;
  for (var i = this.animations_.length - 1;i >= 0;--i) {
    var series = this.animations_[i];
    var seriesComplete = true;
    for (var j = 0, jj = series.length;j < jj;++j) {
      var animation = series[j];
      if (animation.complete) {
        continue;
      }
      var elapsed = now - animation.start;
      var fraction = elapsed / animation.duration;
      if (fraction >= 1) {
        animation.complete = true;
        fraction = 1;
      } else {
        seriesComplete = false;
      }
      var progress = animation.easing(fraction);
      if (animation.sourceCenter) {
        var x0 = animation.sourceCenter[0];
        var y0 = animation.sourceCenter[1];
        var x1 = animation.targetCenter[0];
        var y1 = animation.targetCenter[1];
        var x = x0 + progress * (x1 - x0);
        var y = y0 + progress * (y1 - y0);
        this.set(ol.View.Property.CENTER, [x, y]);
      }
      if (animation.sourceResolution) {
        var resolution = animation.sourceResolution + progress * (animation.targetResolution - animation.sourceResolution);
        if (animation.anchor) {
          this.set(ol.View.Property.CENTER, this.calculateCenterZoom(resolution, animation.anchor));
        }
        this.set(ol.View.Property.RESOLUTION, resolution);
      }
      if (animation.sourceRotation !== undefined) {
        var rotation = animation.sourceRotation + progress * (animation.targetRotation - animation.sourceRotation);
        if (animation.anchor) {
          this.set(ol.View.Property.CENTER, this.calculateCenterRotate(rotation, animation.anchor));
        }
        this.set(ol.View.Property.ROTATION, rotation);
      }
      more = true;
      if (!animation.complete) {
        break;
      }
    }
    if (seriesComplete) {
      this.animations_[i] = null;
      this.setHint(ol.View.Hint.ANIMATING, -1);
      var callback = series[0].callback;
      if (callback) {
        callback(true);
      }
    }
  }
  this.animations_ = this.animations_.filter(Boolean);
  if (more && this.updateAnimationKey_ === undefined) {
    this.updateAnimationKey_ = requestAnimationFrame(this.updateAnimations_);
  }
};
ol.View.prototype.calculateCenterRotate = function(rotation, anchor) {
  var center;
  var currentCenter = this.getCenter();
  if (currentCenter !== undefined) {
    center = [currentCenter[0] - anchor[0], currentCenter[1] - anchor[1]];
    ol.coordinate.rotate(center, rotation - this.getRotation());
    ol.coordinate.add(center, anchor);
  }
  return center;
};
ol.View.prototype.calculateCenterZoom = function(resolution, anchor) {
  var center;
  var currentCenter = this.getCenter();
  var currentResolution = this.getResolution();
  if (currentCenter !== undefined && currentResolution !== undefined) {
    var x = anchor[0] - resolution * (anchor[0] - currentCenter[0]) / currentResolution;
    var y = anchor[1] - resolution * (anchor[1] - currentCenter[1]) / currentResolution;
    center = [x, y];
  }
  return center;
};
ol.View.prototype.constrainCenter = function(center) {
  return this.constraints_.center(center);
};
ol.View.prototype.constrainResolution = function(resolution, opt_delta, opt_direction) {
  var delta = opt_delta || 0;
  var direction = opt_direction || 0;
  return this.constraints_.resolution(resolution, delta, direction);
};
ol.View.prototype.constrainRotation = function(rotation, opt_delta) {
  var delta = opt_delta || 0;
  return this.constraints_.rotation(rotation, delta);
};
ol.View.prototype.getCenter = function() {
  return (this.get(ol.View.Property.CENTER));
};
ol.View.prototype.getHints = function(opt_hints) {
  if (opt_hints !== undefined) {
    opt_hints[0] = this.hints_[0];
    opt_hints[1] = this.hints_[1];
    return opt_hints;
  } else {
    return this.hints_.slice();
  }
};
ol.View.prototype.calculateExtent = function(size) {
  var center = (this.getCenter());
  ol.asserts.assert(center, 1);
  var resolution = (this.getResolution());
  ol.asserts.assert(resolution !== undefined, 2);
  var rotation = (this.getRotation());
  ol.asserts.assert(rotation !== undefined, 3);
  return ol.extent.getForViewAndSize(center, resolution, rotation, size);
};
ol.View.prototype.getMaxResolution = function() {
  return this.maxResolution_;
};
ol.View.prototype.getMinResolution = function() {
  return this.minResolution_;
};
ol.View.prototype.getProjection = function() {
  return this.projection_;
};
ol.View.prototype.getResolution = function() {
  return (this.get(ol.View.Property.RESOLUTION));
};
ol.View.prototype.getResolutions = function() {
  return this.resolutions_;
};
ol.View.prototype.getResolutionForExtent = function(extent, size) {
  var xResolution = ol.extent.getWidth(extent) / size[0];
  var yResolution = ol.extent.getHeight(extent) / size[1];
  return Math.max(xResolution, yResolution);
};
ol.View.prototype.getResolutionForValueFunction = function(opt_power) {
  var power = opt_power || 2;
  var maxResolution = this.maxResolution_;
  var minResolution = this.minResolution_;
  var max = Math.log(maxResolution / minResolution) / Math.log(power);
  return function(value) {
    var resolution = maxResolution / Math.pow(power, value * max);
    ol.DEBUG && console.assert(resolution >= minResolution && resolution <= maxResolution, "calculated resolution outside allowed bounds (%s <= %s <= %s)", minResolution, resolution, maxResolution);
    return resolution;
  };
};
ol.View.prototype.getRotation = function() {
  return (this.get(ol.View.Property.ROTATION));
};
ol.View.prototype.getValueForResolutionFunction = function(opt_power) {
  var power = opt_power || 2;
  var maxResolution = this.maxResolution_;
  var minResolution = this.minResolution_;
  var max = Math.log(maxResolution / minResolution) / Math.log(power);
  return function(resolution) {
    var value = Math.log(maxResolution / resolution) / Math.log(power) / max;
    ol.DEBUG && console.assert(value >= 0 && value <= 1, "calculated value (%s) ouside allowed range (0-1)", value);
    return value;
  };
};
ol.View.prototype.getState = function() {
  ol.DEBUG && console.assert(this.isDef(), "the view was not defined (had no center and/or resolution)");
  var center = (this.getCenter());
  var projection = this.getProjection();
  var resolution = (this.getResolution());
  var rotation = this.getRotation();
  return ({center:center.slice(), projection:projection !== undefined ? projection : null, resolution:resolution, rotation:rotation});
};
ol.View.prototype.getZoom = function() {
  var zoom;
  var resolution = this.getResolution();
  if (resolution !== undefined && resolution >= this.minResolution_ && resolution <= this.maxResolution_) {
    var offset = this.minZoom_ || 0;
    var max, zoomFactor;
    if (this.resolutions_) {
      var nearest = ol.array.linearFindNearest(this.resolutions_, resolution, 1);
      offset += nearest;
      if (nearest == this.resolutions_.length - 1) {
        return offset;
      }
      max = this.resolutions_[nearest];
      zoomFactor = max / this.resolutions_[nearest + 1];
    } else {
      max = this.maxResolution_;
      zoomFactor = this.zoomFactor_;
    }
    zoom = offset + Math.log(max / resolution) / Math.log(zoomFactor);
  }
  return zoom;
};
ol.View.prototype.fit = function(geometry, size, opt_options) {
  if (!(geometry instanceof ol.geom.SimpleGeometry)) {
    ol.asserts.assert(Array.isArray(geometry), 24);
    ol.asserts.assert(!ol.extent.isEmpty(geometry), 25);
    geometry = ol.geom.Polygon.fromExtent(geometry);
  }
  var options = opt_options || {};
  var padding = options.padding !== undefined ? options.padding : [0, 0, 0, 0];
  var constrainResolution = options.constrainResolution !== undefined ? options.constrainResolution : true;
  var nearest = options.nearest !== undefined ? options.nearest : false;
  var minResolution;
  if (options.minResolution !== undefined) {
    minResolution = options.minResolution;
  } else {
    if (options.maxZoom !== undefined) {
      minResolution = this.constrainResolution(this.maxResolution_, options.maxZoom - this.minZoom_, 0);
    } else {
      minResolution = 0;
    }
  }
  var coords = geometry.getFlatCoordinates();
  var rotation = this.getRotation();
  ol.DEBUG && console.assert(rotation !== undefined, "rotation was not defined");
  var cosAngle = Math.cos(-rotation);
  var sinAngle = Math.sin(-rotation);
  var minRotX = +Infinity;
  var minRotY = +Infinity;
  var maxRotX = -Infinity;
  var maxRotY = -Infinity;
  var stride = geometry.getStride();
  for (var i = 0, ii = coords.length;i < ii;i += stride) {
    var rotX = coords[i] * cosAngle - coords[i + 1] * sinAngle;
    var rotY = coords[i] * sinAngle + coords[i + 1] * cosAngle;
    minRotX = Math.min(minRotX, rotX);
    minRotY = Math.min(minRotY, rotY);
    maxRotX = Math.max(maxRotX, rotX);
    maxRotY = Math.max(maxRotY, rotY);
  }
  var resolution = this.getResolutionForExtent([minRotX, minRotY, maxRotX, maxRotY], [size[0] - padding[1] - padding[3], size[1] - padding[0] - padding[2]]);
  resolution = isNaN(resolution) ? minResolution : Math.max(resolution, minResolution);
  if (constrainResolution) {
    var constrainedResolution = this.constrainResolution(resolution, 0, 0);
    if (!nearest && constrainedResolution < resolution) {
      constrainedResolution = this.constrainResolution(constrainedResolution, -1, 0);
    }
    resolution = constrainedResolution;
  }
  this.setResolution(resolution);
  sinAngle = -sinAngle;
  var centerRotX = (minRotX + maxRotX) / 2;
  var centerRotY = (minRotY + maxRotY) / 2;
  centerRotX += (padding[1] - padding[3]) / 2 * resolution;
  centerRotY += (padding[0] - padding[2]) / 2 * resolution;
  var centerX = centerRotX * cosAngle - centerRotY * sinAngle;
  var centerY = centerRotY * cosAngle + centerRotX * sinAngle;
  this.setCenter([centerX, centerY]);
};
ol.View.prototype.centerOn = function(coordinate, size, position) {
  var rotation = this.getRotation();
  var cosAngle = Math.cos(-rotation);
  var sinAngle = Math.sin(-rotation);
  var rotX = coordinate[0] * cosAngle - coordinate[1] * sinAngle;
  var rotY = coordinate[1] * cosAngle + coordinate[0] * sinAngle;
  var resolution = this.getResolution();
  rotX += (size[0] / 2 - position[0]) * resolution;
  rotY += (position[1] - size[1] / 2) * resolution;
  sinAngle = -sinAngle;
  var centerX = rotX * cosAngle - rotY * sinAngle;
  var centerY = rotY * cosAngle + rotX * sinAngle;
  this.setCenter([centerX, centerY]);
};
ol.View.prototype.isDef = function() {
  return !!this.getCenter() && this.getResolution() !== undefined;
};
ol.View.prototype.rotate = function(rotation, opt_anchor) {
  if (opt_anchor !== undefined) {
    var center = this.calculateCenterRotate(rotation, opt_anchor);
    this.setCenter(center);
  }
  this.setRotation(rotation);
};
ol.View.prototype.setCenter = function(center) {
  this.set(ol.View.Property.CENTER, center);
  if (this.getAnimating()) {
    this.cancelAnimations();
  }
};
ol.View.prototype.setHint = function(hint, delta) {
  ol.DEBUG && console.assert(0 <= hint && hint < this.hints_.length, "illegal hint (%s), must be between 0 and %s", hint, this.hints_.length);
  this.hints_[hint] += delta;
  ol.DEBUG && console.assert(this.hints_[hint] >= 0, "Hint at %s must be positive, was %s", hint, this.hints_[hint]);
  return this.hints_[hint];
};
ol.View.prototype.setResolution = function(resolution) {
  this.set(ol.View.Property.RESOLUTION, resolution);
  if (this.getAnimating()) {
    this.cancelAnimations();
  }
};
ol.View.prototype.setRotation = function(rotation) {
  this.set(ol.View.Property.ROTATION, rotation);
  if (this.getAnimating()) {
    this.cancelAnimations();
  }
};
ol.View.prototype.setZoom = function(zoom) {
  var resolution = this.constrainResolution(this.maxResolution_, zoom - this.minZoom_, 0);
  this.setResolution(resolution);
};
ol.View.createCenterConstraint_ = function(options) {
  if (options.extent !== undefined) {
    return ol.CenterConstraint.createExtent(options.extent);
  } else {
    return ol.CenterConstraint.none;
  }
};
ol.View.createResolutionConstraint_ = function(options) {
  var resolutionConstraint;
  var maxResolution;
  var minResolution;
  var defaultMaxZoom = 28;
  var defaultZoomFactor = 2;
  var minZoom = options.minZoom !== undefined ? options.minZoom : ol.DEFAULT_MIN_ZOOM;
  var maxZoom = options.maxZoom !== undefined ? options.maxZoom : defaultMaxZoom;
  var zoomFactor = options.zoomFactor !== undefined ? options.zoomFactor : defaultZoomFactor;
  if (options.resolutions !== undefined) {
    var resolutions = options.resolutions;
    maxResolution = resolutions[0];
    minResolution = resolutions[resolutions.length - 1];
    resolutionConstraint = ol.ResolutionConstraint.createSnapToResolutions(resolutions);
  } else {
    var projection = ol.proj.createProjection(options.projection, "EPSG:3857");
    var extent = projection.getExtent();
    var size = !extent ? 360 * ol.proj.METERS_PER_UNIT[ol.proj.Units.DEGREES] / projection.getMetersPerUnit() : Math.max(ol.extent.getWidth(extent), ol.extent.getHeight(extent));
    var defaultMaxResolution = size / ol.DEFAULT_TILE_SIZE / Math.pow(defaultZoomFactor, ol.DEFAULT_MIN_ZOOM);
    var defaultMinResolution = defaultMaxResolution / Math.pow(defaultZoomFactor, defaultMaxZoom - ol.DEFAULT_MIN_ZOOM);
    maxResolution = options.maxResolution;
    if (maxResolution !== undefined) {
      minZoom = 0;
    } else {
      maxResolution = defaultMaxResolution / Math.pow(zoomFactor, minZoom);
    }
    minResolution = options.minResolution;
    if (minResolution === undefined) {
      if (options.maxZoom !== undefined) {
        if (options.maxResolution !== undefined) {
          minResolution = maxResolution / Math.pow(zoomFactor, maxZoom);
        } else {
          minResolution = defaultMaxResolution / Math.pow(zoomFactor, maxZoom);
        }
      } else {
        minResolution = defaultMinResolution;
      }
    }
    maxZoom = minZoom + Math.floor(Math.log(maxResolution / minResolution) / Math.log(zoomFactor));
    minResolution = maxResolution / Math.pow(zoomFactor, maxZoom - minZoom);
    resolutionConstraint = ol.ResolutionConstraint.createSnapToPower(zoomFactor, maxResolution, maxZoom - minZoom);
  }
  return {constraint:resolutionConstraint, maxResolution:maxResolution, minResolution:minResolution, minZoom:minZoom, zoomFactor:zoomFactor};
};
ol.View.createRotationConstraint_ = function(options) {
  var enableRotation = options.enableRotation !== undefined ? options.enableRotation : true;
  if (enableRotation) {
    var constrainRotation = options.constrainRotation;
    if (constrainRotation === undefined || constrainRotation === true) {
      return ol.RotationConstraint.createSnapToZero();
    } else {
      if (constrainRotation === false) {
        return ol.RotationConstraint.none;
      } else {
        if (typeof constrainRotation === "number") {
          return ol.RotationConstraint.createSnapToN(constrainRotation);
        } else {
          ol.DEBUG && console.assert(false, "illegal option for constrainRotation (%s)", constrainRotation);
          return ol.RotationConstraint.none;
        }
      }
    }
  } else {
    return ol.RotationConstraint.disable;
  }
};
ol.View.Property = {CENTER:"center", RESOLUTION:"resolution", ROTATION:"rotation"};
ol.View.Hint = {ANIMATING:0, INTERACTING:1};
goog.provide("ol.control.Attribution");
goog.require("ol");
goog.require("ol.dom");
goog.require("ol.control.Control");
goog.require("ol.css");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.obj");
ol.control.Attribution = function(opt_options) {
  var options = opt_options ? opt_options : {};
  this.ulElement_ = document.createElement("UL");
  this.logoLi_ = document.createElement("LI");
  this.ulElement_.appendChild(this.logoLi_);
  this.logoLi_.style.display = "none";
  this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;
  this.collapsible_ = options.collapsible !== undefined ? options.collapsible : true;
  if (!this.collapsible_) {
    this.collapsed_ = false;
  }
  var className = options.className !== undefined ? options.className : "ol-attribution";
  var tipLabel = options.tipLabel !== undefined ? options.tipLabel : "Attributions";
  var collapseLabel = options.collapseLabel !== undefined ? options.collapseLabel : "\u00bb";
  if (typeof collapseLabel === "string") {
    this.collapseLabel_ = document.createElement("span");
    this.collapseLabel_.textContent = collapseLabel;
  } else {
    this.collapseLabel_ = collapseLabel;
  }
  var label = options.label !== undefined ? options.label : "i";
  if (typeof label === "string") {
    this.label_ = document.createElement("span");
    this.label_.textContent = label;
  } else {
    this.label_ = label;
  }
  var activeLabel = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
  var button = document.createElement("button");
  button.setAttribute("type", "button");
  button.title = tipLabel;
  button.appendChild(activeLabel);
  ol.events.listen(button, ol.events.EventType.CLICK, this.handleClick_, this);
  var cssClasses = className + " " + ol.css.CLASS_UNSELECTABLE + " " + ol.css.CLASS_CONTROL + (this.collapsed_ && this.collapsible_ ? " ol-collapsed" : "") + (this.collapsible_ ? "" : " ol-uncollapsible");
  var element = document.createElement("div");
  element.className = cssClasses;
  element.appendChild(this.ulElement_);
  element.appendChild(button);
  var render = options.render ? options.render : ol.control.Attribution.render;
  ol.control.Control.call(this, {element:element, render:render, target:options.target});
  this.renderedVisible_ = true;
  this.attributionElements_ = {};
  this.attributionElementRenderedVisible_ = {};
  this.logoElements_ = {};
};
ol.inherits(ol.control.Attribution, ol.control.Control);
ol.control.Attribution.prototype.getSourceAttributions = function(frameState) {
  var i, ii, j, jj, tileRanges, source, sourceAttribution, sourceAttributionKey, sourceAttributions, sourceKey;
  var intersectsTileRange;
  var layerStatesArray = frameState.layerStatesArray;
  var attributions = ol.obj.assign({}, frameState.attributions);
  var hiddenAttributions = {};
  var projection = (frameState.viewState.projection);
  for (i = 0, ii = layerStatesArray.length;i < ii;i++) {
    source = layerStatesArray[i].layer.getSource();
    if (!source) {
      continue;
    }
    sourceKey = ol.getUid(source).toString();
    sourceAttributions = source.getAttributions();
    if (!sourceAttributions) {
      continue;
    }
    for (j = 0, jj = sourceAttributions.length;j < jj;j++) {
      sourceAttribution = sourceAttributions[j];
      sourceAttributionKey = ol.getUid(sourceAttribution).toString();
      if (sourceAttributionKey in attributions) {
        continue;
      }
      tileRanges = frameState.usedTiles[sourceKey];
      if (tileRanges) {
        var tileGrid = (source).getTileGridForProjection(projection);
        intersectsTileRange = sourceAttribution.intersectsAnyTileRange(tileRanges, tileGrid, projection);
      } else {
        intersectsTileRange = false;
      }
      if (intersectsTileRange) {
        if (sourceAttributionKey in hiddenAttributions) {
          delete hiddenAttributions[sourceAttributionKey];
        }
        attributions[sourceAttributionKey] = sourceAttribution;
      } else {
        hiddenAttributions[sourceAttributionKey] = sourceAttribution;
      }
    }
  }
  return [attributions, hiddenAttributions];
};
ol.control.Attribution.render = function(mapEvent) {
  this.updateElement_(mapEvent.frameState);
};
ol.control.Attribution.prototype.updateElement_ = function(frameState) {
  if (!frameState) {
    if (this.renderedVisible_) {
      this.element.style.display = "none";
      this.renderedVisible_ = false;
    }
    return;
  }
  var attributions = this.getSourceAttributions(frameState);
  var visibleAttributions = attributions[0];
  var hiddenAttributions = attributions[1];
  var attributionElement, attributionKey;
  for (attributionKey in this.attributionElements_) {
    if (attributionKey in visibleAttributions) {
      if (!this.attributionElementRenderedVisible_[attributionKey]) {
        this.attributionElements_[attributionKey].style.display = "";
        this.attributionElementRenderedVisible_[attributionKey] = true;
      }
      delete visibleAttributions[attributionKey];
    } else {
      if (attributionKey in hiddenAttributions) {
        if (this.attributionElementRenderedVisible_[attributionKey]) {
          this.attributionElements_[attributionKey].style.display = "none";
          delete this.attributionElementRenderedVisible_[attributionKey];
        }
        delete hiddenAttributions[attributionKey];
      } else {
        ol.dom.removeNode(this.attributionElements_[attributionKey]);
        delete this.attributionElements_[attributionKey];
        delete this.attributionElementRenderedVisible_[attributionKey];
      }
    }
  }
  for (attributionKey in visibleAttributions) {
    attributionElement = document.createElement("LI");
    attributionElement.innerHTML = visibleAttributions[attributionKey].getHTML();
    this.ulElement_.appendChild(attributionElement);
    this.attributionElements_[attributionKey] = attributionElement;
    this.attributionElementRenderedVisible_[attributionKey] = true;
  }
  for (attributionKey in hiddenAttributions) {
    attributionElement = document.createElement("LI");
    attributionElement.innerHTML = hiddenAttributions[attributionKey].getHTML();
    attributionElement.style.display = "none";
    this.ulElement_.appendChild(attributionElement);
    this.attributionElements_[attributionKey] = attributionElement;
  }
  var renderVisible = !ol.obj.isEmpty(this.attributionElementRenderedVisible_) || !ol.obj.isEmpty(frameState.logos);
  if (this.renderedVisible_ != renderVisible) {
    this.element.style.display = renderVisible ? "" : "none";
    this.renderedVisible_ = renderVisible;
  }
  if (renderVisible && ol.obj.isEmpty(this.attributionElementRenderedVisible_)) {
    this.element.classList.add("ol-logo-only");
  } else {
    this.element.classList.remove("ol-logo-only");
  }
  this.insertLogos_(frameState);
};
ol.control.Attribution.prototype.insertLogos_ = function(frameState) {
  var logo;
  var logos = frameState.logos;
  var logoElements = this.logoElements_;
  for (logo in logoElements) {
    if (!(logo in logos)) {
      ol.dom.removeNode(logoElements[logo]);
      delete logoElements[logo];
    }
  }
  var image, logoElement, logoKey;
  for (logoKey in logos) {
    var logoValue = logos[logoKey];
    if (logoValue instanceof HTMLElement) {
      this.logoLi_.appendChild(logoValue);
      logoElements[logoKey] = logoValue;
    }
    if (!(logoKey in logoElements)) {
      image = new Image;
      image.src = logoKey;
      if (logoValue === "") {
        logoElement = image;
      } else {
        logoElement = document.createElement("a");
        logoElement.href = logoValue;
        logoElement.appendChild(image);
      }
      this.logoLi_.appendChild(logoElement);
      logoElements[logoKey] = logoElement;
    }
  }
  this.logoLi_.style.display = !ol.obj.isEmpty(logos) ? "" : "none";
};
ol.control.Attribution.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.handleToggle_();
};
ol.control.Attribution.prototype.handleToggle_ = function() {
  this.element.classList.toggle("ol-collapsed");
  if (this.collapsed_) {
    ol.dom.replaceNode(this.collapseLabel_, this.label_);
  } else {
    ol.dom.replaceNode(this.label_, this.collapseLabel_);
  }
  this.collapsed_ = !this.collapsed_;
};
ol.control.Attribution.prototype.getCollapsible = function() {
  return this.collapsible_;
};
ol.control.Attribution.prototype.setCollapsible = function(collapsible) {
  if (this.collapsible_ === collapsible) {
    return;
  }
  this.collapsible_ = collapsible;
  this.element.classList.toggle("ol-uncollapsible");
  if (!collapsible && this.collapsed_) {
    this.handleToggle_();
  }
};
ol.control.Attribution.prototype.setCollapsed = function(collapsed) {
  if (!this.collapsible_ || this.collapsed_ === collapsed) {
    return;
  }
  this.handleToggle_();
};
ol.control.Attribution.prototype.getCollapsed = function() {
  return this.collapsed_;
};
goog.provide("ol.control.Rotate");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol");
goog.require("ol.control.Control");
goog.require("ol.css");
goog.require("ol.easing");
ol.control.Rotate = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var className = options.className !== undefined ? options.className : "ol-rotate";
  var label = options.label !== undefined ? options.label : "\u21e7";
  this.label_ = null;
  if (typeof label === "string") {
    this.label_ = document.createElement("span");
    this.label_.className = "ol-compass";
    this.label_.textContent = label;
  } else {
    this.label_ = label;
    this.label_.classList.add("ol-compass");
  }
  var tipLabel = options.tipLabel ? options.tipLabel : "Reset rotation";
  var button = document.createElement("button");
  button.className = className + "-reset";
  button.setAttribute("type", "button");
  button.title = tipLabel;
  button.appendChild(this.label_);
  ol.events.listen(button, ol.events.EventType.CLICK, ol.control.Rotate.prototype.handleClick_, this);
  var cssClasses = className + " " + ol.css.CLASS_UNSELECTABLE + " " + ol.css.CLASS_CONTROL;
  var element = document.createElement("div");
  element.className = cssClasses;
  element.appendChild(button);
  var render = options.render ? options.render : ol.control.Rotate.render;
  this.callResetNorth_ = options.resetNorth ? options.resetNorth : undefined;
  ol.control.Control.call(this, {element:element, render:render, target:options.target});
  this.duration_ = options.duration !== undefined ? options.duration : 250;
  this.autoHide_ = options.autoHide !== undefined ? options.autoHide : true;
  this.rotation_ = undefined;
  if (this.autoHide_) {
    this.element.classList.add(ol.css.CLASS_HIDDEN);
  }
};
ol.inherits(ol.control.Rotate, ol.control.Control);
ol.control.Rotate.prototype.handleClick_ = function(event) {
  event.preventDefault();
  if (this.callResetNorth_ !== undefined) {
    this.callResetNorth_();
  } else {
    this.resetNorth_();
  }
};
ol.control.Rotate.prototype.resetNorth_ = function() {
  var map = this.getMap();
  var view = map.getView();
  if (!view) {
    return;
  }
  var currentRotation = view.getRotation();
  if (currentRotation !== undefined) {
    if (this.duration_ > 0) {
      currentRotation = currentRotation % (2 * Math.PI);
      if (currentRotation < -Math.PI) {
        currentRotation += 2 * Math.PI;
      }
      if (currentRotation > Math.PI) {
        currentRotation -= 2 * Math.PI;
      }
      view.animate({rotation:0, duration:this.duration_, easing:ol.easing.easeOut});
    } else {
      view.setRotation(0);
    }
  }
};
ol.control.Rotate.render = function(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    return;
  }
  var rotation = frameState.viewState.rotation;
  if (rotation != this.rotation_) {
    var transform = "rotate(" + rotation + "rad)";
    if (this.autoHide_) {
      var contains = this.element.classList.contains(ol.css.CLASS_HIDDEN);
      if (!contains && rotation === 0) {
        this.element.classList.add(ol.css.CLASS_HIDDEN);
      } else {
        if (contains && rotation !== 0) {
          this.element.classList.remove(ol.css.CLASS_HIDDEN);
        }
      }
    }
    this.label_.style.msTransform = transform;
    this.label_.style.webkitTransform = transform;
    this.label_.style.transform = transform;
  }
  this.rotation_ = rotation;
};
goog.provide("ol.control.Zoom");
goog.require("ol");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.control.Control");
goog.require("ol.css");
goog.require("ol.easing");
ol.control.Zoom = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var className = options.className !== undefined ? options.className : "ol-zoom";
  var delta = options.delta !== undefined ? options.delta : 1;
  var zoomInLabel = options.zoomInLabel !== undefined ? options.zoomInLabel : "+";
  var zoomOutLabel = options.zoomOutLabel !== undefined ? options.zoomOutLabel : "\u2212";
  var zoomInTipLabel = options.zoomInTipLabel !== undefined ? options.zoomInTipLabel : "Zoom in";
  var zoomOutTipLabel = options.zoomOutTipLabel !== undefined ? options.zoomOutTipLabel : "Zoom out";
  var inElement = document.createElement("button");
  inElement.className = className + "-in";
  inElement.setAttribute("type", "button");
  inElement.title = zoomInTipLabel;
  inElement.appendChild(typeof zoomInLabel === "string" ? document.createTextNode(zoomInLabel) : zoomInLabel);
  ol.events.listen(inElement, ol.events.EventType.CLICK, ol.control.Zoom.prototype.handleClick_.bind(this, delta));
  var outElement = document.createElement("button");
  outElement.className = className + "-out";
  outElement.setAttribute("type", "button");
  outElement.title = zoomOutTipLabel;
  outElement.appendChild(typeof zoomOutLabel === "string" ? document.createTextNode(zoomOutLabel) : zoomOutLabel);
  ol.events.listen(outElement, ol.events.EventType.CLICK, ol.control.Zoom.prototype.handleClick_.bind(this, -delta));
  var cssClasses = className + " " + ol.css.CLASS_UNSELECTABLE + " " + ol.css.CLASS_CONTROL;
  var element = document.createElement("div");
  element.className = cssClasses;
  element.appendChild(inElement);
  element.appendChild(outElement);
  ol.control.Control.call(this, {element:element, target:options.target});
  this.duration_ = options.duration !== undefined ? options.duration : 250;
};
ol.inherits(ol.control.Zoom, ol.control.Control);
ol.control.Zoom.prototype.handleClick_ = function(delta, event) {
  event.preventDefault();
  this.zoomByDelta_(delta);
};
ol.control.Zoom.prototype.zoomByDelta_ = function(delta) {
  var map = this.getMap();
  var view = map.getView();
  if (!view) {
    return;
  }
  var currentResolution = view.getResolution();
  if (currentResolution) {
    var newResolution = view.constrainResolution(currentResolution, delta);
    if (this.duration_ > 0) {
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      view.animate({resolution:newResolution, duration:this.duration_, easing:ol.easing.easeOut});
    } else {
      view.setResolution(newResolution);
    }
  }
};
goog.provide("ol.control");
goog.require("ol");
goog.require("ol.Collection");
goog.require("ol.control.Attribution");
goog.require("ol.control.Rotate");
goog.require("ol.control.Zoom");
ol.control.defaults = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var controls = new ol.Collection;
  var zoomControl = options.zoom !== undefined ? options.zoom : true;
  if (zoomControl) {
    controls.push(new ol.control.Zoom(options.zoomOptions));
  }
  var rotateControl = options.rotate !== undefined ? options.rotate : true;
  if (rotateControl) {
    controls.push(new ol.control.Rotate(options.rotateOptions));
  }
  var attributionControl = options.attribution !== undefined ? options.attribution : true;
  if (attributionControl) {
    controls.push(new ol.control.Attribution(options.attributionOptions));
  }
  return controls;
};
goog.provide("ol.Kinetic");
ol.Kinetic = function(decay, minVelocity, delay) {
  this.decay_ = decay;
  this.minVelocity_ = minVelocity;
  this.delay_ = delay;
  this.points_ = [];
  this.angle_ = 0;
  this.initialVelocity_ = 0;
};
ol.Kinetic.prototype.begin = function() {
  this.points_.length = 0;
  this.angle_ = 0;
  this.initialVelocity_ = 0;
};
ol.Kinetic.prototype.update = function(x, y) {
  this.points_.push(x, y, Date.now());
};
ol.Kinetic.prototype.end = function() {
  if (this.points_.length < 6) {
    return false;
  }
  var delay = Date.now() - this.delay_;
  var lastIndex = this.points_.length - 3;
  if (this.points_[lastIndex + 2] < delay) {
    return false;
  }
  var firstIndex = lastIndex - 3;
  while (firstIndex > 0 && this.points_[firstIndex + 2] > delay) {
    firstIndex -= 3;
  }
  var duration = this.points_[lastIndex + 2] - this.points_[firstIndex + 2];
  var dx = this.points_[lastIndex] - this.points_[firstIndex];
  var dy = this.points_[lastIndex + 1] - this.points_[firstIndex + 1];
  this.angle_ = Math.atan2(dy, dx);
  this.initialVelocity_ = Math.sqrt(dx * dx + dy * dy) / duration;
  return this.initialVelocity_ > this.minVelocity_;
};
ol.Kinetic.prototype.getDuration_ = function() {
  return Math.log(this.minVelocity_ / this.initialVelocity_) / this.decay_;
};
ol.Kinetic.prototype.getDistance = function() {
  return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
};
ol.Kinetic.prototype.getAngle = function() {
  return this.angle_;
};
goog.provide("ol.interaction.Interaction");
goog.require("ol");
goog.require("ol.Object");
goog.require("ol.easing");
ol.interaction.Interaction = function(options) {
  ol.Object.call(this);
  this.map_ = null;
  this.setActive(true);
  this.handleEvent = options.handleEvent;
};
ol.inherits(ol.interaction.Interaction, ol.Object);
ol.interaction.Interaction.prototype.getActive = function() {
  return (this.get(ol.interaction.Interaction.Property.ACTIVE));
};
ol.interaction.Interaction.prototype.getMap = function() {
  return this.map_;
};
ol.interaction.Interaction.prototype.setActive = function(active) {
  this.set(ol.interaction.Interaction.Property.ACTIVE, active);
};
ol.interaction.Interaction.prototype.setMap = function(map) {
  this.map_ = map;
};
ol.interaction.Interaction.pan = function(map, view, delta, opt_duration) {
  var currentCenter = view.getCenter();
  if (currentCenter) {
    var center = view.constrainCenter([currentCenter[0] + delta[0], currentCenter[1] + delta[1]]);
    if (opt_duration) {
      view.animate({duration:opt_duration, easing:ol.easing.linear, center:center});
    } else {
      view.setCenter(center);
    }
  }
};
ol.interaction.Interaction.rotate = function(map, view, rotation, opt_anchor, opt_duration) {
  rotation = view.constrainRotation(rotation, 0);
  ol.interaction.Interaction.rotateWithoutConstraints(map, view, rotation, opt_anchor, opt_duration);
};
ol.interaction.Interaction.rotateWithoutConstraints = function(map, view, rotation, opt_anchor, opt_duration) {
  if (rotation !== undefined) {
    var currentRotation = view.getRotation();
    var currentCenter = view.getCenter();
    if (currentRotation !== undefined && currentCenter && opt_duration > 0) {
      view.animate({rotation:rotation, anchor:opt_anchor, duration:opt_duration, easing:ol.easing.easeOut});
    } else {
      view.rotate(rotation, opt_anchor);
    }
  }
};
ol.interaction.Interaction.zoom = function(map, view, resolution, opt_anchor, opt_duration, opt_direction) {
  resolution = view.constrainResolution(resolution, 0, opt_direction);
  ol.interaction.Interaction.zoomWithoutConstraints(map, view, resolution, opt_anchor, opt_duration);
};
ol.interaction.Interaction.zoomByDelta = function(map, view, delta, opt_anchor, opt_duration) {
  var currentResolution = view.getResolution();
  var resolution = view.constrainResolution(currentResolution, delta, 0);
  ol.interaction.Interaction.zoomWithoutConstraints(map, view, resolution, opt_anchor, opt_duration);
};
ol.interaction.Interaction.zoomWithoutConstraints = function(map, view, resolution, opt_anchor, opt_duration) {
  if (resolution) {
    var currentResolution = view.getResolution();
    var currentCenter = view.getCenter();
    if (currentResolution !== undefined && currentCenter && resolution !== currentResolution && opt_duration) {
      view.animate({resolution:resolution, anchor:opt_anchor, duration:opt_duration, easing:ol.easing.easeOut});
    } else {
      if (opt_anchor) {
        var center = view.calculateCenterZoom(resolution, opt_anchor);
        view.setCenter(center);
      }
      view.setResolution(resolution);
    }
  }
};
ol.interaction.Interaction.Property = {ACTIVE:"active"};
goog.provide("ol.interaction.DoubleClickZoom");
goog.require("ol");
goog.require("ol.MapBrowserEvent.EventType");
goog.require("ol.interaction.Interaction");
ol.interaction.DoubleClickZoom = function(opt_options) {
  var options = opt_options ? opt_options : {};
  this.delta_ = options.delta ? options.delta : 1;
  ol.interaction.Interaction.call(this, {handleEvent:ol.interaction.DoubleClickZoom.handleEvent});
  this.duration_ = options.duration !== undefined ? options.duration : 250;
};
ol.inherits(ol.interaction.DoubleClickZoom, ol.interaction.Interaction);
ol.interaction.DoubleClickZoom.handleEvent = function(mapBrowserEvent) {
  var stopEvent = false;
  var browserEvent = mapBrowserEvent.originalEvent;
  if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.DBLCLICK) {
    var map = mapBrowserEvent.map;
    var anchor = mapBrowserEvent.coordinate;
    var delta = browserEvent.shiftKey ? -this.delta_ : this.delta_;
    var view = map.getView();
    ol.interaction.Interaction.zoomByDelta(map, view, delta, anchor, this.duration_);
    mapBrowserEvent.preventDefault();
    stopEvent = true;
  }
  return !stopEvent;
};
goog.provide("ol.events.condition");
goog.require("ol.MapBrowserEvent.EventType");
goog.require("ol.asserts");
goog.require("ol.functions");
goog.require("ol.has");
ol.events.condition.altKeyOnly = function(mapBrowserEvent) {
  var originalEvent = mapBrowserEvent.originalEvent;
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};
ol.events.condition.altShiftKeysOnly = function(mapBrowserEvent) {
  var originalEvent = mapBrowserEvent.originalEvent;
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};
ol.events.condition.always = ol.functions.TRUE;
ol.events.condition.click = function(mapBrowserEvent) {
  return mapBrowserEvent.type == ol.MapBrowserEvent.EventType.CLICK;
};
ol.events.condition.mouseActionButton = function(mapBrowserEvent) {
  var originalEvent = mapBrowserEvent.originalEvent;
  return originalEvent.button == 0 && !(ol.has.WEBKIT && ol.has.MAC && originalEvent.ctrlKey);
};
ol.events.condition.never = ol.functions.FALSE;
ol.events.condition.pointerMove = function(mapBrowserEvent) {
  return mapBrowserEvent.type == "pointermove";
};
ol.events.condition.singleClick = function(mapBrowserEvent) {
  return mapBrowserEvent.type == ol.MapBrowserEvent.EventType.SINGLECLICK;
};
ol.events.condition.doubleClick = function(mapBrowserEvent) {
  return mapBrowserEvent.type == ol.MapBrowserEvent.EventType.DBLCLICK;
};
ol.events.condition.noModifierKeys = function(mapBrowserEvent) {
  var originalEvent = mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};
ol.events.condition.platformModifierKeyOnly = function(mapBrowserEvent) {
  var originalEvent = mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && (ol.has.MAC ? originalEvent.metaKey : originalEvent.ctrlKey) && !originalEvent.shiftKey;
};
ol.events.condition.shiftKeyOnly = function(mapBrowserEvent) {
  var originalEvent = mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};
ol.events.condition.targetNotEditable = function(mapBrowserEvent) {
  var target = mapBrowserEvent.originalEvent.target;
  var tagName = target.tagName;
  return tagName !== "INPUT" && tagName !== "SELECT" && tagName !== "TEXTAREA";
};
ol.events.condition.mouseOnly = function(mapBrowserEvent) {
  ol.asserts.assert(mapBrowserEvent.pointerEvent, 56);
  return (mapBrowserEvent).pointerEvent.pointerType == "mouse";
};
ol.events.condition.primaryAction = function(mapBrowserEvent) {
  var pointerEvent = mapBrowserEvent.pointerEvent;
  return pointerEvent.isPrimary && pointerEvent.button === 0;
};
goog.provide("ol.interaction.Pointer");
goog.require("ol");
goog.require("ol.functions");
goog.require("ol.MapBrowserEvent.EventType");
goog.require("ol.MapBrowserPointerEvent");
goog.require("ol.interaction.Interaction");
goog.require("ol.obj");
ol.interaction.Pointer = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var handleEvent = options.handleEvent ? options.handleEvent : ol.interaction.Pointer.handleEvent;
  ol.interaction.Interaction.call(this, {handleEvent:handleEvent});
  this.handleDownEvent_ = options.handleDownEvent ? options.handleDownEvent : ol.interaction.Pointer.handleDownEvent;
  this.handleDragEvent_ = options.handleDragEvent ? options.handleDragEvent : ol.interaction.Pointer.handleDragEvent;
  this.handleMoveEvent_ = options.handleMoveEvent ? options.handleMoveEvent : ol.interaction.Pointer.handleMoveEvent;
  this.handleUpEvent_ = options.handleUpEvent ? options.handleUpEvent : ol.interaction.Pointer.handleUpEvent;
  this.handlingDownUpSequence = false;
  this.trackedPointers_ = {};
  this.targetPointers = [];
};
ol.inherits(ol.interaction.Pointer, ol.interaction.Interaction);
ol.interaction.Pointer.centroid = function(pointerEvents) {
  var length = pointerEvents.length;
  var clientX = 0;
  var clientY = 0;
  for (var i = 0;i < length;i++) {
    clientX += pointerEvents[i].clientX;
    clientY += pointerEvents[i].clientY;
  }
  return [clientX / length, clientY / length];
};
ol.interaction.Pointer.prototype.isPointerDraggingEvent_ = function(mapBrowserEvent) {
  var type = mapBrowserEvent.type;
  return type === ol.MapBrowserEvent.EventType.POINTERDOWN || type === ol.MapBrowserEvent.EventType.POINTERDRAG || type === ol.MapBrowserEvent.EventType.POINTERUP;
};
ol.interaction.Pointer.prototype.updateTrackedPointers_ = function(mapBrowserEvent) {
  if (this.isPointerDraggingEvent_(mapBrowserEvent)) {
    var event = mapBrowserEvent.pointerEvent;
    if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.POINTERUP) {
      delete this.trackedPointers_[event.pointerId];
    } else {
      if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.POINTERDOWN) {
        this.trackedPointers_[event.pointerId] = event;
      } else {
        if (event.pointerId in this.trackedPointers_) {
          this.trackedPointers_[event.pointerId] = event;
        }
      }
    }
    this.targetPointers = ol.obj.getValues(this.trackedPointers_);
  }
};
ol.interaction.Pointer.handleDragEvent = ol.nullFunction;
ol.interaction.Pointer.handleUpEvent = ol.functions.FALSE;
ol.interaction.Pointer.handleDownEvent = ol.functions.FALSE;
ol.interaction.Pointer.handleMoveEvent = ol.nullFunction;
ol.interaction.Pointer.handleEvent = function(mapBrowserEvent) {
  if (!(mapBrowserEvent instanceof ol.MapBrowserPointerEvent)) {
    return true;
  }
  var stopEvent = false;
  this.updateTrackedPointers_(mapBrowserEvent);
  if (this.handlingDownUpSequence) {
    if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.POINTERDRAG) {
      this.handleDragEvent_(mapBrowserEvent);
    } else {
      if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.POINTERUP) {
        this.handlingDownUpSequence = this.handleUpEvent_(mapBrowserEvent);
      }
    }
  }
  if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.POINTERDOWN) {
    var handled = this.handleDownEvent_(mapBrowserEvent);
    this.handlingDownUpSequence = handled;
    stopEvent = this.shouldStopEvent(handled);
  } else {
    if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.POINTERMOVE) {
      this.handleMoveEvent_(mapBrowserEvent);
    }
  }
  return !stopEvent;
};
ol.interaction.Pointer.prototype.shouldStopEvent = function(handled) {
  return handled;
};
goog.provide("ol.interaction.DragPan");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.coordinate");
goog.require("ol.easing");
goog.require("ol.events.condition");
goog.require("ol.functions");
goog.require("ol.interaction.Pointer");
ol.interaction.DragPan = function(opt_options) {
  ol.interaction.Pointer.call(this, {handleDownEvent:ol.interaction.DragPan.handleDownEvent_, handleDragEvent:ol.interaction.DragPan.handleDragEvent_, handleUpEvent:ol.interaction.DragPan.handleUpEvent_});
  var options = opt_options ? opt_options : {};
  this.kinetic_ = options.kinetic;
  this.lastCentroid = null;
  this.condition_ = options.condition ? options.condition : ol.events.condition.noModifierKeys;
  this.noKinetic_ = false;
};
ol.inherits(ol.interaction.DragPan, ol.interaction.Pointer);
ol.interaction.DragPan.handleDragEvent_ = function(mapBrowserEvent) {
  ol.DEBUG && console.assert(this.targetPointers.length >= 1, "the length of this.targetPointers should be more than 1");
  var centroid = ol.interaction.Pointer.centroid(this.targetPointers);
  if (this.kinetic_) {
    this.kinetic_.update(centroid[0], centroid[1]);
  }
  if (this.lastCentroid) {
    var deltaX = this.lastCentroid[0] - centroid[0];
    var deltaY = centroid[1] - this.lastCentroid[1];
    var map = mapBrowserEvent.map;
    var view = map.getView();
    var viewState = view.getState();
    var center = [deltaX, deltaY];
    ol.coordinate.scale(center, viewState.resolution);
    ol.coordinate.rotate(center, viewState.rotation);
    ol.coordinate.add(center, viewState.center);
    center = view.constrainCenter(center);
    view.setCenter(center);
  }
  this.lastCentroid = centroid;
};
ol.interaction.DragPan.handleUpEvent_ = function(mapBrowserEvent) {
  var map = mapBrowserEvent.map;
  var view = map.getView();
  if (this.targetPointers.length === 0) {
    if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
      var distance = this.kinetic_.getDistance();
      var angle = this.kinetic_.getAngle();
      var center = (view.getCenter());
      var centerpx = map.getPixelFromCoordinate(center);
      var dest = map.getCoordinateFromPixel([centerpx[0] - distance * Math.cos(angle), centerpx[1] - distance * Math.sin(angle)]);
      view.animate({center:view.constrainCenter(dest), duration:500, easing:ol.easing.easeOut});
    } else {
      map.render();
    }
    view.setHint(ol.View.Hint.INTERACTING, -1);
    return false;
  } else {
    this.lastCentroid = null;
    return true;
  }
};
ol.interaction.DragPan.handleDownEvent_ = function(mapBrowserEvent) {
  if (this.targetPointers.length > 0 && this.condition_(mapBrowserEvent)) {
    var map = mapBrowserEvent.map;
    var view = map.getView();
    this.lastCentroid = null;
    if (!this.handlingDownUpSequence) {
      view.setHint(ol.View.Hint.INTERACTING, 1);
    }
    view.setCenter(mapBrowserEvent.frameState.viewState.center);
    if (this.kinetic_) {
      this.kinetic_.begin();
    }
    this.noKinetic_ = this.targetPointers.length > 1;
    return true;
  } else {
    return false;
  }
};
ol.interaction.DragPan.prototype.shouldStopEvent = ol.functions.FALSE;
goog.provide("ol.interaction.DragRotate");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.events.condition");
goog.require("ol.functions");
goog.require("ol.interaction.Interaction");
goog.require("ol.interaction.Pointer");
ol.interaction.DragRotate = function(opt_options) {
  var options = opt_options ? opt_options : {};
  ol.interaction.Pointer.call(this, {handleDownEvent:ol.interaction.DragRotate.handleDownEvent_, handleDragEvent:ol.interaction.DragRotate.handleDragEvent_, handleUpEvent:ol.interaction.DragRotate.handleUpEvent_});
  this.condition_ = options.condition ? options.condition : ol.events.condition.altShiftKeysOnly;
  this.lastAngle_ = undefined;
  this.duration_ = options.duration !== undefined ? options.duration : 250;
};
ol.inherits(ol.interaction.DragRotate, ol.interaction.Pointer);
ol.interaction.DragRotate.handleDragEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return;
  }
  var map = mapBrowserEvent.map;
  var size = map.getSize();
  var offset = mapBrowserEvent.pixel;
  var theta = Math.atan2(size[1] / 2 - offset[1], offset[0] - size[0] / 2);
  if (this.lastAngle_ !== undefined) {
    var delta = theta - this.lastAngle_;
    var view = map.getView();
    var rotation = view.getRotation();
    ol.interaction.Interaction.rotateWithoutConstraints(map, view, rotation - delta);
  }
  this.lastAngle_ = theta;
};
ol.interaction.DragRotate.handleUpEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return true;
  }
  var map = mapBrowserEvent.map;
  var view = map.getView();
  view.setHint(ol.View.Hint.INTERACTING, -1);
  var rotation = view.getRotation();
  ol.interaction.Interaction.rotate(map, view, rotation, undefined, this.duration_);
  return false;
};
ol.interaction.DragRotate.handleDownEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return false;
  }
  if (ol.events.condition.mouseActionButton(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
    var map = mapBrowserEvent.map;
    map.getView().setHint(ol.View.Hint.INTERACTING, 1);
    this.lastAngle_ = undefined;
    return true;
  } else {
    return false;
  }
};
ol.interaction.DragRotate.prototype.shouldStopEvent = ol.functions.FALSE;
goog.provide("ol.render.Box");
goog.require("ol");
goog.require("ol.Disposable");
goog.require("ol.geom.Polygon");
ol.render.Box = function(className) {
  this.geometry_ = null;
  this.element_ = (document.createElement("div"));
  this.element_.style.position = "absolute";
  this.element_.className = "ol-box " + className;
  this.map_ = null;
  this.startPixel_ = null;
  this.endPixel_ = null;
};
ol.inherits(ol.render.Box, ol.Disposable);
ol.render.Box.prototype.disposeInternal = function() {
  this.setMap(null);
};
ol.render.Box.prototype.render_ = function() {
  var startPixel = this.startPixel_;
  var endPixel = this.endPixel_;
  var px = "px";
  var style = this.element_.style;
  style.left = Math.min(startPixel[0], endPixel[0]) + px;
  style.top = Math.min(startPixel[1], endPixel[1]) + px;
  style.width = Math.abs(endPixel[0] - startPixel[0]) + px;
  style.height = Math.abs(endPixel[1] - startPixel[1]) + px;
};
ol.render.Box.prototype.setMap = function(map) {
  if (this.map_) {
    this.map_.getOverlayContainer().removeChild(this.element_);
    var style = this.element_.style;
    style.left = style.top = style.width = style.height = "inherit";
  }
  this.map_ = map;
  if (this.map_) {
    this.map_.getOverlayContainer().appendChild(this.element_);
  }
};
ol.render.Box.prototype.setPixels = function(startPixel, endPixel) {
  this.startPixel_ = startPixel;
  this.endPixel_ = endPixel;
  this.createOrUpdateGeometry();
  this.render_();
};
ol.render.Box.prototype.createOrUpdateGeometry = function() {
  var startPixel = this.startPixel_;
  var endPixel = this.endPixel_;
  var pixels = [startPixel, [startPixel[0], endPixel[1]], endPixel, [endPixel[0], startPixel[1]]];
  var coordinates = pixels.map(this.map_.getCoordinateFromPixel, this.map_);
  coordinates[4] = coordinates[0].slice();
  if (!this.geometry_) {
    this.geometry_ = new ol.geom.Polygon([coordinates]);
  } else {
    this.geometry_.setCoordinates([coordinates]);
  }
};
ol.render.Box.prototype.getGeometry = function() {
  return this.geometry_;
};
goog.provide("ol.interaction.DragBox");
goog.require("ol.events.Event");
goog.require("ol");
goog.require("ol.events.condition");
goog.require("ol.interaction.Pointer");
goog.require("ol.render.Box");
ol.DRAG_BOX_HYSTERESIS_PIXELS_SQUARED = ol.DRAG_BOX_HYSTERESIS_PIXELS * ol.DRAG_BOX_HYSTERESIS_PIXELS;
ol.interaction.DragBox = function(opt_options) {
  ol.interaction.Pointer.call(this, {handleDownEvent:ol.interaction.DragBox.handleDownEvent_, handleDragEvent:ol.interaction.DragBox.handleDragEvent_, handleUpEvent:ol.interaction.DragBox.handleUpEvent_});
  var options = opt_options ? opt_options : {};
  this.box_ = new ol.render.Box(options.className || "ol-dragbox");
  this.startPixel_ = null;
  this.condition_ = options.condition ? options.condition : ol.events.condition.always;
  this.boxEndCondition_ = options.boxEndCondition ? options.boxEndCondition : ol.interaction.DragBox.defaultBoxEndCondition;
};
ol.inherits(ol.interaction.DragBox, ol.interaction.Pointer);
ol.interaction.DragBox.defaultBoxEndCondition = function(mapBrowserEvent, startPixel, endPixel) {
  var width = endPixel[0] - startPixel[0];
  var height = endPixel[1] - startPixel[1];
  return width * width + height * height >= ol.DRAG_BOX_HYSTERESIS_PIXELS_SQUARED;
};
ol.interaction.DragBox.handleDragEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return;
  }
  this.box_.setPixels(this.startPixel_, mapBrowserEvent.pixel);
  this.dispatchEvent(new ol.interaction.DragBox.Event(ol.interaction.DragBox.EventType.BOXDRAG, mapBrowserEvent.coordinate, mapBrowserEvent));
};
ol.interaction.DragBox.prototype.getGeometry = function() {
  return this.box_.getGeometry();
};
ol.interaction.DragBox.prototype.onBoxEnd = ol.nullFunction;
ol.interaction.DragBox.handleUpEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return true;
  }
  this.box_.setMap(null);
  if (this.boxEndCondition_(mapBrowserEvent, this.startPixel_, mapBrowserEvent.pixel)) {
    this.onBoxEnd(mapBrowserEvent);
    this.dispatchEvent(new ol.interaction.DragBox.Event(ol.interaction.DragBox.EventType.BOXEND, mapBrowserEvent.coordinate, mapBrowserEvent));
  }
  return false;
};
ol.interaction.DragBox.handleDownEvent_ = function(mapBrowserEvent) {
  if (!ol.events.condition.mouseOnly(mapBrowserEvent)) {
    return false;
  }
  if (ol.events.condition.mouseActionButton(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
    this.startPixel_ = mapBrowserEvent.pixel;
    this.box_.setMap(mapBrowserEvent.map);
    this.box_.setPixels(this.startPixel_, this.startPixel_);
    this.dispatchEvent(new ol.interaction.DragBox.Event(ol.interaction.DragBox.EventType.BOXSTART, mapBrowserEvent.coordinate, mapBrowserEvent));
    return true;
  } else {
    return false;
  }
};
ol.interaction.DragBox.EventType = {BOXSTART:"boxstart", BOXDRAG:"boxdrag", BOXEND:"boxend"};
ol.interaction.DragBox.Event = function(type, coordinate, mapBrowserEvent) {
  ol.events.Event.call(this, type);
  this.coordinate = coordinate;
  this.mapBrowserEvent = mapBrowserEvent;
};
ol.inherits(ol.interaction.DragBox.Event, ol.events.Event);
goog.provide("ol.interaction.DragZoom");
goog.require("ol");
goog.require("ol.easing");
goog.require("ol.events.condition");
goog.require("ol.extent");
goog.require("ol.interaction.DragBox");
ol.interaction.DragZoom = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var condition = options.condition ? options.condition : ol.events.condition.shiftKeyOnly;
  this.duration_ = options.duration !== undefined ? options.duration : 200;
  this.out_ = options.out !== undefined ? options.out : false;
  ol.interaction.DragBox.call(this, {condition:condition, className:options.className || "ol-dragzoom"});
};
ol.inherits(ol.interaction.DragZoom, ol.interaction.DragBox);
ol.interaction.DragZoom.prototype.onBoxEnd = function() {
  var map = this.getMap();
  var view = (map.getView());
  var size = (map.getSize());
  var extent = this.getGeometry().getExtent();
  if (this.out_) {
    var mapExtent = view.calculateExtent(size);
    var boxPixelExtent = ol.extent.createOrUpdateFromCoordinates([map.getPixelFromCoordinate(ol.extent.getBottomLeft(extent)), map.getPixelFromCoordinate(ol.extent.getTopRight(extent))]);
    var factor = view.getResolutionForExtent(boxPixelExtent, size);
    ol.extent.scaleFromCenter(mapExtent, 1 / factor);
    extent = mapExtent;
  }
  var resolution = view.constrainResolution(view.getResolutionForExtent(extent, size));
  view.animate({resolution:resolution, center:ol.extent.getCenter(extent), duration:this.duration_, easing:ol.easing.easeOut});
};
goog.provide("ol.events.KeyCode");
ol.events.KeyCode = {LEFT:37, UP:38, RIGHT:39, DOWN:40};
goog.provide("ol.interaction.KeyboardPan");
goog.require("ol");
goog.require("ol.coordinate");
goog.require("ol.events.EventType");
goog.require("ol.events.KeyCode");
goog.require("ol.events.condition");
goog.require("ol.interaction.Interaction");
ol.interaction.KeyboardPan = function(opt_options) {
  ol.interaction.Interaction.call(this, {handleEvent:ol.interaction.KeyboardPan.handleEvent});
  var options = opt_options || {};
  this.defaultCondition_ = function(mapBrowserEvent) {
    return ol.events.condition.noModifierKeys(mapBrowserEvent) && ol.events.condition.targetNotEditable(mapBrowserEvent);
  };
  this.condition_ = options.condition !== undefined ? options.condition : this.defaultCondition_;
  this.duration_ = options.duration !== undefined ? options.duration : 100;
  this.pixelDelta_ = options.pixelDelta !== undefined ? options.pixelDelta : 128;
};
ol.inherits(ol.interaction.KeyboardPan, ol.interaction.Interaction);
ol.interaction.KeyboardPan.handleEvent = function(mapBrowserEvent) {
  var stopEvent = false;
  if (mapBrowserEvent.type == ol.events.EventType.KEYDOWN) {
    var keyEvent = mapBrowserEvent.originalEvent;
    var keyCode = keyEvent.keyCode;
    if (this.condition_(mapBrowserEvent) && (keyCode == ol.events.KeyCode.DOWN || keyCode == ol.events.KeyCode.LEFT || keyCode == ol.events.KeyCode.RIGHT || keyCode == ol.events.KeyCode.UP)) {
      var map = mapBrowserEvent.map;
      var view = map.getView();
      var mapUnitsDelta = view.getResolution() * this.pixelDelta_;
      var deltaX = 0, deltaY = 0;
      if (keyCode == ol.events.KeyCode.DOWN) {
        deltaY = -mapUnitsDelta;
      } else {
        if (keyCode == ol.events.KeyCode.LEFT) {
          deltaX = -mapUnitsDelta;
        } else {
          if (keyCode == ol.events.KeyCode.RIGHT) {
            deltaX = mapUnitsDelta;
          } else {
            deltaY = mapUnitsDelta;
          }
        }
      }
      var delta = [deltaX, deltaY];
      ol.coordinate.rotate(delta, view.getRotation());
      ol.interaction.Interaction.pan(map, view, delta, this.duration_);
      mapBrowserEvent.preventDefault();
      stopEvent = true;
    }
  }
  return !stopEvent;
};
goog.provide("ol.interaction.KeyboardZoom");
goog.require("ol");
goog.require("ol.events.EventType");
goog.require("ol.events.condition");
goog.require("ol.interaction.Interaction");
ol.interaction.KeyboardZoom = function(opt_options) {
  ol.interaction.Interaction.call(this, {handleEvent:ol.interaction.KeyboardZoom.handleEvent});
  var options = opt_options ? opt_options : {};
  this.condition_ = options.condition ? options.condition : ol.events.condition.targetNotEditable;
  this.delta_ = options.delta ? options.delta : 1;
  this.duration_ = options.duration !== undefined ? options.duration : 100;
};
ol.inherits(ol.interaction.KeyboardZoom, ol.interaction.Interaction);
ol.interaction.KeyboardZoom.handleEvent = function(mapBrowserEvent) {
  var stopEvent = false;
  if (mapBrowserEvent.type == ol.events.EventType.KEYDOWN || mapBrowserEvent.type == ol.events.EventType.KEYPRESS) {
    var keyEvent = mapBrowserEvent.originalEvent;
    var charCode = keyEvent.charCode;
    if (this.condition_(mapBrowserEvent) && (charCode == "+".charCodeAt(0) || charCode == "-".charCodeAt(0))) {
      var map = mapBrowserEvent.map;
      var delta = charCode == "+".charCodeAt(0) ? this.delta_ : -this.delta_;
      var view = map.getView();
      ol.interaction.Interaction.zoomByDelta(map, view, delta, undefined, this.duration_);
      mapBrowserEvent.preventDefault();
      stopEvent = true;
    }
  }
  return !stopEvent;
};
goog.provide("ol.interaction.MouseWheelZoom");
goog.require("ol");
goog.require("ol.easing");
goog.require("ol.events.EventType");
goog.require("ol.has");
goog.require("ol.interaction.Interaction");
goog.require("ol.math");
ol.interaction.MouseWheelZoom = function(opt_options) {
  ol.interaction.Interaction.call(this, {handleEvent:ol.interaction.MouseWheelZoom.handleEvent});
  var options = opt_options || {};
  this.delta_ = 0;
  this.duration_ = options.duration !== undefined ? options.duration : 250;
  this.timeout_ = options.timeout !== undefined ? options.timeout : 80;
  this.useAnchor_ = options.useAnchor !== undefined ? options.useAnchor : true;
  this.lastAnchor_ = null;
  this.startTime_ = undefined;
  this.timeoutId_ = undefined;
  this.mode_ = undefined;
  this.trackpadDeltaPerZoom_ = 300;
  this.trackpadZoomBuffer_ = 1.5;
};
ol.inherits(ol.interaction.MouseWheelZoom, ol.interaction.Interaction);
ol.interaction.MouseWheelZoom.handleEvent = function(mapBrowserEvent) {
  var type = mapBrowserEvent.type;
  if (type !== ol.events.EventType.WHEEL && type !== ol.events.EventType.MOUSEWHEEL) {
    return true;
  }
  mapBrowserEvent.preventDefault();
  var map = mapBrowserEvent.map;
  var wheelEvent = (mapBrowserEvent.originalEvent);
  if (this.useAnchor_) {
    this.lastAnchor_ = mapBrowserEvent.coordinate;
  }
  var delta;
  if (mapBrowserEvent.type == ol.events.EventType.WHEEL) {
    delta = wheelEvent.deltaY;
    if (ol.has.FIREFOX && wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
      delta /= ol.has.DEVICE_PIXEL_RATIO;
    }
    if (wheelEvent.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      delta *= 40;
    }
  } else {
    if (mapBrowserEvent.type == ol.events.EventType.MOUSEWHEEL) {
      delta = -wheelEvent.wheelDeltaY;
      if (ol.has.SAFARI) {
        delta /= 3;
      }
    }
  }
  if (delta === 0) {
    return false;
  }
  var now = Date.now();
  if (this.startTime_ === undefined) {
    this.startTime_ = now;
  }
  if (!this.mode_ || now - this.startTime_ > 400) {
    this.mode_ = Math.abs(delta) < 4 ? ol.interaction.MouseWheelZoom.Mode.TRACKPAD : ol.interaction.MouseWheelZoom.Mode.WHEEL;
  }
  if (this.mode_ === ol.interaction.MouseWheelZoom.Mode.TRACKPAD) {
    var view = map.getView();
    var resolution = view.getResolution() * Math.pow(2, delta / this.trackpadDeltaPerZoom_);
    var minResolution = view.getMinResolution();
    var maxResolution = view.getMaxResolution();
    var rebound = 0;
    if (resolution < minResolution) {
      resolution = Math.max(resolution, minResolution / this.trackpadZoomBuffer_);
      rebound = 1;
    } else {
      if (resolution > maxResolution) {
        resolution = Math.min(resolution, maxResolution * this.trackpadZoomBuffer_);
        rebound = -1;
      }
    }
    if (this.lastAnchor_) {
      var center = view.calculateCenterZoom(resolution, this.lastAnchor_);
      view.setCenter(center);
    }
    view.setResolution(resolution);
    if (rebound > 0) {
      view.animate({resolution:minResolution, easing:ol.easing.easeOut, anchor:this.lastAnchor_, duration:500});
    } else {
      if (rebound < 0) {
        view.animate({resolution:maxResolution, easing:ol.easing.easeOut, anchor:this.lastAnchor_, duration:500});
      }
    }
    this.startTime_ = now;
    return false;
  }
  this.delta_ += delta;
  var timeLeft = Math.max(this.timeout_ - (now - this.startTime_), 0);
  clearTimeout(this.timeoutId_);
  this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, map), timeLeft);
  return false;
};
ol.interaction.MouseWheelZoom.prototype.handleWheelZoom_ = function(map) {
  var view = map.getView();
  if (view.getAnimating()) {
    view.cancelAnimations();
  }
  var maxDelta = ol.MOUSEWHEELZOOM_MAXDELTA;
  var delta = ol.math.clamp(this.delta_, -maxDelta, maxDelta);
  ol.interaction.Interaction.zoomByDelta(map, view, -delta, this.lastAnchor_, this.duration_);
  this.mode_ = undefined;
  this.delta_ = 0;
  this.lastAnchor_ = null;
  this.startTime_ = undefined;
  this.timeoutId_ = undefined;
};
ol.interaction.MouseWheelZoom.prototype.setMouseAnchor = function(useAnchor) {
  this.useAnchor_ = useAnchor;
  if (!useAnchor) {
    this.lastAnchor_ = null;
  }
};
ol.interaction.MouseWheelZoom.Mode = {TRACKPAD:"trackpad", WHEEL:"wheel"};
goog.provide("ol.interaction.PinchRotate");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.functions");
goog.require("ol.interaction.Interaction");
goog.require("ol.interaction.Pointer");
ol.interaction.PinchRotate = function(opt_options) {
  ol.interaction.Pointer.call(this, {handleDownEvent:ol.interaction.PinchRotate.handleDownEvent_, handleDragEvent:ol.interaction.PinchRotate.handleDragEvent_, handleUpEvent:ol.interaction.PinchRotate.handleUpEvent_});
  var options = opt_options || {};
  this.anchor_ = null;
  this.lastAngle_ = undefined;
  this.rotating_ = false;
  this.rotationDelta_ = 0;
  this.threshold_ = options.threshold !== undefined ? options.threshold : .3;
  this.duration_ = options.duration !== undefined ? options.duration : 250;
};
ol.inherits(ol.interaction.PinchRotate, ol.interaction.Pointer);
ol.interaction.PinchRotate.handleDragEvent_ = function(mapBrowserEvent) {
  ol.DEBUG && console.assert(this.targetPointers.length >= 2, "length of this.targetPointers should be greater than or equal to 2");
  var rotationDelta = 0;
  var touch0 = this.targetPointers[0];
  var touch1 = this.targetPointers[1];
  var angle = Math.atan2(touch1.clientY - touch0.clientY, touch1.clientX - touch0.clientX);
  if (this.lastAngle_ !== undefined) {
    var delta = angle - this.lastAngle_;
    this.rotationDelta_ += delta;
    if (!this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_) {
      this.rotating_ = true;
    }
    rotationDelta = delta;
  }
  this.lastAngle_ = angle;
  var map = mapBrowserEvent.map;
  var viewportPosition = map.getViewport().getBoundingClientRect();
  var centroid = ol.interaction.Pointer.centroid(this.targetPointers);
  centroid[0] -= viewportPosition.left;
  centroid[1] -= viewportPosition.top;
  this.anchor_ = map.getCoordinateFromPixel(centroid);
  if (this.rotating_) {
    var view = map.getView();
    var rotation = view.getRotation();
    map.render();
    ol.interaction.Interaction.rotateWithoutConstraints(map, view, rotation + rotationDelta, this.anchor_);
  }
};
ol.interaction.PinchRotate.handleUpEvent_ = function(mapBrowserEvent) {
  if (this.targetPointers.length < 2) {
    var map = mapBrowserEvent.map;
    var view = map.getView();
    view.setHint(ol.View.Hint.INTERACTING, -1);
    if (this.rotating_) {
      var rotation = view.getRotation();
      ol.interaction.Interaction.rotate(map, view, rotation, this.anchor_, this.duration_);
    }
    return false;
  } else {
    return true;
  }
};
ol.interaction.PinchRotate.handleDownEvent_ = function(mapBrowserEvent) {
  if (this.targetPointers.length >= 2) {
    var map = mapBrowserEvent.map;
    this.anchor_ = null;
    this.lastAngle_ = undefined;
    this.rotating_ = false;
    this.rotationDelta_ = 0;
    if (!this.handlingDownUpSequence) {
      map.getView().setHint(ol.View.Hint.INTERACTING, 1);
    }
    map.render();
    return true;
  } else {
    return false;
  }
};
ol.interaction.PinchRotate.prototype.shouldStopEvent = ol.functions.FALSE;
goog.provide("ol.interaction.PinchZoom");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.functions");
goog.require("ol.interaction.Interaction");
goog.require("ol.interaction.Pointer");
ol.interaction.PinchZoom = function(opt_options) {
  ol.interaction.Pointer.call(this, {handleDownEvent:ol.interaction.PinchZoom.handleDownEvent_, handleDragEvent:ol.interaction.PinchZoom.handleDragEvent_, handleUpEvent:ol.interaction.PinchZoom.handleUpEvent_});
  var options = opt_options ? opt_options : {};
  this.anchor_ = null;
  this.duration_ = options.duration !== undefined ? options.duration : 400;
  this.lastDistance_ = undefined;
  this.lastScaleDelta_ = 1;
};
ol.inherits(ol.interaction.PinchZoom, ol.interaction.Pointer);
ol.interaction.PinchZoom.handleDragEvent_ = function(mapBrowserEvent) {
  ol.DEBUG && console.assert(this.targetPointers.length >= 2, "length of this.targetPointers should be 2 or more");
  var scaleDelta = 1;
  var touch0 = this.targetPointers[0];
  var touch1 = this.targetPointers[1];
  var dx = touch0.clientX - touch1.clientX;
  var dy = touch0.clientY - touch1.clientY;
  var distance = Math.sqrt(dx * dx + dy * dy);
  if (this.lastDistance_ !== undefined) {
    scaleDelta = this.lastDistance_ / distance;
  }
  this.lastDistance_ = distance;
  if (scaleDelta != 1) {
    this.lastScaleDelta_ = scaleDelta;
  }
  var map = mapBrowserEvent.map;
  var view = map.getView();
  var resolution = view.getResolution();
  var viewportPosition = map.getViewport().getBoundingClientRect();
  var centroid = ol.interaction.Pointer.centroid(this.targetPointers);
  centroid[0] -= viewportPosition.left;
  centroid[1] -= viewportPosition.top;
  this.anchor_ = map.getCoordinateFromPixel(centroid);
  map.render();
  ol.interaction.Interaction.zoomWithoutConstraints(map, view, resolution * scaleDelta, this.anchor_);
};
ol.interaction.PinchZoom.handleUpEvent_ = function(mapBrowserEvent) {
  if (this.targetPointers.length < 2) {
    var map = mapBrowserEvent.map;
    var view = map.getView();
    view.setHint(ol.View.Hint.INTERACTING, -1);
    var resolution = view.getResolution();
    var direction = this.lastScaleDelta_ - 1;
    ol.interaction.Interaction.zoom(map, view, resolution, this.anchor_, this.duration_, direction);
    return false;
  } else {
    return true;
  }
};
ol.interaction.PinchZoom.handleDownEvent_ = function(mapBrowserEvent) {
  if (this.targetPointers.length >= 2) {
    var map = mapBrowserEvent.map;
    this.anchor_ = null;
    this.lastDistance_ = undefined;
    this.lastScaleDelta_ = 1;
    if (!this.handlingDownUpSequence) {
      map.getView().setHint(ol.View.Hint.INTERACTING, 1);
    }
    map.render();
    return true;
  } else {
    return false;
  }
};
ol.interaction.PinchZoom.prototype.shouldStopEvent = ol.functions.FALSE;
goog.provide("ol.interaction");
goog.require("ol");
goog.require("ol.Collection");
goog.require("ol.Kinetic");
goog.require("ol.interaction.DoubleClickZoom");
goog.require("ol.interaction.DragPan");
goog.require("ol.interaction.DragRotate");
goog.require("ol.interaction.DragZoom");
goog.require("ol.interaction.KeyboardPan");
goog.require("ol.interaction.KeyboardZoom");
goog.require("ol.interaction.MouseWheelZoom");
goog.require("ol.interaction.PinchRotate");
goog.require("ol.interaction.PinchZoom");
ol.interaction.defaults = function(opt_options) {
  var options = opt_options ? opt_options : {};
  var interactions = new ol.Collection;
  var kinetic = new ol.Kinetic(-.005, .05, 100);
  var altShiftDragRotate = options.altShiftDragRotate !== undefined ? options.altShiftDragRotate : true;
  if (altShiftDragRotate) {
    interactions.push(new ol.interaction.DragRotate);
  }
  var doubleClickZoom = options.doubleClickZoom !== undefined ? options.doubleClickZoom : true;
  if (doubleClickZoom) {
    interactions.push(new ol.interaction.DoubleClickZoom({delta:options.zoomDelta, duration:options.zoomDuration}));
  }
  var dragPan = options.dragPan !== undefined ? options.dragPan : true;
  if (dragPan) {
    interactions.push(new ol.interaction.DragPan({kinetic:kinetic}));
  }
  var pinchRotate = options.pinchRotate !== undefined ? options.pinchRotate : true;
  if (pinchRotate) {
    interactions.push(new ol.interaction.PinchRotate);
  }
  var pinchZoom = options.pinchZoom !== undefined ? options.pinchZoom : true;
  if (pinchZoom) {
    interactions.push(new ol.interaction.PinchZoom({duration:options.zoomDuration}));
  }
  var keyboard = options.keyboard !== undefined ? options.keyboard : true;
  if (keyboard) {
    interactions.push(new ol.interaction.KeyboardPan);
    interactions.push(new ol.interaction.KeyboardZoom({delta:options.zoomDelta, duration:options.zoomDuration}));
  }
  var mouseWheelZoom = options.mouseWheelZoom !== undefined ? options.mouseWheelZoom : true;
  if (mouseWheelZoom) {
    interactions.push(new ol.interaction.MouseWheelZoom({duration:options.zoomDuration}));
  }
  var shiftDragZoom = options.shiftDragZoom !== undefined ? options.shiftDragZoom : true;
  if (shiftDragZoom) {
    interactions.push(new ol.interaction.DragZoom({duration:options.zoomDuration}));
  }
  return interactions;
};
goog.provide("ol.layer.Group");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.Collection");
goog.require("ol.Object");
goog.require("ol.ObjectEventType");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.layer.Base");
goog.require("ol.obj");
goog.require("ol.source.State");
ol.layer.Group = function(opt_options) {
  var options = opt_options || {};
  var baseOptions = (ol.obj.assign({}, options));
  delete baseOptions.layers;
  var layers = options.layers;
  ol.layer.Base.call(this, baseOptions);
  this.layersListenerKeys_ = [];
  this.listenerKeys_ = {};
  ol.events.listen(this, ol.Object.getChangeEventType(ol.layer.Group.Property.LAYERS), this.handleLayersChanged_, this);
  if (layers) {
    if (Array.isArray(layers)) {
      layers = new ol.Collection(layers.slice());
    } else {
      ol.asserts.assert(layers instanceof ol.Collection, 43);
      layers = layers;
    }
  } else {
    layers = new ol.Collection;
  }
  this.setLayers(layers);
};
ol.inherits(ol.layer.Group, ol.layer.Base);
ol.layer.Group.prototype.handleLayerChange_ = function() {
  if (this.getVisible()) {
    this.changed();
  }
};
ol.layer.Group.prototype.handleLayersChanged_ = function(event) {
  this.layersListenerKeys_.forEach(ol.events.unlistenByKey);
  this.layersListenerKeys_.length = 0;
  var layers = this.getLayers();
  this.layersListenerKeys_.push(ol.events.listen(layers, ol.Collection.EventType.ADD, this.handleLayersAdd_, this), ol.events.listen(layers, ol.Collection.EventType.REMOVE, this.handleLayersRemove_, this));
  for (var id in this.listenerKeys_) {
    this.listenerKeys_[id].forEach(ol.events.unlistenByKey);
  }
  ol.obj.clear(this.listenerKeys_);
  var layersArray = layers.getArray();
  var i, ii, layer;
  for (i = 0, ii = layersArray.length;i < ii;i++) {
    layer = layersArray[i];
    this.listenerKeys_[ol.getUid(layer).toString()] = [ol.events.listen(layer, ol.ObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this), ol.events.listen(layer, ol.events.EventType.CHANGE, this.handleLayerChange_, this)];
  }
  this.changed();
};
ol.layer.Group.prototype.handleLayersAdd_ = function(collectionEvent) {
  var layer = (collectionEvent.element);
  var key = ol.getUid(layer).toString();
  ol.DEBUG && console.assert(!(key in this.listenerKeys_), "listeners already registered");
  this.listenerKeys_[key] = [ol.events.listen(layer, ol.ObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this), ol.events.listen(layer, ol.events.EventType.CHANGE, this.handleLayerChange_, this)];
  this.changed();
};
ol.layer.Group.prototype.handleLayersRemove_ = function(collectionEvent) {
  var layer = (collectionEvent.element);
  var key = ol.getUid(layer).toString();
  ol.DEBUG && console.assert(key in this.listenerKeys_, "no listeners to unregister");
  this.listenerKeys_[key].forEach(ol.events.unlistenByKey);
  delete this.listenerKeys_[key];
  this.changed();
};
ol.layer.Group.prototype.getLayers = function() {
  return (this.get(ol.layer.Group.Property.LAYERS));
};
ol.layer.Group.prototype.setLayers = function(layers) {
  this.set(ol.layer.Group.Property.LAYERS, layers);
};
ol.layer.Group.prototype.getLayersArray = function(opt_array) {
  var array = opt_array !== undefined ? opt_array : [];
  this.getLayers().forEach(function(layer) {
    layer.getLayersArray(array);
  });
  return array;
};
ol.layer.Group.prototype.getLayerStatesArray = function(opt_states) {
  var states = opt_states !== undefined ? opt_states : [];
  var pos = states.length;
  this.getLayers().forEach(function(layer) {
    layer.getLayerStatesArray(states);
  });
  var ownLayerState = this.getLayerState();
  var i, ii, layerState;
  for (i = pos, ii = states.length;i < ii;i++) {
    layerState = states[i];
    layerState.opacity *= ownLayerState.opacity;
    layerState.visible = layerState.visible && ownLayerState.visible;
    layerState.maxResolution = Math.min(layerState.maxResolution, ownLayerState.maxResolution);
    layerState.minResolution = Math.max(layerState.minResolution, ownLayerState.minResolution);
    if (ownLayerState.extent !== undefined) {
      if (layerState.extent !== undefined) {
        layerState.extent = ol.extent.getIntersection(layerState.extent, ownLayerState.extent);
      } else {
        layerState.extent = ownLayerState.extent;
      }
    }
  }
  return states;
};
ol.layer.Group.prototype.getSourceState = function() {
  return ol.source.State.READY;
};
ol.layer.Group.Property = {LAYERS:"layers"};
goog.provide("ol.proj.EPSG3857");
goog.require("ol");
goog.require("ol.math");
goog.require("ol.proj");
goog.require("ol.proj.Projection");
goog.require("ol.proj.Units");
ol.proj.EPSG3857_ = function(code) {
  ol.proj.Projection.call(this, {code:code, units:ol.proj.Units.METERS, extent:ol.proj.EPSG3857.EXTENT, global:true, worldExtent:ol.proj.EPSG3857.WORLD_EXTENT});
};
ol.inherits(ol.proj.EPSG3857_, ol.proj.Projection);
ol.proj.EPSG3857_.prototype.getPointResolution = function(resolution, point) {
  return resolution / ol.math.cosh(point[1] / ol.proj.EPSG3857.RADIUS);
};
ol.proj.EPSG3857.RADIUS = 6378137;
ol.proj.EPSG3857.HALF_SIZE = Math.PI * ol.proj.EPSG3857.RADIUS;
ol.proj.EPSG3857.EXTENT = [-ol.proj.EPSG3857.HALF_SIZE, -ol.proj.EPSG3857.HALF_SIZE, ol.proj.EPSG3857.HALF_SIZE, ol.proj.EPSG3857.HALF_SIZE];
ol.proj.EPSG3857.WORLD_EXTENT = [-180, -85, 180, 85];
ol.proj.EPSG3857.CODES = ["EPSG:3857", "EPSG:102100", "EPSG:102113", "EPSG:900913", "urn:ogc:def:crs:EPSG:6.18:3:3857", "urn:ogc:def:crs:EPSG::3857", "http://www.opengis.net/gml/srs/epsg.xml#3857"];
ol.proj.EPSG3857.PROJECTIONS = ol.proj.EPSG3857.CODES.map(function(code) {
  return new ol.proj.EPSG3857_(code);
});
ol.proj.EPSG3857.fromEPSG4326 = function(input, opt_output, opt_dimension) {
  var length = input.length, dimension = opt_dimension > 1 ? opt_dimension : 2, output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  ol.DEBUG && console.assert(output.length % dimension === 0, "modulus of output.length with dimension should be 0");
  var halfSize = ol.proj.EPSG3857.HALF_SIZE;
  for (var i = 0;i < length;i += dimension) {
    output[i] = halfSize * input[i] / 180;
    var y = ol.proj.EPSG3857.RADIUS * Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
    if (y > halfSize) {
      y = halfSize;
    } else {
      if (y < -halfSize) {
        y = -halfSize;
      }
    }
    output[i + 1] = y;
  }
  return output;
};
ol.proj.EPSG3857.toEPSG4326 = function(input, opt_output, opt_dimension) {
  var length = input.length, dimension = opt_dimension > 1 ? opt_dimension : 2, output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  ol.DEBUG && console.assert(output.length % dimension === 0, "modulus of output.length with dimension should be 0");
  for (var i = 0;i < length;i += dimension) {
    output[i] = 180 * input[i] / ol.proj.EPSG3857.HALF_SIZE;
    output[i + 1] = 360 * Math.atan(Math.exp(input[i + 1] / ol.proj.EPSG3857.RADIUS)) / Math.PI - 90;
  }
  return output;
};
goog.provide("ol.sphere.WGS84");
goog.require("ol.Sphere");
ol.sphere.WGS84 = new ol.Sphere(6378137);
goog.provide("ol.proj.EPSG4326");
goog.require("ol");
goog.require("ol.proj");
goog.require("ol.proj.Projection");
goog.require("ol.proj.Units");
goog.require("ol.sphere.WGS84");
ol.proj.EPSG4326_ = function(code, opt_axisOrientation) {
  ol.proj.Projection.call(this, {code:code, units:ol.proj.Units.DEGREES, extent:ol.proj.EPSG4326.EXTENT, axisOrientation:opt_axisOrientation, global:true, metersPerUnit:ol.proj.EPSG4326.METERS_PER_UNIT, worldExtent:ol.proj.EPSG4326.EXTENT});
};
ol.inherits(ol.proj.EPSG4326_, ol.proj.Projection);
ol.proj.EPSG4326_.prototype.getPointResolution = function(resolution, point) {
  return resolution;
};
ol.proj.EPSG4326.EXTENT = [-180, -90, 180, 90];
ol.proj.EPSG4326.METERS_PER_UNIT = Math.PI * ol.sphere.WGS84.radius / 180;
ol.proj.EPSG4326.PROJECTIONS = [new ol.proj.EPSG4326_("CRS:84"), new ol.proj.EPSG4326_("EPSG:4326", "neu"), new ol.proj.EPSG4326_("urn:ogc:def:crs:EPSG::4326", "neu"), new ol.proj.EPSG4326_("urn:ogc:def:crs:EPSG:6.6:4326", "neu"), new ol.proj.EPSG4326_("urn:ogc:def:crs:OGC:1.3:CRS84"), new ol.proj.EPSG4326_("urn:ogc:def:crs:OGC:2:84"), new ol.proj.EPSG4326_("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"), new ol.proj.EPSG4326_("urn:x-ogc:def:crs:EPSG:4326", "neu")];
goog.provide("ol.proj.common");
goog.require("ol.proj");
goog.require("ol.proj.EPSG3857");
goog.require("ol.proj.EPSG4326");
ol.proj.common.add = function() {
  ol.proj.addEquivalentProjections(ol.proj.EPSG3857.PROJECTIONS);
  ol.proj.addEquivalentProjections(ol.proj.EPSG4326.PROJECTIONS);
  ol.proj.addEquivalentTransforms(ol.proj.EPSG4326.PROJECTIONS, ol.proj.EPSG3857.PROJECTIONS, ol.proj.EPSG3857.fromEPSG4326, ol.proj.EPSG3857.toEPSG4326);
};
goog.provide("ol.renderer.Type");
ol.renderer.Type = {CANVAS:"canvas", WEBGL:"webgl"};
goog.provide("ol.transform");
goog.require("ol.asserts");
ol.transform.tmp_ = new Array(6);
ol.transform.create = function() {
  return [1, 0, 0, 1, 0, 0];
};
ol.transform.reset = function(transform) {
  return ol.transform.set(transform, 1, 0, 0, 1, 0, 0);
};
ol.transform.multiply = function(transform1, transform2) {
  var a1 = transform1[0];
  var b1 = transform1[1];
  var c1 = transform1[2];
  var d1 = transform1[3];
  var e1 = transform1[4];
  var f1 = transform1[5];
  var a2 = transform2[0];
  var b2 = transform2[1];
  var c2 = transform2[2];
  var d2 = transform2[3];
  var e2 = transform2[4];
  var f2 = transform2[5];
  transform1[0] = a1 * a2 + c1 * b2;
  transform1[1] = b1 * a2 + d1 * b2;
  transform1[2] = a1 * c2 + c1 * d2;
  transform1[3] = b1 * c2 + d1 * d2;
  transform1[4] = a1 * e2 + c1 * f2 + e1;
  transform1[5] = b1 * e2 + d1 * f2 + f1;
  return transform1;
};
ol.transform.set = function(transform, a, b, c, d, e, f) {
  transform[0] = a;
  transform[1] = b;
  transform[2] = c;
  transform[3] = d;
  transform[4] = e;
  transform[5] = f;
  return transform;
};
ol.transform.setFromArray = function(transform1, transform2) {
  transform1[0] = transform2[0];
  transform1[1] = transform2[1];
  transform1[2] = transform2[2];
  transform1[3] = transform2[3];
  transform1[4] = transform2[4];
  transform1[5] = transform2[5];
  return transform1;
};
ol.transform.apply = function(transform, coordinate) {
  var x = coordinate[0], y = coordinate[1];
  coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
  coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
  return coordinate;
};
ol.transform.rotate = function(transform, angle) {
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return ol.transform.multiply(transform, ol.transform.set(ol.transform.tmp_, cos, sin, -sin, cos, 0, 0));
};
ol.transform.scale = function(transform, x, y) {
  return ol.transform.multiply(transform, ol.transform.set(ol.transform.tmp_, x, 0, 0, y, 0, 0));
};
ol.transform.translate = function(transform, dx, dy) {
  return ol.transform.multiply(transform, ol.transform.set(ol.transform.tmp_, 1, 0, 0, 1, dx, dy));
};
ol.transform.compose = function(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  transform[0] = sx * cos;
  transform[1] = sy * sin;
  transform[2] = -sx * sin;
  transform[3] = sy * cos;
  transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
  transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
  return transform;
};
ol.transform.invert = function(transform) {
  var det = ol.transform.determinant(transform);
  ol.asserts.assert(det !== 0, 32);
  var a = transform[0];
  var b = transform[1];
  var c = transform[2];
  var d = transform[3];
  var e = transform[4];
  var f = transform[5];
  transform[0] = d / det;
  transform[1] = -b / det;
  transform[2] = -c / det;
  transform[3] = a / det;
  transform[4] = (c * f - d * e) / det;
  transform[5] = -(a * f - b * e) / det;
  return transform;
};
ol.transform.determinant = function(mat) {
  return mat[0] * mat[3] - mat[1] * mat[2];
};
goog.provide("ol.renderer.Map");
goog.require("ol");
goog.require("ol.Disposable");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.functions");
goog.require("ol.layer.Layer");
goog.require("ol.style");
goog.require("ol.transform");
ol.renderer.Map = function(container, map) {
  ol.Disposable.call(this);
  this.map_ = map;
  this.layerRenderers_ = {};
  this.layerRendererListeners_ = {};
};
ol.inherits(ol.renderer.Map, ol.Disposable);
ol.renderer.Map.prototype.calculateMatrices2D = function(frameState) {
  var viewState = frameState.viewState;
  var coordinateToPixelTransform = frameState.coordinateToPixelTransform;
  var pixelToCoordinateTransform = frameState.pixelToCoordinateTransform;
  ol.DEBUG && console.assert(coordinateToPixelTransform, "frameState has a coordinateToPixelTransform");
  ol.transform.compose(coordinateToPixelTransform, frameState.size[0] / 2, frameState.size[1] / 2, 1 / viewState.resolution, -1 / viewState.resolution, -viewState.rotation, -viewState.center[0], -viewState.center[1]);
  ol.transform.invert(ol.transform.setFromArray(pixelToCoordinateTransform, coordinateToPixelTransform));
};
ol.renderer.Map.prototype.createLayerRenderer = function(layer) {
};
ol.renderer.Map.prototype.disposeInternal = function() {
  for (var id in this.layerRenderers_) {
    this.layerRenderers_[id].dispose();
  }
};
ol.renderer.Map.expireIconCache_ = function(map, frameState) {
  var cache = ol.style.iconImageCache;
  cache.expire();
};
ol.renderer.Map.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg, layerFilter, thisArg2) {
  var result;
  var viewState = frameState.viewState;
  var viewResolution = viewState.resolution;
  function forEachFeatureAtCoordinate(feature, layer) {
    var key = ol.getUid(feature).toString();
    var managed = frameState.layerStates[ol.getUid(layer)].managed;
    if (!(key in frameState.skippedFeatureUids && !managed)) {
      return callback.call(thisArg, feature, managed ? layer : null);
    }
  }
  var projection = viewState.projection;
  var translatedCoordinate = coordinate;
  if (projection.canWrapX()) {
    var projectionExtent = projection.getExtent();
    var worldWidth = ol.extent.getWidth(projectionExtent);
    var x = coordinate[0];
    if (x < projectionExtent[0] || x > projectionExtent[2]) {
      var worldsAway = Math.ceil((projectionExtent[0] - x) / worldWidth);
      translatedCoordinate = [x + worldWidth * worldsAway, coordinate[1]];
    }
  }
  var layerStates = frameState.layerStatesArray;
  var numLayers = layerStates.length;
  var i;
  for (i = numLayers - 1;i >= 0;--i) {
    var layerState = layerStates[i];
    var layer = layerState.layer;
    if (ol.layer.Layer.visibleAtResolution(layerState, viewResolution) && layerFilter.call(thisArg2, layer)) {
      var layerRenderer = this.getLayerRenderer(layer);
      if (layer.getSource()) {
        result = layerRenderer.forEachFeatureAtCoordinate(layer.getSource().getWrapX() ? translatedCoordinate : coordinate, frameState, forEachFeatureAtCoordinate, thisArg);
      }
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};
ol.renderer.Map.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg, layerFilter, thisArg2) {
  var result;
  var viewState = frameState.viewState;
  var viewResolution = viewState.resolution;
  var layerStates = frameState.layerStatesArray;
  var numLayers = layerStates.length;
  var i;
  for (i = numLayers - 1;i >= 0;--i) {
    var layerState = layerStates[i];
    var layer = layerState.layer;
    if (ol.layer.Layer.visibleAtResolution(layerState, viewResolution) && layerFilter.call(thisArg2, layer)) {
      var layerRenderer = this.getLayerRenderer(layer);
      result = layerRenderer.forEachLayerAtPixel(pixel, frameState, callback, thisArg);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};
ol.renderer.Map.prototype.hasFeatureAtCoordinate = function(coordinate, frameState, layerFilter, thisArg) {
  var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, ol.functions.TRUE, this, layerFilter, thisArg);
  return hasFeature !== undefined;
};
ol.renderer.Map.prototype.getLayerRenderer = function(layer) {
  var layerKey = ol.getUid(layer).toString();
  if (layerKey in this.layerRenderers_) {
    return this.layerRenderers_[layerKey];
  } else {
    var layerRenderer = this.createLayerRenderer(layer);
    this.layerRenderers_[layerKey] = layerRenderer;
    this.layerRendererListeners_[layerKey] = ol.events.listen(layerRenderer, ol.events.EventType.CHANGE, this.handleLayerRendererChange_, this);
    return layerRenderer;
  }
};
ol.renderer.Map.prototype.getLayerRendererByKey = function(layerKey) {
  ol.DEBUG && console.assert(layerKey in this.layerRenderers_, "given layerKey (%s) exists in layerRenderers", layerKey);
  return this.layerRenderers_[layerKey];
};
ol.renderer.Map.prototype.getLayerRenderers = function() {
  return this.layerRenderers_;
};
ol.renderer.Map.prototype.getMap = function() {
  return this.map_;
};
ol.renderer.Map.prototype.getType = function() {
};
ol.renderer.Map.prototype.handleLayerRendererChange_ = function() {
  this.map_.render();
};
ol.renderer.Map.prototype.removeLayerRendererByKey_ = function(layerKey) {
  ol.DEBUG && console.assert(layerKey in this.layerRenderers_, "given layerKey (%s) exists in layerRenderers", layerKey);
  var layerRenderer = this.layerRenderers_[layerKey];
  delete this.layerRenderers_[layerKey];
  ol.DEBUG && console.assert(layerKey in this.layerRendererListeners_, "given layerKey (%s) exists in layerRendererListeners", layerKey);
  ol.events.unlistenByKey(this.layerRendererListeners_[layerKey]);
  delete this.layerRendererListeners_[layerKey];
  return layerRenderer;
};
ol.renderer.Map.prototype.renderFrame = ol.nullFunction;
ol.renderer.Map.prototype.removeUnusedLayerRenderers_ = function(map, frameState) {
  var layerKey;
  for (layerKey in this.layerRenderers_) {
    if (!frameState || !(layerKey in frameState.layerStates)) {
      this.removeLayerRendererByKey_(layerKey).dispose();
    }
  }
};
ol.renderer.Map.prototype.scheduleExpireIconCache = function(frameState) {
  frameState.postRenderFunctions.push((ol.renderer.Map.expireIconCache_));
};
ol.renderer.Map.prototype.scheduleRemoveUnusedLayerRenderers = function(frameState) {
  var layerKey;
  for (layerKey in this.layerRenderers_) {
    if (!(layerKey in frameState.layerStates)) {
      frameState.postRenderFunctions.push((this.removeUnusedLayerRenderers_.bind(this)));
      return;
    }
  }
};
ol.renderer.Map.sortByZIndex = function(state1, state2) {
  return state1.zIndex - state2.zIndex;
};
goog.provide("ol.layer.Image");
goog.require("ol");
goog.require("ol.layer.Layer");
ol.layer.Image = function(opt_options) {
  var options = opt_options ? opt_options : {};
  ol.layer.Layer.call(this, (options));
};
ol.inherits(ol.layer.Image, ol.layer.Layer);
ol.layer.Image.prototype.getSource;
goog.provide("ol.render.VectorContext");
ol.render.VectorContext = function() {
};
ol.render.VectorContext.prototype.drawGeometry = function(geometry) {
};
ol.render.VectorContext.prototype.setStyle = function(style) {
};
ol.render.VectorContext.prototype.drawCircle = function(circleGeometry, feature) {
};
ol.render.VectorContext.prototype.drawFeature = function(feature, style) {
};
ol.render.VectorContext.prototype.drawGeometryCollection = function(geometryCollectionGeometry, feature) {
};
ol.render.VectorContext.prototype.drawLineString = function(lineStringGeometry, feature) {
};
ol.render.VectorContext.prototype.drawMultiLineString = function(multiLineStringGeometry, feature) {
};
ol.render.VectorContext.prototype.drawMultiPoint = function(multiPointGeometry, feature) {
};
ol.render.VectorContext.prototype.drawMultiPolygon = function(multiPolygonGeometry, feature) {
};
ol.render.VectorContext.prototype.drawPoint = function(pointGeometry, feature) {
};
ol.render.VectorContext.prototype.drawPolygon = function(polygonGeometry, feature) {
};
ol.render.VectorContext.prototype.drawText = function(flatCoordinates, offset, end, stride, geometry, feature) {
};
ol.render.VectorContext.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {
};
ol.render.VectorContext.prototype.setImageStyle = function(imageStyle) {
};
ol.render.VectorContext.prototype.setTextStyle = function(textStyle) {
};
goog.provide("ol.render.canvas.Immediate");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.colorlike");
goog.require("ol.extent");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.transform");
goog.require("ol.has");
goog.require("ol.render.VectorContext");
goog.require("ol.render.canvas");
goog.require("ol.transform");
ol.render.canvas.Immediate = function(context, pixelRatio, extent, transform, viewRotation) {
  ol.render.VectorContext.call(this);
  this.context_ = context;
  this.pixelRatio_ = pixelRatio;
  this.extent_ = extent;
  this.transform_ = transform;
  this.viewRotation_ = viewRotation;
  this.contextFillState_ = null;
  this.contextStrokeState_ = null;
  this.contextTextState_ = null;
  this.fillState_ = null;
  this.strokeState_ = null;
  this.image_ = null;
  this.imageAnchorX_ = 0;
  this.imageAnchorY_ = 0;
  this.imageHeight_ = 0;
  this.imageOpacity_ = 0;
  this.imageOriginX_ = 0;
  this.imageOriginY_ = 0;
  this.imageRotateWithView_ = false;
  this.imageRotation_ = 0;
  this.imageScale_ = 0;
  this.imageSnapToPixel_ = false;
  this.imageWidth_ = 0;
  this.text_ = "";
  this.textOffsetX_ = 0;
  this.textOffsetY_ = 0;
  this.textRotateWithView_ = false;
  this.textRotation_ = 0;
  this.textScale_ = 0;
  this.textFillState_ = null;
  this.textStrokeState_ = null;
  this.textState_ = null;
  this.pixelCoordinates_ = [];
  this.tmpLocalTransform_ = ol.transform.create();
};
ol.inherits(ol.render.canvas.Immediate, ol.render.VectorContext);
ol.render.canvas.Immediate.prototype.drawImages_ = function(flatCoordinates, offset, end, stride) {
  if (!this.image_) {
    return;
  }
  ol.DEBUG && console.assert(offset === 0, "offset should be 0");
  ol.DEBUG && console.assert(end == flatCoordinates.length, "end should be equal to the length of flatCoordinates");
  var pixelCoordinates = ol.geom.flat.transform.transform2D(flatCoordinates, offset, end, 2, this.transform_, this.pixelCoordinates_);
  var context = this.context_;
  var localTransform = this.tmpLocalTransform_;
  var alpha = context.globalAlpha;
  if (this.imageOpacity_ != 1) {
    context.globalAlpha = alpha * this.imageOpacity_;
  }
  var rotation = this.imageRotation_;
  if (this.imageRotateWithView_) {
    rotation += this.viewRotation_;
  }
  var i, ii;
  for (i = 0, ii = pixelCoordinates.length;i < ii;i += 2) {
    var x = pixelCoordinates[i] - this.imageAnchorX_;
    var y = pixelCoordinates[i + 1] - this.imageAnchorY_;
    if (this.imageSnapToPixel_) {
      x = Math.round(x);
      y = Math.round(y);
    }
    if (rotation !== 0 || this.imageScale_ != 1) {
      var centerX = x + this.imageAnchorX_;
      var centerY = y + this.imageAnchorY_;
      ol.transform.compose(localTransform, centerX, centerY, this.imageScale_, this.imageScale_, rotation, -centerX, -centerY);
      context.setTransform.apply(context, localTransform);
    }
    context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, x, y, this.imageWidth_, this.imageHeight_);
  }
  if (rotation !== 0 || this.imageScale_ != 1) {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
  if (this.imageOpacity_ != 1) {
    context.globalAlpha = alpha;
  }
};
ol.render.canvas.Immediate.prototype.drawText_ = function(flatCoordinates, offset, end, stride) {
  if (!this.textState_ || this.text_ === "") {
    return;
  }
  if (this.textFillState_) {
    this.setContextFillState_(this.textFillState_);
  }
  if (this.textStrokeState_) {
    this.setContextStrokeState_(this.textStrokeState_);
  }
  this.setContextTextState_(this.textState_);
  ol.DEBUG && console.assert(offset === 0, "offset should be 0");
  ol.DEBUG && console.assert(end == flatCoordinates.length, "end should be equal to the length of flatCoordinates");
  var pixelCoordinates = ol.geom.flat.transform.transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
  var context = this.context_;
  var rotation = this.textRotation_;
  if (this.textRotateWithView_) {
    rotation += this.viewRotation_;
  }
  for (;offset < end;offset += stride) {
    var x = pixelCoordinates[offset] + this.textOffsetX_;
    var y = pixelCoordinates[offset + 1] + this.textOffsetY_;
    if (rotation !== 0 || this.textScale_ != 1) {
      var localTransform = ol.transform.compose(this.tmpLocalTransform_, x, y, this.textScale_, this.textScale_, rotation, -x, -y);
      context.setTransform.apply(context, localTransform);
    }
    if (this.textStrokeState_) {
      context.strokeText(this.text_, x, y);
    }
    if (this.textFillState_) {
      context.fillText(this.text_, x, y);
    }
  }
  if (rotation !== 0 || this.textScale_ != 1) {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
};
ol.render.canvas.Immediate.prototype.moveToLineTo_ = function(flatCoordinates, offset, end, stride, close) {
  var context = this.context_;
  var pixelCoordinates = ol.geom.flat.transform.transform2D(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
  context.moveTo(pixelCoordinates[0], pixelCoordinates[1]);
  var length = pixelCoordinates.length;
  if (close) {
    length -= 2;
  }
  for (var i = 2;i < length;i += 2) {
    context.lineTo(pixelCoordinates[i], pixelCoordinates[i + 1]);
  }
  if (close) {
    context.closePath();
  }
  return end;
};
ol.render.canvas.Immediate.prototype.drawRings_ = function(flatCoordinates, offset, ends, stride) {
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, true);
  }
  return offset;
};
ol.render.canvas.Immediate.prototype.drawCircle = function(geometry) {
  if (!ol.extent.intersects(this.extent_, geometry.getExtent())) {
    return;
  }
  if (this.fillState_ || this.strokeState_) {
    if (this.fillState_) {
      this.setContextFillState_(this.fillState_);
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
    }
    var pixelCoordinates = ol.geom.SimpleGeometry.transform2D(geometry, this.transform_, this.pixelCoordinates_);
    var dx = pixelCoordinates[2] - pixelCoordinates[0];
    var dy = pixelCoordinates[3] - pixelCoordinates[1];
    var radius = Math.sqrt(dx * dx + dy * dy);
    var context = this.context_;
    context.beginPath();
    context.arc(pixelCoordinates[0], pixelCoordinates[1], radius, 0, 2 * Math.PI);
    if (this.fillState_) {
      context.fill();
    }
    if (this.strokeState_) {
      context.stroke();
    }
  }
  if (this.text_ !== "") {
    this.drawText_(geometry.getCenter(), 0, 2, 2);
  }
};
ol.render.canvas.Immediate.prototype.setStyle = function(style) {
  this.setFillStrokeStyle(style.getFill(), style.getStroke());
  this.setImageStyle(style.getImage());
  this.setTextStyle(style.getText());
};
ol.render.canvas.Immediate.prototype.drawGeometry = function(geometry) {
  var type = geometry.getType();
  switch(type) {
    case ol.geom.GeometryType.POINT:
      this.drawPoint((geometry));
      break;
    case ol.geom.GeometryType.LINE_STRING:
      this.drawLineString((geometry));
      break;
    case ol.geom.GeometryType.POLYGON:
      this.drawPolygon((geometry));
      break;
    case ol.geom.GeometryType.MULTI_POINT:
      this.drawMultiPoint((geometry));
      break;
    case ol.geom.GeometryType.MULTI_LINE_STRING:
      this.drawMultiLineString((geometry));
      break;
    case ol.geom.GeometryType.MULTI_POLYGON:
      this.drawMultiPolygon((geometry));
      break;
    case ol.geom.GeometryType.GEOMETRY_COLLECTION:
      this.drawGeometryCollection((geometry));
      break;
    case ol.geom.GeometryType.CIRCLE:
      this.drawCircle((geometry));
      break;
    default:
      ol.DEBUG && console.assert(false, "Unsupported geometry type: " + type);
  }
};
ol.render.canvas.Immediate.prototype.drawFeature = function(feature, style) {
  var geometry = style.getGeometryFunction()(feature);
  if (!geometry || !ol.extent.intersects(this.extent_, geometry.getExtent())) {
    return;
  }
  this.setStyle(style);
  this.drawGeometry(geometry);
};
ol.render.canvas.Immediate.prototype.drawGeometryCollection = function(geometry) {
  var geometries = geometry.getGeometriesArray();
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    this.drawGeometry(geometries[i]);
  }
};
ol.render.canvas.Immediate.prototype.drawPoint = function(geometry) {
  var flatCoordinates = geometry.getFlatCoordinates();
  var stride = geometry.getStride();
  if (this.image_) {
    this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
  }
  if (this.text_ !== "") {
    this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
  }
};
ol.render.canvas.Immediate.prototype.drawMultiPoint = function(geometry) {
  var flatCoordinates = geometry.getFlatCoordinates();
  var stride = geometry.getStride();
  if (this.image_) {
    this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
  }
  if (this.text_ !== "") {
    this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
  }
};
ol.render.canvas.Immediate.prototype.drawLineString = function(geometry) {
  if (!ol.extent.intersects(this.extent_, geometry.getExtent())) {
    return;
  }
  if (this.strokeState_) {
    this.setContextStrokeState_(this.strokeState_);
    var context = this.context_;
    var flatCoordinates = geometry.getFlatCoordinates();
    context.beginPath();
    this.moveToLineTo_(flatCoordinates, 0, flatCoordinates.length, geometry.getStride(), false);
    context.stroke();
  }
  if (this.text_ !== "") {
    var flatMidpoint = geometry.getFlatMidpoint();
    this.drawText_(flatMidpoint, 0, 2, 2);
  }
};
ol.render.canvas.Immediate.prototype.drawMultiLineString = function(geometry) {
  var geometryExtent = geometry.getExtent();
  if (!ol.extent.intersects(this.extent_, geometryExtent)) {
    return;
  }
  if (this.strokeState_) {
    this.setContextStrokeState_(this.strokeState_);
    var context = this.context_;
    var flatCoordinates = geometry.getFlatCoordinates();
    var offset = 0;
    var ends = geometry.getEnds();
    var stride = geometry.getStride();
    context.beginPath();
    var i, ii;
    for (i = 0, ii = ends.length;i < ii;++i) {
      offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, false);
    }
    context.stroke();
  }
  if (this.text_ !== "") {
    var flatMidpoints = geometry.getFlatMidpoints();
    this.drawText_(flatMidpoints, 0, flatMidpoints.length, 2);
  }
};
ol.render.canvas.Immediate.prototype.drawPolygon = function(geometry) {
  if (!ol.extent.intersects(this.extent_, geometry.getExtent())) {
    return;
  }
  if (this.strokeState_ || this.fillState_) {
    if (this.fillState_) {
      this.setContextFillState_(this.fillState_);
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
    }
    var context = this.context_;
    context.beginPath();
    this.drawRings_(geometry.getOrientedFlatCoordinates(), 0, geometry.getEnds(), geometry.getStride());
    if (this.fillState_) {
      context.fill();
    }
    if (this.strokeState_) {
      context.stroke();
    }
  }
  if (this.text_ !== "") {
    var flatInteriorPoint = geometry.getFlatInteriorPoint();
    this.drawText_(flatInteriorPoint, 0, 2, 2);
  }
};
ol.render.canvas.Immediate.prototype.drawMultiPolygon = function(geometry) {
  if (!ol.extent.intersects(this.extent_, geometry.getExtent())) {
    return;
  }
  if (this.strokeState_ || this.fillState_) {
    if (this.fillState_) {
      this.setContextFillState_(this.fillState_);
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
    }
    var context = this.context_;
    var flatCoordinates = geometry.getOrientedFlatCoordinates();
    var offset = 0;
    var endss = geometry.getEndss();
    var stride = geometry.getStride();
    var i, ii;
    context.beginPath();
    for (i = 0, ii = endss.length;i < ii;++i) {
      var ends = endss[i];
      offset = this.drawRings_(flatCoordinates, offset, ends, stride);
    }
    if (this.fillState_) {
      context.fill();
    }
    if (this.strokeState_) {
      context.stroke();
    }
  }
  if (this.text_ !== "") {
    var flatInteriorPoints = geometry.getFlatInteriorPoints();
    this.drawText_(flatInteriorPoints, 0, flatInteriorPoints.length, 2);
  }
};
ol.render.canvas.Immediate.prototype.setContextFillState_ = function(fillState) {
  var context = this.context_;
  var contextFillState = this.contextFillState_;
  if (!contextFillState) {
    context.fillStyle = fillState.fillStyle;
    this.contextFillState_ = {fillStyle:fillState.fillStyle};
  } else {
    if (contextFillState.fillStyle != fillState.fillStyle) {
      contextFillState.fillStyle = context.fillStyle = fillState.fillStyle;
    }
  }
};
ol.render.canvas.Immediate.prototype.setContextStrokeState_ = function(strokeState) {
  var context = this.context_;
  var contextStrokeState = this.contextStrokeState_;
  if (!contextStrokeState) {
    context.lineCap = strokeState.lineCap;
    if (ol.has.CANVAS_LINE_DASH) {
      context.setLineDash(strokeState.lineDash);
    }
    context.lineJoin = strokeState.lineJoin;
    context.lineWidth = strokeState.lineWidth;
    context.miterLimit = strokeState.miterLimit;
    context.strokeStyle = strokeState.strokeStyle;
    this.contextStrokeState_ = {lineCap:strokeState.lineCap, lineDash:strokeState.lineDash, lineJoin:strokeState.lineJoin, lineWidth:strokeState.lineWidth, miterLimit:strokeState.miterLimit, strokeStyle:strokeState.strokeStyle};
  } else {
    if (contextStrokeState.lineCap != strokeState.lineCap) {
      contextStrokeState.lineCap = context.lineCap = strokeState.lineCap;
    }
    if (ol.has.CANVAS_LINE_DASH) {
      if (!ol.array.equals(contextStrokeState.lineDash, strokeState.lineDash)) {
        context.setLineDash(contextStrokeState.lineDash = strokeState.lineDash);
      }
    }
    if (contextStrokeState.lineJoin != strokeState.lineJoin) {
      contextStrokeState.lineJoin = context.lineJoin = strokeState.lineJoin;
    }
    if (contextStrokeState.lineWidth != strokeState.lineWidth) {
      contextStrokeState.lineWidth = context.lineWidth = strokeState.lineWidth;
    }
    if (contextStrokeState.miterLimit != strokeState.miterLimit) {
      contextStrokeState.miterLimit = context.miterLimit = strokeState.miterLimit;
    }
    if (contextStrokeState.strokeStyle != strokeState.strokeStyle) {
      contextStrokeState.strokeStyle = context.strokeStyle = strokeState.strokeStyle;
    }
  }
};
ol.render.canvas.Immediate.prototype.setContextTextState_ = function(textState) {
  var context = this.context_;
  var contextTextState = this.contextTextState_;
  if (!contextTextState) {
    context.font = textState.font;
    context.textAlign = textState.textAlign;
    context.textBaseline = textState.textBaseline;
    this.contextTextState_ = {font:textState.font, textAlign:textState.textAlign, textBaseline:textState.textBaseline};
  } else {
    if (contextTextState.font != textState.font) {
      contextTextState.font = context.font = textState.font;
    }
    if (contextTextState.textAlign != textState.textAlign) {
      contextTextState.textAlign = context.textAlign = textState.textAlign;
    }
    if (contextTextState.textBaseline != textState.textBaseline) {
      contextTextState.textBaseline = context.textBaseline = textState.textBaseline;
    }
  }
};
ol.render.canvas.Immediate.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {
  if (!fillStyle) {
    this.fillState_ = null;
  } else {
    var fillStyleColor = fillStyle.getColor();
    this.fillState_ = {fillStyle:ol.colorlike.asColorLike(fillStyleColor ? fillStyleColor : ol.render.canvas.defaultFillStyle)};
  }
  if (!strokeStyle) {
    this.strokeState_ = null;
  } else {
    var strokeStyleColor = strokeStyle.getColor();
    var strokeStyleLineCap = strokeStyle.getLineCap();
    var strokeStyleLineDash = strokeStyle.getLineDash();
    var strokeStyleLineJoin = strokeStyle.getLineJoin();
    var strokeStyleWidth = strokeStyle.getWidth();
    var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
    this.strokeState_ = {lineCap:strokeStyleLineCap !== undefined ? strokeStyleLineCap : ol.render.canvas.defaultLineCap, lineDash:strokeStyleLineDash ? strokeStyleLineDash : ol.render.canvas.defaultLineDash, lineJoin:strokeStyleLineJoin !== undefined ? strokeStyleLineJoin : ol.render.canvas.defaultLineJoin, lineWidth:this.pixelRatio_ * (strokeStyleWidth !== undefined ? strokeStyleWidth : ol.render.canvas.defaultLineWidth), miterLimit:strokeStyleMiterLimit !== undefined ? strokeStyleMiterLimit : 
    ol.render.canvas.defaultMiterLimit, strokeStyle:ol.colorlike.asColorLike(strokeStyleColor ? strokeStyleColor : ol.render.canvas.defaultStrokeStyle)};
  }
};
ol.render.canvas.Immediate.prototype.setImageStyle = function(imageStyle) {
  if (!imageStyle) {
    this.image_ = null;
  } else {
    var imageAnchor = imageStyle.getAnchor();
    var imageImage = imageStyle.getImage(1);
    var imageOrigin = imageStyle.getOrigin();
    var imageSize = imageStyle.getSize();
    ol.DEBUG && console.assert(imageImage, "imageImage must be truthy");
    this.imageAnchorX_ = imageAnchor[0];
    this.imageAnchorY_ = imageAnchor[1];
    this.imageHeight_ = imageSize[1];
    this.image_ = imageImage;
    this.imageOpacity_ = imageStyle.getOpacity();
    this.imageOriginX_ = imageOrigin[0];
    this.imageOriginY_ = imageOrigin[1];
    this.imageRotateWithView_ = imageStyle.getRotateWithView();
    this.imageRotation_ = imageStyle.getRotation();
    this.imageScale_ = imageStyle.getScale();
    this.imageSnapToPixel_ = imageStyle.getSnapToPixel();
    this.imageWidth_ = imageSize[0];
  }
};
ol.render.canvas.Immediate.prototype.setTextStyle = function(textStyle) {
  if (!textStyle) {
    this.text_ = "";
  } else {
    var textFillStyle = textStyle.getFill();
    if (!textFillStyle) {
      this.textFillState_ = null;
    } else {
      var textFillStyleColor = textFillStyle.getColor();
      this.textFillState_ = {fillStyle:ol.colorlike.asColorLike(textFillStyleColor ? textFillStyleColor : ol.render.canvas.defaultFillStyle)};
    }
    var textStrokeStyle = textStyle.getStroke();
    if (!textStrokeStyle) {
      this.textStrokeState_ = null;
    } else {
      var textStrokeStyleColor = textStrokeStyle.getColor();
      var textStrokeStyleLineCap = textStrokeStyle.getLineCap();
      var textStrokeStyleLineDash = textStrokeStyle.getLineDash();
      var textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
      var textStrokeStyleWidth = textStrokeStyle.getWidth();
      var textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
      this.textStrokeState_ = {lineCap:textStrokeStyleLineCap !== undefined ? textStrokeStyleLineCap : ol.render.canvas.defaultLineCap, lineDash:textStrokeStyleLineDash ? textStrokeStyleLineDash : ol.render.canvas.defaultLineDash, lineJoin:textStrokeStyleLineJoin !== undefined ? textStrokeStyleLineJoin : ol.render.canvas.defaultLineJoin, lineWidth:textStrokeStyleWidth !== undefined ? textStrokeStyleWidth : ol.render.canvas.defaultLineWidth, miterLimit:textStrokeStyleMiterLimit !== undefined ? textStrokeStyleMiterLimit : 
      ol.render.canvas.defaultMiterLimit, strokeStyle:ol.colorlike.asColorLike(textStrokeStyleColor ? textStrokeStyleColor : ol.render.canvas.defaultStrokeStyle)};
    }
    var textFont = textStyle.getFont();
    var textOffsetX = textStyle.getOffsetX();
    var textOffsetY = textStyle.getOffsetY();
    var textRotateWithView = textStyle.getRotateWithView();
    var textRotation = textStyle.getRotation();
    var textScale = textStyle.getScale();
    var textText = textStyle.getText();
    var textTextAlign = textStyle.getTextAlign();
    var textTextBaseline = textStyle.getTextBaseline();
    this.textState_ = {font:textFont !== undefined ? textFont : ol.render.canvas.defaultFont, textAlign:textTextAlign !== undefined ? textTextAlign : ol.render.canvas.defaultTextAlign, textBaseline:textTextBaseline !== undefined ? textTextBaseline : ol.render.canvas.defaultTextBaseline};
    this.text_ = textText !== undefined ? textText : "";
    this.textOffsetX_ = textOffsetX !== undefined ? this.pixelRatio_ * textOffsetX : 0;
    this.textOffsetY_ = textOffsetY !== undefined ? this.pixelRatio_ * textOffsetY : 0;
    this.textRotateWithView_ = textRotateWithView !== undefined ? textRotateWithView : false;
    this.textRotation_ = textRotation !== undefined ? textRotation : 0;
    this.textScale_ = this.pixelRatio_ * (textScale !== undefined ? textScale : 1);
  }
};
goog.provide("ol.renderer.Layer");
goog.require("ol");
goog.require("ol.Image");
goog.require("ol.Observable");
goog.require("ol.Tile");
goog.require("ol.asserts");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.functions");
goog.require("ol.source.State");
goog.require("ol.transform");
ol.renderer.Layer = function(layer) {
  ol.Observable.call(this);
  this.layer_ = layer;
};
ol.inherits(ol.renderer.Layer, ol.Observable);
ol.renderer.Layer.prototype.forEachFeatureAtCoordinate = ol.nullFunction;
ol.renderer.Layer.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg) {
  var coordinate = ol.transform.apply(frameState.pixelToCoordinateTransform, pixel.slice());
  var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, ol.functions.TRUE, this);
  if (hasFeature) {
    return callback.call(thisArg, this.layer_, null);
  } else {
    return undefined;
  }
};
ol.renderer.Layer.prototype.hasFeatureAtCoordinate = ol.functions.FALSE;
ol.renderer.Layer.prototype.createLoadedTileFinder = function(source, projection, tiles) {
  return function(zoom, tileRange) {
    function callback(tile) {
      if (!tiles[zoom]) {
        tiles[zoom] = {};
      }
      tiles[zoom][tile.tileCoord.toString()] = tile;
    }
    return source.forEachLoadedTile(projection, zoom, tileRange, callback);
  };
};
ol.renderer.Layer.prototype.getLayer = function() {
  return this.layer_;
};
ol.renderer.Layer.prototype.handleImageChange_ = function(event) {
  var image = (event.target);
  if (image.getState() === ol.Image.State.LOADED) {
    this.renderIfReadyAndVisible();
  }
};
ol.renderer.Layer.prototype.loadImage = function(image) {
  var imageState = image.getState();
  if (imageState != ol.Image.State.LOADED && imageState != ol.Image.State.ERROR) {
    ol.DEBUG && console.assert(imageState == ol.Image.State.IDLE || imageState == ol.Image.State.LOADING, 'imageState is "idle" or "loading"');
    ol.events.listen(image, ol.events.EventType.CHANGE, this.handleImageChange_, this);
  }
  if (imageState == ol.Image.State.IDLE) {
    image.load();
    imageState = image.getState();
    ol.DEBUG && console.assert(imageState == ol.Image.State.LOADING || imageState == ol.Image.State.LOADED, 'imageState is "loading" or "loaded"');
  }
  return imageState == ol.Image.State.LOADED;
};
ol.renderer.Layer.prototype.renderIfReadyAndVisible = function() {
  var layer = this.getLayer();
  if (layer.getVisible() && layer.getSourceState() == ol.source.State.READY) {
    this.changed();
  }
};
ol.renderer.Layer.prototype.scheduleExpireCache = function(frameState, tileSource) {
  if (tileSource.canExpireCache()) {
    var postRenderFunction = function(tileSource, map, frameState) {
      var tileSourceKey = ol.getUid(tileSource).toString();
      tileSource.expireCache(frameState.viewState.projection, frameState.usedTiles[tileSourceKey]);
    }.bind(null, tileSource);
    frameState.postRenderFunctions.push((postRenderFunction));
  }
};
ol.renderer.Layer.prototype.updateAttributions = function(attributionsSet, attributions) {
  if (attributions) {
    var attribution, i, ii;
    for (i = 0, ii = attributions.length;i < ii;++i) {
      attribution = attributions[i];
      attributionsSet[ol.getUid(attribution).toString()] = attribution;
    }
  }
};
ol.renderer.Layer.prototype.updateLogos = function(frameState, source) {
  var logo = source.getLogo();
  if (logo !== undefined) {
    if (typeof logo === "string") {
      frameState.logos[logo] = "";
    } else {
      if (logo) {
        ol.asserts.assert(typeof logo.href == "string", 44);
        ol.asserts.assert(typeof logo.src == "string", 45);
        frameState.logos[logo.src] = logo.href;
      }
    }
  }
};
ol.renderer.Layer.prototype.updateUsedTiles = function(usedTiles, tileSource, z, tileRange) {
  var tileSourceKey = ol.getUid(tileSource).toString();
  var zKey = z.toString();
  if (tileSourceKey in usedTiles) {
    if (zKey in usedTiles[tileSourceKey]) {
      usedTiles[tileSourceKey][zKey].extend(tileRange);
    } else {
      usedTiles[tileSourceKey][zKey] = tileRange;
    }
  } else {
    usedTiles[tileSourceKey] = {};
    usedTiles[tileSourceKey][zKey] = tileRange;
  }
};
ol.renderer.Layer.prototype.manageTilePyramid = function(frameState, tileSource, tileGrid, pixelRatio, projection, extent, currentZ, preload, opt_tileCallback, opt_this) {
  var tileSourceKey = ol.getUid(tileSource).toString();
  if (!(tileSourceKey in frameState.wantedTiles)) {
    frameState.wantedTiles[tileSourceKey] = {};
  }
  var wantedTiles = frameState.wantedTiles[tileSourceKey];
  var tileQueue = frameState.tileQueue;
  var minZoom = tileGrid.getMinZoom();
  var tile, tileRange, tileResolution, x, y, z;
  for (z = currentZ;z >= minZoom;--z) {
    tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, tileRange);
    tileResolution = tileGrid.getResolution(z);
    for (x = tileRange.minX;x <= tileRange.maxX;++x) {
      for (y = tileRange.minY;y <= tileRange.maxY;++y) {
        if (currentZ - z <= preload) {
          tile = tileSource.getTile(z, x, y, pixelRatio, projection);
          if (tile.getState() == ol.Tile.State.IDLE) {
            wantedTiles[tile.getKey()] = true;
            if (!tileQueue.isKeyQueued(tile.getKey())) {
              tileQueue.enqueue([tile, tileSourceKey, tileGrid.getTileCoordCenter(tile.tileCoord), tileResolution]);
            }
          }
          if (opt_tileCallback !== undefined) {
            opt_tileCallback.call(opt_this, tile);
          }
        } else {
          tileSource.useTile(z, x, y, projection);
        }
      }
    }
  }
};
goog.provide("ol.renderer.canvas.Layer");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.render.Event");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.Immediate");
goog.require("ol.renderer.Layer");
goog.require("ol.transform");
ol.renderer.canvas.Layer = function(layer) {
  ol.renderer.Layer.call(this, layer);
  this.transform_ = ol.transform.create();
};
ol.inherits(ol.renderer.canvas.Layer, ol.renderer.Layer);
ol.renderer.canvas.Layer.prototype.clip = function(context, frameState, extent) {
  var pixelRatio = frameState.pixelRatio;
  var width = frameState.size[0] * pixelRatio;
  var height = frameState.size[1] * pixelRatio;
  var rotation = frameState.viewState.rotation;
  var topLeft = ol.extent.getTopLeft((extent));
  var topRight = ol.extent.getTopRight((extent));
  var bottomRight = ol.extent.getBottomRight((extent));
  var bottomLeft = ol.extent.getBottomLeft((extent));
  ol.transform.apply(frameState.coordinateToPixelTransform, topLeft);
  ol.transform.apply(frameState.coordinateToPixelTransform, topRight);
  ol.transform.apply(frameState.coordinateToPixelTransform, bottomRight);
  ol.transform.apply(frameState.coordinateToPixelTransform, bottomLeft);
  context.save();
  ol.render.canvas.rotateAtOffset(context, -rotation, width / 2, height / 2);
  context.beginPath();
  context.moveTo(topLeft[0] * pixelRatio, topLeft[1] * pixelRatio);
  context.lineTo(topRight[0] * pixelRatio, topRight[1] * pixelRatio);
  context.lineTo(bottomRight[0] * pixelRatio, bottomRight[1] * pixelRatio);
  context.lineTo(bottomLeft[0] * pixelRatio, bottomLeft[1] * pixelRatio);
  context.clip();
  ol.render.canvas.rotateAtOffset(context, rotation, width / 2, height / 2);
};
ol.renderer.canvas.Layer.prototype.composeFrame = function(frameState, layerState, context) {
  this.dispatchPreComposeEvent(context, frameState);
  var image = this.getImage();
  if (image) {
    var extent = layerState.extent;
    var clipped = extent !== undefined;
    if (clipped) {
      this.clip(context, frameState, (extent));
    }
    var imageTransform = this.getImageTransform();
    var alpha = context.globalAlpha;
    context.globalAlpha = layerState.opacity;
    var dx = imageTransform[4];
    var dy = imageTransform[5];
    var dw = image.width * imageTransform[0];
    var dh = image.height * imageTransform[3];
    context.drawImage(image, 0, 0, +image.width, +image.height, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
    context.globalAlpha = alpha;
    if (clipped) {
      context.restore();
    }
  }
  this.dispatchPostComposeEvent(context, frameState);
};
ol.renderer.canvas.Layer.prototype.dispatchComposeEvent_ = function(type, context, frameState, opt_transform) {
  var layer = this.getLayer();
  if (layer.hasListener(type)) {
    var width = frameState.size[0] * frameState.pixelRatio;
    var height = frameState.size[1] * frameState.pixelRatio;
    var rotation = frameState.viewState.rotation;
    ol.render.canvas.rotateAtOffset(context, -rotation, width / 2, height / 2);
    var transform = opt_transform !== undefined ? opt_transform : this.getTransform(frameState, 0);
    var render = new ol.render.canvas.Immediate(context, frameState.pixelRatio, frameState.extent, transform, frameState.viewState.rotation);
    var composeEvent = new ol.render.Event(type, render, frameState, context, null);
    layer.dispatchEvent(composeEvent);
    ol.render.canvas.rotateAtOffset(context, rotation, width / 2, height / 2);
  }
};
ol.renderer.canvas.Layer.prototype.dispatchPostComposeEvent = function(context, frameState, opt_transform) {
  this.dispatchComposeEvent_(ol.render.Event.Type.POSTCOMPOSE, context, frameState, opt_transform);
};
ol.renderer.canvas.Layer.prototype.dispatchPreComposeEvent = function(context, frameState, opt_transform) {
  this.dispatchComposeEvent_(ol.render.Event.Type.PRECOMPOSE, context, frameState, opt_transform);
};
ol.renderer.canvas.Layer.prototype.dispatchRenderEvent = function(context, frameState, opt_transform) {
  this.dispatchComposeEvent_(ol.render.Event.Type.RENDER, context, frameState, opt_transform);
};
ol.renderer.canvas.Layer.prototype.getImage = function() {
};
ol.renderer.canvas.Layer.prototype.getImageTransform = function() {
};
ol.renderer.canvas.Layer.prototype.getTransform = function(frameState, offsetX) {
  var viewState = frameState.viewState;
  var pixelRatio = frameState.pixelRatio;
  var dx1 = pixelRatio * frameState.size[0] / 2;
  var dy1 = pixelRatio * frameState.size[1] / 2;
  var sx = pixelRatio / viewState.resolution;
  var sy = -sx;
  var angle = -viewState.rotation;
  var dx2 = -viewState.center[0] + offsetX;
  var dy2 = -viewState.center[1];
  return ol.transform.compose(this.transform_, dx1, dy1, sx, sy, angle, dx2, dy2);
};
ol.renderer.canvas.Layer.prototype.prepareFrame = function(frameState, layerState) {
};
ol.renderer.canvas.Layer.prototype.getPixelOnCanvas = function(pixelOnMap, imageTransformInv) {
  return ol.transform.apply(imageTransformInv, pixelOnMap.slice());
};
goog.provide("ol.render.ReplayGroup");
ol.render.ReplayGroup = function() {
};
ol.render.ReplayGroup.prototype.getReplay = function(zIndex, replayType) {
};
ol.render.ReplayGroup.prototype.isEmpty = function() {
};
goog.provide("ol.render.canvas.Instruction");
ol.render.canvas.Instruction = {BEGIN_GEOMETRY:0, BEGIN_PATH:1, CIRCLE:2, CLOSE_PATH:3, DRAW_IMAGE:4, DRAW_TEXT:5, END_GEOMETRY:6, FILL:7, MOVE_TO_LINE_TO:8, SET_FILL_STYLE:9, SET_STROKE_STYLE:10, SET_TEXT_STYLE:11, STROKE:12};
goog.provide("ol.render.canvas.Replay");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.colorlike");
goog.require("ol.extent");
goog.require("ol.extent.Relationship");
goog.require("ol.geom.flat.transform");
goog.require("ol.has");
goog.require("ol.obj");
goog.require("ol.render.VectorContext");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.Instruction");
goog.require("ol.transform");
ol.render.canvas.Replay = function(tolerance, maxExtent, resolution, overlaps) {
  ol.render.VectorContext.call(this);
  this.tolerance = tolerance;
  this.maxExtent = maxExtent;
  this.overlaps = overlaps;
  this.maxLineWidth = 0;
  this.resolution = resolution;
  this.fillOrigin_;
  this.beginGeometryInstruction1_ = null;
  this.beginGeometryInstruction2_ = null;
  this.instructions = [];
  this.coordinates = [];
  this.renderedTransform_ = ol.transform.create();
  this.hitDetectionInstructions = [];
  this.pixelCoordinates_ = [];
  this.tmpLocalTransform_ = ol.transform.create();
  this.resetTransform_ = ol.transform.create();
};
ol.inherits(ol.render.canvas.Replay, ol.render.VectorContext);
ol.render.canvas.Replay.prototype.appendFlatCoordinates = function(flatCoordinates, offset, end, stride, closed, skipFirst) {
  var myEnd = this.coordinates.length;
  var extent = this.getBufferedMaxExtent();
  if (skipFirst) {
    offset += stride;
  }
  var lastCoord = [flatCoordinates[offset], flatCoordinates[offset + 1]];
  var nextCoord = [NaN, NaN];
  var skipped = true;
  var i, lastRel, nextRel;
  for (i = offset + stride;i < end;i += stride) {
    nextCoord[0] = flatCoordinates[i];
    nextCoord[1] = flatCoordinates[i + 1];
    nextRel = ol.extent.coordinateRelationship(extent, nextCoord);
    if (nextRel !== lastRel) {
      if (skipped) {
        this.coordinates[myEnd++] = lastCoord[0];
        this.coordinates[myEnd++] = lastCoord[1];
      }
      this.coordinates[myEnd++] = nextCoord[0];
      this.coordinates[myEnd++] = nextCoord[1];
      skipped = false;
    } else {
      if (nextRel === ol.extent.Relationship.INTERSECTING) {
        this.coordinates[myEnd++] = nextCoord[0];
        this.coordinates[myEnd++] = nextCoord[1];
        skipped = false;
      } else {
        skipped = true;
      }
    }
    lastCoord[0] = nextCoord[0];
    lastCoord[1] = nextCoord[1];
    lastRel = nextRel;
  }
  if (closed && skipped || i === offset + stride) {
    this.coordinates[myEnd++] = lastCoord[0];
    this.coordinates[myEnd++] = lastCoord[1];
  }
  return myEnd;
};
ol.render.canvas.Replay.prototype.beginGeometry = function(geometry, feature) {
  this.beginGeometryInstruction1_ = [ol.render.canvas.Instruction.BEGIN_GEOMETRY, feature, 0];
  this.instructions.push(this.beginGeometryInstruction1_);
  this.beginGeometryInstruction2_ = [ol.render.canvas.Instruction.BEGIN_GEOMETRY, feature, 0];
  this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
};
ol.render.canvas.Replay.prototype.fill_ = function(context, rotation) {
  if (this.fillOrigin_) {
    var origin = ol.transform.apply(this.renderedTransform_, this.fillOrigin_.slice());
    context.translate(origin[0], origin[1]);
    context.rotate(rotation);
  }
  context.fill();
  if (this.fillOrigin_) {
    context.setTransform.apply(context, this.resetTransform_);
  }
};
ol.render.canvas.Replay.prototype.replay_ = function(context, pixelRatio, transform, viewRotation, skippedFeaturesHash, instructions, featureCallback, opt_hitExtent) {
  var pixelCoordinates;
  if (ol.array.equals(transform, this.renderedTransform_)) {
    pixelCoordinates = this.pixelCoordinates_;
  } else {
    pixelCoordinates = ol.geom.flat.transform.transform2D(this.coordinates, 0, this.coordinates.length, 2, transform, this.pixelCoordinates_);
    ol.transform.setFromArray(this.renderedTransform_, transform);
    ol.DEBUG && console.assert(pixelCoordinates === this.pixelCoordinates_, "pixelCoordinates should be the same as this.pixelCoordinates_");
  }
  var skipFeatures = !ol.obj.isEmpty(skippedFeaturesHash);
  var i = 0;
  var ii = instructions.length;
  var d = 0;
  var dd;
  var localTransform = this.tmpLocalTransform_;
  var resetTransform = this.resetTransform_;
  var prevX, prevY, roundX, roundY;
  var pendingFill = 0;
  var pendingStroke = 0;
  var batchSize = this.instructions != instructions || this.overlaps ? 0 : 200;
  while (i < ii) {
    var instruction = instructions[i];
    var type = (instruction[0]);
    var feature, fill, stroke, text, x, y;
    switch(type) {
      case ol.render.canvas.Instruction.BEGIN_GEOMETRY:
        feature = (instruction[1]);
        if (skipFeatures && skippedFeaturesHash[ol.getUid(feature).toString()] || !feature.getGeometry()) {
          i = (instruction[2]);
        } else {
          if (opt_hitExtent !== undefined && !ol.extent.intersects(opt_hitExtent, feature.getGeometry().getExtent())) {
            i = (instruction[2]) + 1;
          } else {
            ++i;
          }
        }
        break;
      case ol.render.canvas.Instruction.BEGIN_PATH:
        if (pendingFill > batchSize) {
          this.fill_(context, viewRotation);
          pendingFill = 0;
        }
        if (pendingStroke > batchSize) {
          context.stroke();
          pendingStroke = 0;
        }
        if (!pendingFill && !pendingStroke) {
          context.beginPath();
        }
        ++i;
        break;
      case ol.render.canvas.Instruction.CIRCLE:
        ol.DEBUG && console.assert(typeof instruction[1] === "number", "second instruction should be a number");
        d = (instruction[1]);
        var x1 = pixelCoordinates[d];
        var y1 = pixelCoordinates[d + 1];
        var x2 = pixelCoordinates[d + 2];
        var y2 = pixelCoordinates[d + 3];
        var dx = x2 - x1;
        var dy = y2 - y1;
        var r = Math.sqrt(dx * dx + dy * dy);
        context.moveTo(x1 + r, y1);
        context.arc(x1, y1, r, 0, 2 * Math.PI, true);
        ++i;
        break;
      case ol.render.canvas.Instruction.CLOSE_PATH:
        context.closePath();
        ++i;
        break;
      case ol.render.canvas.Instruction.DRAW_IMAGE:
        ol.DEBUG && console.assert(typeof instruction[1] === "number", "second instruction should be a number");
        d = (instruction[1]);
        ol.DEBUG && console.assert(typeof instruction[2] === "number", "third instruction should be a number");
        dd = (instruction[2]);
        var image = (instruction[3]);
        var anchorX = (instruction[4]) * pixelRatio;
        var anchorY = (instruction[5]) * pixelRatio;
        var height = (instruction[6]);
        var opacity = (instruction[7]);
        var originX = (instruction[8]);
        var originY = (instruction[9]);
        var rotateWithView = (instruction[10]);
        var rotation = (instruction[11]);
        var scale = (instruction[12]);
        var snapToPixel = (instruction[13]);
        var width = (instruction[14]);
        if (rotateWithView) {
          rotation += viewRotation;
        }
        for (;d < dd;d += 2) {
          x = pixelCoordinates[d] - anchorX;
          y = pixelCoordinates[d + 1] - anchorY;
          if (snapToPixel) {
            x = Math.round(x);
            y = Math.round(y);
          }
          if (scale != 1 || rotation !== 0) {
            var centerX = x + anchorX;
            var centerY = y + anchorY;
            ol.transform.compose(localTransform, centerX, centerY, scale, scale, rotation, -centerX, -centerY);
            context.setTransform.apply(context, localTransform);
          }
          var alpha = context.globalAlpha;
          if (opacity != 1) {
            context.globalAlpha = alpha * opacity;
          }
          var w = width + originX > image.width ? image.width - originX : width;
          var h = height + originY > image.height ? image.height - originY : height;
          context.drawImage(image, originX, originY, w, h, x, y, w * pixelRatio, h * pixelRatio);
          if (opacity != 1) {
            context.globalAlpha = alpha;
          }
          if (scale != 1 || rotation !== 0) {
            context.setTransform.apply(context, resetTransform);
          }
        }
        ++i;
        break;
      case ol.render.canvas.Instruction.DRAW_TEXT:
        ol.DEBUG && console.assert(typeof instruction[1] === "number", "2nd instruction should be a number");
        d = (instruction[1]);
        ol.DEBUG && console.assert(typeof instruction[2] === "number", "3rd instruction should be a number");
        dd = (instruction[2]);
        ol.DEBUG && console.assert(typeof instruction[3] === "string", "4th instruction should be a string");
        text = (instruction[3]);
        ol.DEBUG && console.assert(typeof instruction[4] === "number", "5th instruction should be a number");
        var offsetX = (instruction[4]) * pixelRatio;
        ol.DEBUG && console.assert(typeof instruction[5] === "number", "6th instruction should be a number");
        var offsetY = (instruction[5]) * pixelRatio;
        ol.DEBUG && console.assert(typeof instruction[6] === "number", "7th instruction should be a number");
        rotation = (instruction[6]);
        ol.DEBUG && console.assert(typeof instruction[7] === "number", "8th instruction should be a number");
        scale = (instruction[7]) * pixelRatio;
        ol.DEBUG && console.assert(typeof instruction[8] === "boolean", "9th instruction should be a boolean");
        fill = (instruction[8]);
        ol.DEBUG && console.assert(typeof instruction[9] === "boolean", "10th instruction should be a boolean");
        stroke = (instruction[9]);
        rotateWithView = (instruction[10]);
        if (rotateWithView) {
          rotation += viewRotation;
        }
        for (;d < dd;d += 2) {
          x = pixelCoordinates[d] + offsetX;
          y = pixelCoordinates[d + 1] + offsetY;
          if (scale != 1 || rotation !== 0) {
            ol.transform.compose(localTransform, x, y, scale, scale, rotation, -x, -y);
            context.setTransform.apply(context, localTransform);
          }
          var lines = text.split("\n");
          var numLines = lines.length;
          var fontSize, lineY;
          if (numLines > 1) {
            fontSize = Math.round(context.measureText("M").width * 1.5);
            lineY = y - (numLines - 1) / 2 * fontSize;
          } else {
            fontSize = 0;
            lineY = y;
          }
          for (var lineIndex = 0;lineIndex < numLines;lineIndex++) {
            var line = lines[lineIndex];
            if (stroke) {
              context.strokeText(line, x, lineY);
            }
            if (fill) {
              context.fillText(line, x, lineY);
            }
            lineY = lineY + fontSize;
          }
          if (scale != 1 || rotation !== 0) {
            context.setTransform.apply(context, resetTransform);
          }
        }
        ++i;
        break;
      case ol.render.canvas.Instruction.END_GEOMETRY:
        if (featureCallback !== undefined) {
          feature = (instruction[1]);
          var result = featureCallback(feature);
          if (result) {
            return result;
          }
        }
        ++i;
        break;
      case ol.render.canvas.Instruction.FILL:
        if (batchSize) {
          pendingFill++;
        } else {
          this.fill_(context, viewRotation);
        }
        ++i;
        break;
      case ol.render.canvas.Instruction.MOVE_TO_LINE_TO:
        ol.DEBUG && console.assert(typeof instruction[1] === "number", "2nd instruction should be a number");
        d = (instruction[1]);
        ol.DEBUG && console.assert(typeof instruction[2] === "number", "3rd instruction should be a number");
        dd = (instruction[2]);
        x = pixelCoordinates[d];
        y = pixelCoordinates[d + 1];
        roundX = x + .5 | 0;
        roundY = y + .5 | 0;
        if (roundX !== prevX || roundY !== prevY) {
          context.moveTo(x, y);
          prevX = roundX;
          prevY = roundY;
        }
        for (d += 2;d < dd;d += 2) {
          x = pixelCoordinates[d];
          y = pixelCoordinates[d + 1];
          roundX = x + .5 | 0;
          roundY = y + .5 | 0;
          if (d == dd - 2 || roundX !== prevX || roundY !== prevY) {
            context.lineTo(x, y);
            prevX = roundX;
            prevY = roundY;
          }
        }
        ++i;
        break;
      case ol.render.canvas.Instruction.SET_FILL_STYLE:
        ol.DEBUG && console.assert(ol.colorlike.isColorLike(instruction[1]), "2nd instruction should be a string, " + "CanvasPattern, or CanvasGradient");
        this.fillOrigin_ = instruction[2];
        if (pendingFill) {
          this.fill_(context, viewRotation);
          pendingFill = 0;
        }
        context.fillStyle = (instruction[1]);
        ++i;
        break;
      case ol.render.canvas.Instruction.SET_STROKE_STYLE:
        ol.DEBUG && console.assert(ol.colorlike.isColorLike(instruction[1]), "2nd instruction should be a string, CanvasPattern, or CanvasGradient");
        ol.DEBUG && console.assert(typeof instruction[2] === "number", "3rd instruction should be a number");
        ol.DEBUG && console.assert(typeof instruction[3] === "string", "4rd instruction should be a string");
        ol.DEBUG && console.assert(typeof instruction[4] === "string", "5th instruction should be a string");
        ol.DEBUG && console.assert(typeof instruction[5] === "number", "6th instruction should be a number");
        ol.DEBUG && console.assert(instruction[6], "7th instruction should not be null");
        var usePixelRatio = instruction[7] !== undefined ? instruction[7] : true;
        var lineWidth = (instruction[2]);
        if (pendingStroke) {
          context.stroke();
          pendingStroke = 0;
        }
        context.strokeStyle = (instruction[1]);
        context.lineWidth = usePixelRatio ? lineWidth * pixelRatio : lineWidth;
        context.lineCap = (instruction[3]);
        context.lineJoin = (instruction[4]);
        context.miterLimit = (instruction[5]);
        if (ol.has.CANVAS_LINE_DASH) {
          context.setLineDash((instruction[6]));
        }
        prevX = NaN;
        prevY = NaN;
        ++i;
        break;
      case ol.render.canvas.Instruction.SET_TEXT_STYLE:
        ol.DEBUG && console.assert(typeof instruction[1] === "string", "2nd instruction should be a string");
        ol.DEBUG && console.assert(typeof instruction[2] === "string", "3rd instruction should be a string");
        ol.DEBUG && console.assert(typeof instruction[3] === "string", "4th instruction should be a string");
        context.font = (instruction[1]);
        context.textAlign = (instruction[2]);
        context.textBaseline = (instruction[3]);
        ++i;
        break;
      case ol.render.canvas.Instruction.STROKE:
        if (batchSize) {
          pendingStroke++;
        } else {
          context.stroke();
        }
        ++i;
        break;
      default:
        ol.DEBUG && console.assert(false, "Unknown canvas render instruction");
        ++i;
        break;
    }
  }
  if (pendingFill) {
    this.fill_(context, viewRotation);
  }
  if (pendingStroke) {
    context.stroke();
  }
  ol.DEBUG && console.assert(i == instructions.length, "all instructions should be consumed");
  return undefined;
};
ol.render.canvas.Replay.prototype.replay = function(context, pixelRatio, transform, viewRotation, skippedFeaturesHash) {
  var instructions = this.instructions;
  this.replay_(context, pixelRatio, transform, viewRotation, skippedFeaturesHash, instructions, undefined, undefined);
};
ol.render.canvas.Replay.prototype.replayHitDetection = function(context, transform, viewRotation, skippedFeaturesHash, opt_featureCallback, opt_hitExtent) {
  var instructions = this.hitDetectionInstructions;
  return this.replay_(context, 1, transform, viewRotation, skippedFeaturesHash, instructions, opt_featureCallback, opt_hitExtent);
};
ol.render.canvas.Replay.prototype.reverseHitDetectionInstructions = function() {
  var hitDetectionInstructions = this.hitDetectionInstructions;
  hitDetectionInstructions.reverse();
  var i;
  var n = hitDetectionInstructions.length;
  var instruction;
  var type;
  var begin = -1;
  for (i = 0;i < n;++i) {
    instruction = hitDetectionInstructions[i];
    type = (instruction[0]);
    if (type == ol.render.canvas.Instruction.END_GEOMETRY) {
      ol.DEBUG && console.assert(begin == -1, "begin should be -1");
      begin = i;
    } else {
      if (type == ol.render.canvas.Instruction.BEGIN_GEOMETRY) {
        instruction[2] = i;
        ol.DEBUG && console.assert(begin >= 0, "begin should be larger than or equal to 0");
        ol.array.reverseSubArray(this.hitDetectionInstructions, begin, i);
        begin = -1;
      }
    }
  }
};
ol.render.canvas.Replay.prototype.endGeometry = function(geometry, feature) {
  ol.DEBUG && console.assert(this.beginGeometryInstruction1_, "this.beginGeometryInstruction1_ should not be null");
  this.beginGeometryInstruction1_[2] = this.instructions.length;
  this.beginGeometryInstruction1_ = null;
  ol.DEBUG && console.assert(this.beginGeometryInstruction2_, "this.beginGeometryInstruction2_ should not be null");
  this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
  this.beginGeometryInstruction2_ = null;
  var endGeometryInstruction = [ol.render.canvas.Instruction.END_GEOMETRY, feature];
  this.instructions.push(endGeometryInstruction);
  this.hitDetectionInstructions.push(endGeometryInstruction);
};
ol.render.canvas.Replay.prototype.finish = ol.nullFunction;
ol.render.canvas.Replay.prototype.getBufferedMaxExtent = function() {
  return this.maxExtent;
};
goog.provide("ol.render.canvas.ImageReplay");
goog.require("ol");
goog.require("ol.render.canvas.Instruction");
goog.require("ol.render.canvas.Replay");
ol.render.canvas.ImageReplay = function(tolerance, maxExtent, resolution, overlaps) {
  ol.render.canvas.Replay.call(this, tolerance, maxExtent, resolution, overlaps);
  this.hitDetectionImage_ = null;
  this.image_ = null;
  this.anchorX_ = undefined;
  this.anchorY_ = undefined;
  this.height_ = undefined;
  this.opacity_ = undefined;
  this.originX_ = undefined;
  this.originY_ = undefined;
  this.rotateWithView_ = undefined;
  this.rotation_ = undefined;
  this.scale_ = undefined;
  this.snapToPixel_ = undefined;
  this.width_ = undefined;
};
ol.inherits(ol.render.canvas.ImageReplay, ol.render.canvas.Replay);
ol.render.canvas.ImageReplay.prototype.drawCoordinates_ = function(flatCoordinates, offset, end, stride) {
  return this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
};
ol.render.canvas.ImageReplay.prototype.drawPoint = function(pointGeometry, feature) {
  if (!this.image_) {
    return;
  }
  ol.DEBUG && console.assert(this.anchorX_ !== undefined, "this.anchorX_ should be defined");
  ol.DEBUG && console.assert(this.anchorY_ !== undefined, "this.anchorY_ should be defined");
  ol.DEBUG && console.assert(this.height_ !== undefined, "this.height_ should be defined");
  ol.DEBUG && console.assert(this.opacity_ !== undefined, "this.opacity_ should be defined");
  ol.DEBUG && console.assert(this.originX_ !== undefined, "this.originX_ should be defined");
  ol.DEBUG && console.assert(this.originY_ !== undefined, "this.originY_ should be defined");
  ol.DEBUG && console.assert(this.rotateWithView_ !== undefined, "this.rotateWithView_ should be defined");
  ol.DEBUG && console.assert(this.rotation_ !== undefined, "this.rotation_ should be defined");
  ol.DEBUG && console.assert(this.scale_ !== undefined, "this.scale_ should be defined");
  ol.DEBUG && console.assert(this.width_ !== undefined, "this.width_ should be defined");
  this.beginGeometry(pointGeometry, feature);
  var flatCoordinates = pointGeometry.getFlatCoordinates();
  var stride = pointGeometry.getStride();
  var myBegin = this.coordinates.length;
  var myEnd = this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
  this.instructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd, this.image_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.snapToPixel_, this.width_]);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.snapToPixel_, this.width_]);
  this.endGeometry(pointGeometry, feature);
};
ol.render.canvas.ImageReplay.prototype.drawMultiPoint = function(multiPointGeometry, feature) {
  if (!this.image_) {
    return;
  }
  ol.DEBUG && console.assert(this.anchorX_ !== undefined, "this.anchorX_ should be defined");
  ol.DEBUG && console.assert(this.anchorY_ !== undefined, "this.anchorY_ should be defined");
  ol.DEBUG && console.assert(this.height_ !== undefined, "this.height_ should be defined");
  ol.DEBUG && console.assert(this.opacity_ !== undefined, "this.opacity_ should be defined");
  ol.DEBUG && console.assert(this.originX_ !== undefined, "this.originX_ should be defined");
  ol.DEBUG && console.assert(this.originY_ !== undefined, "this.originY_ should be defined");
  ol.DEBUG && console.assert(this.rotateWithView_ !== undefined, "this.rotateWithView_ should be defined");
  ol.DEBUG && console.assert(this.rotation_ !== undefined, "this.rotation_ should be defined");
  ol.DEBUG && console.assert(this.scale_ !== undefined, "this.scale_ should be defined");
  ol.DEBUG && console.assert(this.width_ !== undefined, "this.width_ should be defined");
  this.beginGeometry(multiPointGeometry, feature);
  var flatCoordinates = multiPointGeometry.getFlatCoordinates();
  var stride = multiPointGeometry.getStride();
  var myBegin = this.coordinates.length;
  var myEnd = this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
  this.instructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd, this.image_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.snapToPixel_, this.width_]);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, myBegin, myEnd, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.snapToPixel_, this.width_]);
  this.endGeometry(multiPointGeometry, feature);
};
ol.render.canvas.ImageReplay.prototype.finish = function() {
  this.reverseHitDetectionInstructions();
  this.anchorX_ = undefined;
  this.anchorY_ = undefined;
  this.hitDetectionImage_ = null;
  this.image_ = null;
  this.height_ = undefined;
  this.scale_ = undefined;
  this.opacity_ = undefined;
  this.originX_ = undefined;
  this.originY_ = undefined;
  this.rotateWithView_ = undefined;
  this.rotation_ = undefined;
  this.snapToPixel_ = undefined;
  this.width_ = undefined;
};
ol.render.canvas.ImageReplay.prototype.setImageStyle = function(imageStyle) {
  ol.DEBUG && console.assert(imageStyle, "imageStyle should not be null");
  var anchor = imageStyle.getAnchor();
  ol.DEBUG && console.assert(anchor, "anchor should not be null");
  var size = imageStyle.getSize();
  ol.DEBUG && console.assert(size, "size should not be null");
  var hitDetectionImage = imageStyle.getHitDetectionImage(1);
  ol.DEBUG && console.assert(hitDetectionImage, "hitDetectionImage should not be null");
  var image = imageStyle.getImage(1);
  ol.DEBUG && console.assert(image, "image should not be null");
  var origin = imageStyle.getOrigin();
  ol.DEBUG && console.assert(origin, "origin should not be null");
  this.anchorX_ = anchor[0];
  this.anchorY_ = anchor[1];
  this.hitDetectionImage_ = hitDetectionImage;
  this.image_ = image;
  this.height_ = size[1];
  this.opacity_ = imageStyle.getOpacity();
  this.originX_ = origin[0];
  this.originY_ = origin[1];
  this.rotateWithView_ = imageStyle.getRotateWithView();
  this.rotation_ = imageStyle.getRotation();
  this.scale_ = imageStyle.getScale();
  this.snapToPixel_ = imageStyle.getSnapToPixel();
  this.width_ = size[0];
};
goog.provide("ol.render.canvas.LineStringReplay");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.colorlike");
goog.require("ol.extent");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.Instruction");
goog.require("ol.render.canvas.Replay");
ol.render.canvas.LineStringReplay = function(tolerance, maxExtent, resolution, overlaps) {
  ol.render.canvas.Replay.call(this, tolerance, maxExtent, resolution, overlaps);
  this.bufferedMaxExtent_ = null;
  this.state_ = {currentStrokeStyle:undefined, currentLineCap:undefined, currentLineDash:null, currentLineJoin:undefined, currentLineWidth:undefined, currentMiterLimit:undefined, lastStroke:0, strokeStyle:undefined, lineCap:undefined, lineDash:null, lineJoin:undefined, lineWidth:undefined, miterLimit:undefined};
};
ol.inherits(ol.render.canvas.LineStringReplay, ol.render.canvas.Replay);
ol.render.canvas.LineStringReplay.prototype.drawFlatCoordinates_ = function(flatCoordinates, offset, end, stride) {
  var myBegin = this.coordinates.length;
  var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
  var moveToLineToInstruction = [ol.render.canvas.Instruction.MOVE_TO_LINE_TO, myBegin, myEnd];
  this.instructions.push(moveToLineToInstruction);
  this.hitDetectionInstructions.push(moveToLineToInstruction);
  return end;
};
ol.render.canvas.LineStringReplay.prototype.getBufferedMaxExtent = function() {
  if (!this.bufferedMaxExtent_) {
    this.bufferedMaxExtent_ = ol.extent.clone(this.maxExtent);
    if (this.maxLineWidth > 0) {
      var width = this.resolution * (this.maxLineWidth + 1) / 2;
      ol.extent.buffer(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
    }
  }
  return this.bufferedMaxExtent_;
};
ol.render.canvas.LineStringReplay.prototype.setStrokeStyle_ = function() {
  var state = this.state_;
  var strokeStyle = state.strokeStyle;
  var lineCap = state.lineCap;
  var lineDash = state.lineDash;
  var lineJoin = state.lineJoin;
  var lineWidth = state.lineWidth;
  var miterLimit = state.miterLimit;
  ol.DEBUG && console.assert(strokeStyle !== undefined, "strokeStyle should be defined");
  ol.DEBUG && console.assert(lineCap !== undefined, "lineCap should be defined");
  ol.DEBUG && console.assert(lineDash, "lineDash should not be null");
  ol.DEBUG && console.assert(lineJoin !== undefined, "lineJoin should be defined");
  ol.DEBUG && console.assert(lineWidth !== undefined, "lineWidth should be defined");
  ol.DEBUG && console.assert(miterLimit !== undefined, "miterLimit should be defined");
  if (state.currentStrokeStyle != strokeStyle || state.currentLineCap != lineCap || !ol.array.equals(state.currentLineDash, lineDash) || state.currentLineJoin != lineJoin || state.currentLineWidth != lineWidth || state.currentMiterLimit != miterLimit) {
    if (state.lastStroke != this.coordinates.length) {
      this.instructions.push([ol.render.canvas.Instruction.STROKE]);
      state.lastStroke = this.coordinates.length;
    }
    this.instructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, strokeStyle, lineWidth, lineCap, lineJoin, miterLimit, lineDash], [ol.render.canvas.Instruction.BEGIN_PATH]);
    state.currentStrokeStyle = strokeStyle;
    state.currentLineCap = lineCap;
    state.currentLineDash = lineDash;
    state.currentLineJoin = lineJoin;
    state.currentLineWidth = lineWidth;
    state.currentMiterLimit = miterLimit;
  }
};
ol.render.canvas.LineStringReplay.prototype.drawLineString = function(lineStringGeometry, feature) {
  var state = this.state_;
  ol.DEBUG && console.assert(state, "state should not be null");
  var strokeStyle = state.strokeStyle;
  var lineWidth = state.lineWidth;
  if (strokeStyle === undefined || lineWidth === undefined) {
    return;
  }
  this.setStrokeStyle_();
  this.beginGeometry(lineStringGeometry, feature);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash], [ol.render.canvas.Instruction.BEGIN_PATH]);
  var flatCoordinates = lineStringGeometry.getFlatCoordinates();
  var stride = lineStringGeometry.getStride();
  this.drawFlatCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.STROKE]);
  this.endGeometry(lineStringGeometry, feature);
};
ol.render.canvas.LineStringReplay.prototype.drawMultiLineString = function(multiLineStringGeometry, feature) {
  var state = this.state_;
  ol.DEBUG && console.assert(state, "state should not be null");
  var strokeStyle = state.strokeStyle;
  var lineWidth = state.lineWidth;
  if (strokeStyle === undefined || lineWidth === undefined) {
    return;
  }
  this.setStrokeStyle_();
  this.beginGeometry(multiLineStringGeometry, feature);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash], [ol.render.canvas.Instruction.BEGIN_PATH]);
  var ends = multiLineStringGeometry.getEnds();
  var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
  var stride = multiLineStringGeometry.getStride();
  var offset = 0;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    offset = this.drawFlatCoordinates_(flatCoordinates, offset, ends[i], stride);
  }
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.STROKE]);
  this.endGeometry(multiLineStringGeometry, feature);
};
ol.render.canvas.LineStringReplay.prototype.finish = function() {
  var state = this.state_;
  ol.DEBUG && console.assert(state, "state should not be null");
  if (state.lastStroke != this.coordinates.length) {
    this.instructions.push([ol.render.canvas.Instruction.STROKE]);
  }
  this.reverseHitDetectionInstructions();
  this.state_ = null;
};
ol.render.canvas.LineStringReplay.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {
  ol.DEBUG && console.assert(this.state_, "this.state_ should not be null");
  ol.DEBUG && console.assert(!fillStyle, "fillStyle should be null");
  ol.DEBUG && console.assert(strokeStyle, "strokeStyle should not be null");
  var strokeStyleColor = strokeStyle.getColor();
  this.state_.strokeStyle = ol.colorlike.asColorLike(strokeStyleColor ? strokeStyleColor : ol.render.canvas.defaultStrokeStyle);
  var strokeStyleLineCap = strokeStyle.getLineCap();
  this.state_.lineCap = strokeStyleLineCap !== undefined ? strokeStyleLineCap : ol.render.canvas.defaultLineCap;
  var strokeStyleLineDash = strokeStyle.getLineDash();
  this.state_.lineDash = strokeStyleLineDash ? strokeStyleLineDash : ol.render.canvas.defaultLineDash;
  var strokeStyleLineJoin = strokeStyle.getLineJoin();
  this.state_.lineJoin = strokeStyleLineJoin !== undefined ? strokeStyleLineJoin : ol.render.canvas.defaultLineJoin;
  var strokeStyleWidth = strokeStyle.getWidth();
  this.state_.lineWidth = strokeStyleWidth !== undefined ? strokeStyleWidth : ol.render.canvas.defaultLineWidth;
  var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
  this.state_.miterLimit = strokeStyleMiterLimit !== undefined ? strokeStyleMiterLimit : ol.render.canvas.defaultMiterLimit;
  if (this.state_.lineWidth > this.maxLineWidth) {
    this.maxLineWidth = this.state_.lineWidth;
    this.bufferedMaxExtent_ = null;
  }
};
goog.provide("ol.render.canvas.PolygonReplay");
goog.require("ol");
goog.require("ol.color");
goog.require("ol.colorlike");
goog.require("ol.extent");
goog.require("ol.geom.flat.simplify");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.Instruction");
goog.require("ol.render.canvas.Replay");
ol.render.canvas.PolygonReplay = function(tolerance, maxExtent, resolution, overlaps) {
  ol.render.canvas.Replay.call(this, tolerance, maxExtent, resolution, overlaps);
  this.bufferedMaxExtent_ = null;
  this.state_ = {currentFillStyle:undefined, currentStrokeStyle:undefined, currentLineCap:undefined, currentLineDash:null, currentLineJoin:undefined, currentLineWidth:undefined, currentMiterLimit:undefined, fillStyle:undefined, strokeStyle:undefined, lineCap:undefined, lineDash:null, lineJoin:undefined, lineWidth:undefined, miterLimit:undefined};
};
ol.inherits(ol.render.canvas.PolygonReplay, ol.render.canvas.Replay);
ol.render.canvas.PolygonReplay.prototype.drawFlatCoordinatess_ = function(flatCoordinates, offset, ends, stride) {
  var state = this.state_;
  var fill = state.fillStyle !== undefined;
  var stroke = state.strokeStyle != undefined;
  var numEnds = ends.length;
  var beginPathInstruction = [ol.render.canvas.Instruction.BEGIN_PATH];
  this.instructions.push(beginPathInstruction);
  this.hitDetectionInstructions.push(beginPathInstruction);
  for (var i = 0;i < numEnds;++i) {
    var end = ends[i];
    var myBegin = this.coordinates.length;
    var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, true, !stroke);
    var moveToLineToInstruction = [ol.render.canvas.Instruction.MOVE_TO_LINE_TO, myBegin, myEnd];
    this.instructions.push(moveToLineToInstruction);
    this.hitDetectionInstructions.push(moveToLineToInstruction);
    if (stroke) {
      var closePathInstruction = [ol.render.canvas.Instruction.CLOSE_PATH];
      this.instructions.push(closePathInstruction);
      this.hitDetectionInstructions.push(closePathInstruction);
    }
    offset = end;
  }
  var fillInstruction = [ol.render.canvas.Instruction.FILL];
  this.hitDetectionInstructions.push(fillInstruction);
  if (fill) {
    this.instructions.push(fillInstruction);
  }
  if (stroke) {
    ol.DEBUG && console.assert(state.lineWidth !== undefined, "state.lineWidth should be defined");
    var strokeInstruction = [ol.render.canvas.Instruction.STROKE];
    this.instructions.push(strokeInstruction);
    this.hitDetectionInstructions.push(strokeInstruction);
  }
  return offset;
};
ol.render.canvas.PolygonReplay.prototype.drawCircle = function(circleGeometry, feature) {
  var state = this.state_;
  ol.DEBUG && console.assert(state, "state should not be null");
  var fillStyle = state.fillStyle;
  var strokeStyle = state.strokeStyle;
  if (fillStyle === undefined && strokeStyle === undefined) {
    return;
  }
  if (strokeStyle !== undefined) {
    ol.DEBUG && console.assert(state.lineWidth !== undefined, "state.lineWidth should be defined");
  }
  this.setFillStrokeStyles_(circleGeometry);
  this.beginGeometry(circleGeometry, feature);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, ol.color.asString(ol.render.canvas.defaultFillStyle)]);
  if (state.strokeStyle !== undefined) {
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash]);
  }
  var flatCoordinates = circleGeometry.getFlatCoordinates();
  var stride = circleGeometry.getStride();
  var myBegin = this.coordinates.length;
  this.appendFlatCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
  var beginPathInstruction = [ol.render.canvas.Instruction.BEGIN_PATH];
  var circleInstruction = [ol.render.canvas.Instruction.CIRCLE, myBegin];
  this.instructions.push(beginPathInstruction, circleInstruction);
  this.hitDetectionInstructions.push(beginPathInstruction, circleInstruction);
  var fillInstruction = [ol.render.canvas.Instruction.FILL];
  this.hitDetectionInstructions.push(fillInstruction);
  if (state.fillStyle !== undefined) {
    this.instructions.push(fillInstruction);
  }
  if (state.strokeStyle !== undefined) {
    ol.DEBUG && console.assert(state.lineWidth !== undefined, "state.lineWidth should be defined");
    var strokeInstruction = [ol.render.canvas.Instruction.STROKE];
    this.instructions.push(strokeInstruction);
    this.hitDetectionInstructions.push(strokeInstruction);
  }
  this.endGeometry(circleGeometry, feature);
};
ol.render.canvas.PolygonReplay.prototype.drawPolygon = function(polygonGeometry, feature) {
  var state = this.state_;
  ol.DEBUG && console.assert(state, "state should not be null");
  var strokeStyle = state.strokeStyle;
  ol.DEBUG && console.assert(state.fillStyle !== undefined || strokeStyle !== undefined, "fillStyle or strokeStyle should be defined");
  if (strokeStyle !== undefined) {
    ol.DEBUG && console.assert(state.lineWidth !== undefined, "state.lineWidth should be defined");
  }
  this.setFillStrokeStyles_(polygonGeometry);
  this.beginGeometry(polygonGeometry, feature);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, ol.color.asString(ol.render.canvas.defaultFillStyle)]);
  if (state.strokeStyle !== undefined) {
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash]);
  }
  var ends = polygonGeometry.getEnds();
  var flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
  var stride = polygonGeometry.getStride();
  this.drawFlatCoordinatess_(flatCoordinates, 0, ends, stride);
  this.endGeometry(polygonGeometry, feature);
};
ol.render.canvas.PolygonReplay.prototype.drawMultiPolygon = function(multiPolygonGeometry, feature) {
  var state = this.state_;
  ol.DEBUG && console.assert(state, "state should not be null");
  var fillStyle = state.fillStyle;
  var strokeStyle = state.strokeStyle;
  if (fillStyle === undefined && strokeStyle === undefined) {
    return;
  }
  if (strokeStyle !== undefined) {
    ol.DEBUG && console.assert(state.lineWidth !== undefined, "state.lineWidth should be defined");
  }
  this.setFillStrokeStyles_(multiPolygonGeometry);
  this.beginGeometry(multiPolygonGeometry, feature);
  this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, ol.color.asString(ol.render.canvas.defaultFillStyle)]);
  if (state.strokeStyle !== undefined) {
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash]);
  }
  var endss = multiPolygonGeometry.getEndss();
  var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
  var stride = multiPolygonGeometry.getStride();
  var offset = 0;
  var i, ii;
  for (i = 0, ii = endss.length;i < ii;++i) {
    offset = this.drawFlatCoordinatess_(flatCoordinates, offset, endss[i], stride);
  }
  this.endGeometry(multiPolygonGeometry, feature);
};
ol.render.canvas.PolygonReplay.prototype.finish = function() {
  ol.DEBUG && console.assert(this.state_, "this.state_ should not be null");
  this.reverseHitDetectionInstructions();
  this.state_ = null;
  var tolerance = this.tolerance;
  if (tolerance !== 0) {
    var coordinates = this.coordinates;
    var i, ii;
    for (i = 0, ii = coordinates.length;i < ii;++i) {
      coordinates[i] = ol.geom.flat.simplify.snap(coordinates[i], tolerance);
    }
  }
};
ol.render.canvas.PolygonReplay.prototype.getBufferedMaxExtent = function() {
  if (!this.bufferedMaxExtent_) {
    this.bufferedMaxExtent_ = ol.extent.clone(this.maxExtent);
    if (this.maxLineWidth > 0) {
      var width = this.resolution * (this.maxLineWidth + 1) / 2;
      ol.extent.buffer(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
    }
  }
  return this.bufferedMaxExtent_;
};
ol.render.canvas.PolygonReplay.prototype.setFillStrokeStyle = function(fillStyle, strokeStyle) {
  ol.DEBUG && console.assert(this.state_, "this.state_ should not be null");
  ol.DEBUG && console.assert(fillStyle || strokeStyle, "fillStyle or strokeStyle should not be null");
  var state = this.state_;
  if (fillStyle) {
    var fillStyleColor = fillStyle.getColor();
    state.fillStyle = ol.colorlike.asColorLike(fillStyleColor ? fillStyleColor : ol.render.canvas.defaultFillStyle);
  } else {
    state.fillStyle = undefined;
  }
  if (strokeStyle) {
    var strokeStyleColor = strokeStyle.getColor();
    state.strokeStyle = ol.colorlike.asColorLike(strokeStyleColor ? strokeStyleColor : ol.render.canvas.defaultStrokeStyle);
    var strokeStyleLineCap = strokeStyle.getLineCap();
    state.lineCap = strokeStyleLineCap !== undefined ? strokeStyleLineCap : ol.render.canvas.defaultLineCap;
    var strokeStyleLineDash = strokeStyle.getLineDash();
    state.lineDash = strokeStyleLineDash ? strokeStyleLineDash.slice() : ol.render.canvas.defaultLineDash;
    var strokeStyleLineJoin = strokeStyle.getLineJoin();
    state.lineJoin = strokeStyleLineJoin !== undefined ? strokeStyleLineJoin : ol.render.canvas.defaultLineJoin;
    var strokeStyleWidth = strokeStyle.getWidth();
    state.lineWidth = strokeStyleWidth !== undefined ? strokeStyleWidth : ol.render.canvas.defaultLineWidth;
    var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
    state.miterLimit = strokeStyleMiterLimit !== undefined ? strokeStyleMiterLimit : ol.render.canvas.defaultMiterLimit;
    if (state.lineWidth > this.maxLineWidth) {
      this.maxLineWidth = state.lineWidth;
      this.bufferedMaxExtent_ = null;
    }
  } else {
    state.strokeStyle = undefined;
    state.lineCap = undefined;
    state.lineDash = null;
    state.lineJoin = undefined;
    state.lineWidth = undefined;
    state.miterLimit = undefined;
  }
};
ol.render.canvas.PolygonReplay.prototype.setFillStrokeStyles_ = function(geometry) {
  var state = this.state_;
  var fillStyle = state.fillStyle;
  var strokeStyle = state.strokeStyle;
  var lineCap = state.lineCap;
  var lineDash = state.lineDash;
  var lineJoin = state.lineJoin;
  var lineWidth = state.lineWidth;
  var miterLimit = state.miterLimit;
  if (fillStyle !== undefined && (typeof fillStyle !== "string" || state.currentFillStyle != fillStyle)) {
    var fillInstruction = [ol.render.canvas.Instruction.SET_FILL_STYLE, fillStyle];
    if (typeof fillStyle !== "string") {
      var fillExtent = geometry.getExtent();
      fillInstruction.push([fillExtent[0], fillExtent[3]]);
    }
    this.instructions.push(fillInstruction);
    state.currentFillStyle = state.fillStyle;
  }
  if (strokeStyle !== undefined) {
    ol.DEBUG && console.assert(lineCap !== undefined, "lineCap should be defined");
    ol.DEBUG && console.assert(lineDash, "lineDash should not be null");
    ol.DEBUG && console.assert(lineJoin !== undefined, "lineJoin should be defined");
    ol.DEBUG && console.assert(lineWidth !== undefined, "lineWidth should be defined");
    ol.DEBUG && console.assert(miterLimit !== undefined, "miterLimit should be defined");
    if (state.currentStrokeStyle != strokeStyle || state.currentLineCap != lineCap || state.currentLineDash != lineDash || state.currentLineJoin != lineJoin || state.currentLineWidth != lineWidth || state.currentMiterLimit != miterLimit) {
      this.instructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, strokeStyle, lineWidth, lineCap, lineJoin, miterLimit, lineDash]);
      state.currentStrokeStyle = strokeStyle;
      state.currentLineCap = lineCap;
      state.currentLineDash = lineDash;
      state.currentLineJoin = lineJoin;
      state.currentLineWidth = lineWidth;
      state.currentMiterLimit = miterLimit;
    }
  }
};
goog.provide("ol.render.canvas.TextReplay");
goog.require("ol");
goog.require("ol.colorlike");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.Instruction");
goog.require("ol.render.canvas.Replay");
ol.render.canvas.TextReplay = function(tolerance, maxExtent, resolution, overlaps) {
  ol.render.canvas.Replay.call(this, tolerance, maxExtent, resolution, overlaps);
  this.replayFillState_ = null;
  this.replayStrokeState_ = null;
  this.replayTextState_ = null;
  this.text_ = "";
  this.textOffsetX_ = 0;
  this.textOffsetY_ = 0;
  this.textRotateWithView_ = undefined;
  this.textRotation_ = 0;
  this.textScale_ = 0;
  this.textFillState_ = null;
  this.textStrokeState_ = null;
  this.textState_ = null;
};
ol.inherits(ol.render.canvas.TextReplay, ol.render.canvas.Replay);
ol.render.canvas.TextReplay.prototype.drawText = function(flatCoordinates, offset, end, stride, geometry, feature) {
  if (this.text_ === "" || !this.textState_ || !this.textFillState_ && !this.textStrokeState_) {
    return;
  }
  if (this.textFillState_) {
    this.setReplayFillState_(this.textFillState_);
  }
  if (this.textStrokeState_) {
    this.setReplayStrokeState_(this.textStrokeState_);
  }
  this.setReplayTextState_(this.textState_);
  this.beginGeometry(geometry, feature);
  var myBegin = this.coordinates.length;
  var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
  var fill = !!this.textFillState_;
  var stroke = !!this.textStrokeState_;
  var drawTextInstruction = [ol.render.canvas.Instruction.DRAW_TEXT, myBegin, myEnd, this.text_, this.textOffsetX_, this.textOffsetY_, this.textRotation_, this.textScale_, fill, stroke, this.textRotateWithView_];
  this.instructions.push(drawTextInstruction);
  this.hitDetectionInstructions.push(drawTextInstruction);
  this.endGeometry(geometry, feature);
};
ol.render.canvas.TextReplay.prototype.setReplayFillState_ = function(fillState) {
  var replayFillState = this.replayFillState_;
  if (replayFillState && replayFillState.fillStyle == fillState.fillStyle) {
    return;
  }
  var setFillStyleInstruction = [ol.render.canvas.Instruction.SET_FILL_STYLE, fillState.fillStyle];
  this.instructions.push(setFillStyleInstruction);
  this.hitDetectionInstructions.push(setFillStyleInstruction);
  if (!replayFillState) {
    this.replayFillState_ = {fillStyle:fillState.fillStyle};
  } else {
    replayFillState.fillStyle = fillState.fillStyle;
  }
};
ol.render.canvas.TextReplay.prototype.setReplayStrokeState_ = function(strokeState) {
  var replayStrokeState = this.replayStrokeState_;
  if (replayStrokeState && replayStrokeState.lineCap == strokeState.lineCap && replayStrokeState.lineDash == strokeState.lineDash && replayStrokeState.lineJoin == strokeState.lineJoin && replayStrokeState.lineWidth == strokeState.lineWidth && replayStrokeState.miterLimit == strokeState.miterLimit && replayStrokeState.strokeStyle == strokeState.strokeStyle) {
    return;
  }
  var setStrokeStyleInstruction = [ol.render.canvas.Instruction.SET_STROKE_STYLE, strokeState.strokeStyle, strokeState.lineWidth, strokeState.lineCap, strokeState.lineJoin, strokeState.miterLimit, strokeState.lineDash, false];
  this.instructions.push(setStrokeStyleInstruction);
  this.hitDetectionInstructions.push(setStrokeStyleInstruction);
  if (!replayStrokeState) {
    this.replayStrokeState_ = {lineCap:strokeState.lineCap, lineDash:strokeState.lineDash, lineJoin:strokeState.lineJoin, lineWidth:strokeState.lineWidth, miterLimit:strokeState.miterLimit, strokeStyle:strokeState.strokeStyle};
  } else {
    replayStrokeState.lineCap = strokeState.lineCap;
    replayStrokeState.lineDash = strokeState.lineDash;
    replayStrokeState.lineJoin = strokeState.lineJoin;
    replayStrokeState.lineWidth = strokeState.lineWidth;
    replayStrokeState.miterLimit = strokeState.miterLimit;
    replayStrokeState.strokeStyle = strokeState.strokeStyle;
  }
};
ol.render.canvas.TextReplay.prototype.setReplayTextState_ = function(textState) {
  var replayTextState = this.replayTextState_;
  if (replayTextState && replayTextState.font == textState.font && replayTextState.textAlign == textState.textAlign && replayTextState.textBaseline == textState.textBaseline) {
    return;
  }
  var setTextStyleInstruction = [ol.render.canvas.Instruction.SET_TEXT_STYLE, textState.font, textState.textAlign, textState.textBaseline];
  this.instructions.push(setTextStyleInstruction);
  this.hitDetectionInstructions.push(setTextStyleInstruction);
  if (!replayTextState) {
    this.replayTextState_ = {font:textState.font, textAlign:textState.textAlign, textBaseline:textState.textBaseline};
  } else {
    replayTextState.font = textState.font;
    replayTextState.textAlign = textState.textAlign;
    replayTextState.textBaseline = textState.textBaseline;
  }
};
ol.render.canvas.TextReplay.prototype.setTextStyle = function(textStyle) {
  if (!textStyle) {
    this.text_ = "";
  } else {
    var textFillStyle = textStyle.getFill();
    if (!textFillStyle) {
      this.textFillState_ = null;
    } else {
      var textFillStyleColor = textFillStyle.getColor();
      var fillStyle = ol.colorlike.asColorLike(textFillStyleColor ? textFillStyleColor : ol.render.canvas.defaultFillStyle);
      if (!this.textFillState_) {
        this.textFillState_ = {fillStyle:fillStyle};
      } else {
        var textFillState = this.textFillState_;
        textFillState.fillStyle = fillStyle;
      }
    }
    var textStrokeStyle = textStyle.getStroke();
    if (!textStrokeStyle) {
      this.textStrokeState_ = null;
    } else {
      var textStrokeStyleColor = textStrokeStyle.getColor();
      var textStrokeStyleLineCap = textStrokeStyle.getLineCap();
      var textStrokeStyleLineDash = textStrokeStyle.getLineDash();
      var textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
      var textStrokeStyleWidth = textStrokeStyle.getWidth();
      var textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
      var lineCap = textStrokeStyleLineCap !== undefined ? textStrokeStyleLineCap : ol.render.canvas.defaultLineCap;
      var lineDash = textStrokeStyleLineDash ? textStrokeStyleLineDash.slice() : ol.render.canvas.defaultLineDash;
      var lineJoin = textStrokeStyleLineJoin !== undefined ? textStrokeStyleLineJoin : ol.render.canvas.defaultLineJoin;
      var lineWidth = textStrokeStyleWidth !== undefined ? textStrokeStyleWidth : ol.render.canvas.defaultLineWidth;
      var miterLimit = textStrokeStyleMiterLimit !== undefined ? textStrokeStyleMiterLimit : ol.render.canvas.defaultMiterLimit;
      var strokeStyle = ol.colorlike.asColorLike(textStrokeStyleColor ? textStrokeStyleColor : ol.render.canvas.defaultStrokeStyle);
      if (!this.textStrokeState_) {
        this.textStrokeState_ = {lineCap:lineCap, lineDash:lineDash, lineJoin:lineJoin, lineWidth:lineWidth, miterLimit:miterLimit, strokeStyle:strokeStyle};
      } else {
        var textStrokeState = this.textStrokeState_;
        textStrokeState.lineCap = lineCap;
        textStrokeState.lineDash = lineDash;
        textStrokeState.lineJoin = lineJoin;
        textStrokeState.lineWidth = lineWidth;
        textStrokeState.miterLimit = miterLimit;
        textStrokeState.strokeStyle = strokeStyle;
      }
    }
    var textFont = textStyle.getFont();
    var textOffsetX = textStyle.getOffsetX();
    var textOffsetY = textStyle.getOffsetY();
    var textRotateWithView = textStyle.getRotateWithView();
    var textRotation = textStyle.getRotation();
    var textScale = textStyle.getScale();
    var textText = textStyle.getText();
    var textTextAlign = textStyle.getTextAlign();
    var textTextBaseline = textStyle.getTextBaseline();
    var font = textFont !== undefined ? textFont : ol.render.canvas.defaultFont;
    var textAlign = textTextAlign !== undefined ? textTextAlign : ol.render.canvas.defaultTextAlign;
    var textBaseline = textTextBaseline !== undefined ? textTextBaseline : ol.render.canvas.defaultTextBaseline;
    if (!this.textState_) {
      this.textState_ = {font:font, textAlign:textAlign, textBaseline:textBaseline};
    } else {
      var textState = this.textState_;
      textState.font = font;
      textState.textAlign = textAlign;
      textState.textBaseline = textBaseline;
    }
    this.text_ = textText !== undefined ? textText : "";
    this.textOffsetX_ = textOffsetX !== undefined ? textOffsetX : 0;
    this.textOffsetY_ = textOffsetY !== undefined ? textOffsetY : 0;
    this.textRotateWithView_ = textRotateWithView !== undefined ? textRotateWithView : false;
    this.textRotation_ = textRotation !== undefined ? textRotation : 0;
    this.textScale_ = textScale !== undefined ? textScale : 1;
  }
};
goog.provide("ol.render.ReplayType");
ol.render.ReplayType = {IMAGE:"Image", LINE_STRING:"LineString", POLYGON:"Polygon", TEXT:"Text"};
goog.provide("ol.render.replay");
goog.require("ol.render.ReplayType");
ol.render.replay.ORDER = [ol.render.ReplayType.POLYGON, ol.render.ReplayType.LINE_STRING, ol.render.ReplayType.IMAGE, ol.render.ReplayType.TEXT];
goog.provide("ol.render.canvas.ReplayGroup");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.dom");
goog.require("ol.extent");
goog.require("ol.geom.flat.transform");
goog.require("ol.obj");
goog.require("ol.render.ReplayGroup");
goog.require("ol.render.canvas.ImageReplay");
goog.require("ol.render.canvas.LineStringReplay");
goog.require("ol.render.canvas.PolygonReplay");
goog.require("ol.render.canvas.TextReplay");
goog.require("ol.render.replay");
goog.require("ol.transform");
ol.render.canvas.ReplayGroup = function(tolerance, maxExtent, resolution, overlaps, opt_renderBuffer) {
  ol.render.ReplayGroup.call(this);
  this.tolerance_ = tolerance;
  this.maxExtent_ = maxExtent;
  this.overlaps_ = overlaps;
  this.resolution_ = resolution;
  this.renderBuffer_ = opt_renderBuffer;
  this.replaysByZIndex_ = {};
  this.hitDetectionContext_ = ol.dom.createCanvasContext2D(1, 1);
  this.hitDetectionTransform_ = ol.transform.create();
};
ol.inherits(ol.render.canvas.ReplayGroup, ol.render.ReplayGroup);
ol.render.canvas.ReplayGroup.prototype.finish = function() {
  var zKey;
  for (zKey in this.replaysByZIndex_) {
    var replays = this.replaysByZIndex_[zKey];
    var replayKey;
    for (replayKey in replays) {
      replays[replayKey].finish();
    }
  }
};
ol.render.canvas.ReplayGroup.prototype.forEachFeatureAtCoordinate = function(coordinate, resolution, rotation, skippedFeaturesHash, callback) {
  var transform = ol.transform.compose(this.hitDetectionTransform_, .5, .5, 1 / resolution, -1 / resolution, -rotation, -coordinate[0], -coordinate[1]);
  var context = this.hitDetectionContext_;
  context.clearRect(0, 0, 1, 1);
  var hitExtent;
  if (this.renderBuffer_ !== undefined) {
    hitExtent = ol.extent.createEmpty();
    ol.extent.extendCoordinate(hitExtent, coordinate);
    ol.extent.buffer(hitExtent, resolution * this.renderBuffer_, hitExtent);
  }
  return this.replayHitDetection_(context, transform, rotation, skippedFeaturesHash, function(feature) {
    var imageData = context.getImageData(0, 0, 1, 1).data;
    if (imageData[3] > 0) {
      var result = callback(feature);
      if (result) {
        return result;
      }
      context.clearRect(0, 0, 1, 1);
    }
  }, hitExtent);
};
ol.render.canvas.ReplayGroup.prototype.getReplay = function(zIndex, replayType) {
  var zIndexKey = zIndex !== undefined ? zIndex.toString() : "0";
  var replays = this.replaysByZIndex_[zIndexKey];
  if (replays === undefined) {
    replays = {};
    this.replaysByZIndex_[zIndexKey] = replays;
  }
  var replay = replays[replayType];
  if (replay === undefined) {
    var Constructor = ol.render.canvas.ReplayGroup.BATCH_CONSTRUCTORS_[replayType];
    ol.DEBUG && console.assert(Constructor !== undefined, replayType + " constructor missing from ol.render.canvas.ReplayGroup.BATCH_CONSTRUCTORS_");
    replay = new Constructor(this.tolerance_, this.maxExtent_, this.resolution_, this.overlaps_);
    replays[replayType] = replay;
  }
  return replay;
};
ol.render.canvas.ReplayGroup.prototype.isEmpty = function() {
  return ol.obj.isEmpty(this.replaysByZIndex_);
};
ol.render.canvas.ReplayGroup.prototype.replay = function(context, pixelRatio, transform, viewRotation, skippedFeaturesHash, opt_replayTypes) {
  var zs = Object.keys(this.replaysByZIndex_).map(Number);
  zs.sort(ol.array.numberSafeCompareFunction);
  var maxExtent = this.maxExtent_;
  var minX = maxExtent[0];
  var minY = maxExtent[1];
  var maxX = maxExtent[2];
  var maxY = maxExtent[3];
  var flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY];
  ol.geom.flat.transform.transform2D(flatClipCoords, 0, 8, 2, transform, flatClipCoords);
  context.save();
  context.beginPath();
  context.moveTo(flatClipCoords[0], flatClipCoords[1]);
  context.lineTo(flatClipCoords[2], flatClipCoords[3]);
  context.lineTo(flatClipCoords[4], flatClipCoords[5]);
  context.lineTo(flatClipCoords[6], flatClipCoords[7]);
  context.clip();
  var replayTypes = opt_replayTypes ? opt_replayTypes : ol.render.replay.ORDER;
  var i, ii, j, jj, replays, replay;
  for (i = 0, ii = zs.length;i < ii;++i) {
    replays = this.replaysByZIndex_[zs[i].toString()];
    for (j = 0, jj = replayTypes.length;j < jj;++j) {
      replay = replays[replayTypes[j]];
      if (replay !== undefined) {
        replay.replay(context, pixelRatio, transform, viewRotation, skippedFeaturesHash);
      }
    }
  }
  context.restore();
};
ol.render.canvas.ReplayGroup.prototype.replayHitDetection_ = function(context, transform, viewRotation, skippedFeaturesHash, featureCallback, opt_hitExtent) {
  var zs = Object.keys(this.replaysByZIndex_).map(Number);
  zs.sort(function(a, b) {
    return b - a;
  });
  var i, ii, j, replays, replay, result;
  for (i = 0, ii = zs.length;i < ii;++i) {
    replays = this.replaysByZIndex_[zs[i].toString()];
    for (j = ol.render.replay.ORDER.length - 1;j >= 0;--j) {
      replay = replays[ol.render.replay.ORDER[j]];
      if (replay !== undefined) {
        result = replay.replayHitDetection(context, transform, viewRotation, skippedFeaturesHash, featureCallback, opt_hitExtent);
        if (result) {
          return result;
        }
      }
    }
  }
  return undefined;
};
ol.render.canvas.ReplayGroup.BATCH_CONSTRUCTORS_ = {"Image":ol.render.canvas.ImageReplay, "LineString":ol.render.canvas.LineStringReplay, "Polygon":ol.render.canvas.PolygonReplay, "Text":ol.render.canvas.TextReplay};
goog.provide("ol.renderer.vector");
goog.require("ol");
goog.require("ol.Image");
goog.require("ol.render.ReplayType");
ol.renderer.vector.defaultOrder = function(feature1, feature2) {
  return ol.getUid(feature1) - ol.getUid(feature2);
};
ol.renderer.vector.getSquaredTolerance = function(resolution, pixelRatio) {
  var tolerance = ol.renderer.vector.getTolerance(resolution, pixelRatio);
  return tolerance * tolerance;
};
ol.renderer.vector.getTolerance = function(resolution, pixelRatio) {
  return ol.SIMPLIFY_TOLERANCE * resolution / pixelRatio;
};
ol.renderer.vector.renderCircleGeometry_ = function(replayGroup, geometry, style, feature) {
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  if (fillStyle || strokeStyle) {
    var polygonReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.POLYGON);
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawCircle(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry.getCenter(), 0, 2, 2, geometry, feature);
  }
};
ol.renderer.vector.renderFeature = function(replayGroup, feature, style, squaredTolerance, listener, thisArg) {
  var loading = false;
  var imageStyle, imageState;
  imageStyle = style.getImage();
  if (imageStyle) {
    imageState = imageStyle.getImageState();
    if (imageState == ol.Image.State.LOADED || imageState == ol.Image.State.ERROR) {
      imageStyle.unlistenImageChange(listener, thisArg);
    } else {
      if (imageState == ol.Image.State.IDLE) {
        imageStyle.load();
      }
      imageState = imageStyle.getImageState();
      ol.DEBUG && console.assert(imageState == ol.Image.State.LOADING, "imageState should be LOADING");
      imageStyle.listenImageChange(listener, thisArg);
      loading = true;
    }
  }
  ol.renderer.vector.renderFeature_(replayGroup, feature, style, squaredTolerance);
  return loading;
};
ol.renderer.vector.renderFeature_ = function(replayGroup, feature, style, squaredTolerance) {
  var geometry = style.getGeometryFunction()(feature);
  if (!geometry) {
    return;
  }
  var simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
  var geometryRenderer = ol.renderer.vector.GEOMETRY_RENDERERS_[simplifiedGeometry.getType()];
  geometryRenderer(replayGroup, simplifiedGeometry, style, feature);
};
ol.renderer.vector.renderGeometryCollectionGeometry_ = function(replayGroup, geometry, style, feature) {
  var geometries = geometry.getGeometriesArray();
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    var geometryRenderer = ol.renderer.vector.GEOMETRY_RENDERERS_[geometries[i].getType()];
    geometryRenderer(replayGroup, geometries[i], style, feature);
  }
};
ol.renderer.vector.renderLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
  var strokeStyle = style.getStroke();
  if (strokeStyle) {
    var lineStringReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.LINE_STRING);
    lineStringReplay.setFillStrokeStyle(null, strokeStyle);
    lineStringReplay.drawLineString(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry.getFlatMidpoint(), 0, 2, 2, geometry, feature);
  }
};
ol.renderer.vector.renderMultiLineStringGeometry_ = function(replayGroup, geometry, style, feature) {
  var strokeStyle = style.getStroke();
  if (strokeStyle) {
    var lineStringReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.LINE_STRING);
    lineStringReplay.setFillStrokeStyle(null, strokeStyle);
    lineStringReplay.drawMultiLineString(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    var flatMidpointCoordinates = geometry.getFlatMidpoints();
    textReplay.drawText(flatMidpointCoordinates, 0, flatMidpointCoordinates.length, 2, geometry, feature);
  }
};
ol.renderer.vector.renderMultiPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  if (strokeStyle || fillStyle) {
    var polygonReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.POLYGON);
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawMultiPolygon(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    var flatInteriorPointCoordinates = geometry.getFlatInteriorPoints();
    textReplay.drawText(flatInteriorPointCoordinates, 0, flatInteriorPointCoordinates.length, 2, geometry, feature);
  }
};
ol.renderer.vector.renderPointGeometry_ = function(replayGroup, geometry, style, feature) {
  var imageStyle = style.getImage();
  if (imageStyle) {
    if (imageStyle.getImageState() != ol.Image.State.LOADED) {
      return;
    }
    var imageReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.IMAGE);
    imageReplay.setImageStyle(imageStyle);
    imageReplay.drawPoint(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry.getFlatCoordinates(), 0, 2, 2, geometry, feature);
  }
};
ol.renderer.vector.renderMultiPointGeometry_ = function(replayGroup, geometry, style, feature) {
  var imageStyle = style.getImage();
  if (imageStyle) {
    if (imageStyle.getImageState() != ol.Image.State.LOADED) {
      return;
    }
    var imageReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.IMAGE);
    imageReplay.setImageStyle(imageStyle);
    imageReplay.drawMultiPoint(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    var flatCoordinates = geometry.getFlatCoordinates();
    textReplay.drawText(flatCoordinates, 0, flatCoordinates.length, geometry.getStride(), geometry, feature);
  }
};
ol.renderer.vector.renderPolygonGeometry_ = function(replayGroup, geometry, style, feature) {
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  if (fillStyle || strokeStyle) {
    var polygonReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.POLYGON);
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawPolygon(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), ol.render.ReplayType.TEXT);
    textReplay.setTextStyle(textStyle);
    textReplay.drawText(geometry.getFlatInteriorPoint(), 0, 2, 2, geometry, feature);
  }
};
ol.renderer.vector.GEOMETRY_RENDERERS_ = {"Point":ol.renderer.vector.renderPointGeometry_, "LineString":ol.renderer.vector.renderLineStringGeometry_, "Polygon":ol.renderer.vector.renderPolygonGeometry_, "MultiPoint":ol.renderer.vector.renderMultiPointGeometry_, "MultiLineString":ol.renderer.vector.renderMultiLineStringGeometry_, "MultiPolygon":ol.renderer.vector.renderMultiPolygonGeometry_, "GeometryCollection":ol.renderer.vector.renderGeometryCollectionGeometry_, "Circle":ol.renderer.vector.renderCircleGeometry_};
goog.provide("ol.ImageCanvas");
goog.require("ol");
goog.require("ol.Image");
goog.require("ol.ImageBase");
ol.ImageCanvas = function(extent, resolution, pixelRatio, attributions, canvas, opt_loader) {
  this.loader_ = opt_loader !== undefined ? opt_loader : null;
  var state = opt_loader !== undefined ? ol.Image.State.IDLE : ol.Image.State.LOADED;
  ol.ImageBase.call(this, extent, resolution, pixelRatio, state, attributions);
  this.canvas_ = canvas;
  this.error_ = null;
};
ol.inherits(ol.ImageCanvas, ol.ImageBase);
ol.ImageCanvas.prototype.getError = function() {
  return this.error_;
};
ol.ImageCanvas.prototype.handleLoad_ = function(err) {
  if (err) {
    this.error_ = err;
    this.state = ol.Image.State.ERROR;
  } else {
    this.state = ol.Image.State.LOADED;
  }
  this.changed();
};
ol.ImageCanvas.prototype.load = function() {
  if (this.state == ol.Image.State.IDLE) {
    ol.DEBUG && console.assert(this.loader_, "this.loader_ must be set");
    this.state = ol.Image.State.LOADING;
    this.changed();
    this.loader_(this.handleLoad_.bind(this));
  }
};
ol.ImageCanvas.prototype.getImage = function(opt_context) {
  return this.canvas_;
};
goog.provide("ol.reproj.Image");
goog.require("ol");
goog.require("ol.Image");
goog.require("ol.ImageBase");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.reproj");
goog.require("ol.reproj.Triangulation");
ol.reproj.Image = function(sourceProj, targetProj, targetExtent, targetResolution, pixelRatio, getImageFunction) {
  this.targetProj_ = targetProj;
  this.maxSourceExtent_ = sourceProj.getExtent();
  var maxTargetExtent = targetProj.getExtent();
  var limitedTargetExtent = maxTargetExtent ? ol.extent.getIntersection(targetExtent, maxTargetExtent) : targetExtent;
  var targetCenter = ol.extent.getCenter(limitedTargetExtent);
  var sourceResolution = ol.reproj.calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution);
  var errorThresholdInPixels = ol.DEFAULT_RASTER_REPROJECTION_ERROR_THRESHOLD;
  this.triangulation_ = new ol.reproj.Triangulation(sourceProj, targetProj, limitedTargetExtent, this.maxSourceExtent_, sourceResolution * errorThresholdInPixels);
  this.targetResolution_ = targetResolution;
  this.targetExtent_ = targetExtent;
  var sourceExtent = this.triangulation_.calculateSourceExtent();
  this.sourceImage_ = getImageFunction(sourceExtent, sourceResolution, pixelRatio);
  this.sourcePixelRatio_ = this.sourceImage_ ? this.sourceImage_.getPixelRatio() : 1;
  this.canvas_ = null;
  this.sourceListenerKey_ = null;
  var state = ol.Image.State.LOADED;
  var attributions = [];
  if (this.sourceImage_) {
    state = ol.Image.State.IDLE;
    attributions = this.sourceImage_.getAttributions();
  }
  ol.ImageBase.call(this, targetExtent, targetResolution, this.sourcePixelRatio_, state, attributions);
};
ol.inherits(ol.reproj.Image, ol.ImageBase);
ol.reproj.Image.prototype.disposeInternal = function() {
  if (this.state == ol.Image.State.LOADING) {
    this.unlistenSource_();
  }
  ol.ImageBase.prototype.disposeInternal.call(this);
};
ol.reproj.Image.prototype.getImage = function(opt_context) {
  return this.canvas_;
};
ol.reproj.Image.prototype.getProjection = function() {
  return this.targetProj_;
};
ol.reproj.Image.prototype.reproject_ = function() {
  var sourceState = this.sourceImage_.getState();
  if (sourceState == ol.Image.State.LOADED) {
    var width = ol.extent.getWidth(this.targetExtent_) / this.targetResolution_;
    var height = ol.extent.getHeight(this.targetExtent_) / this.targetResolution_;
    this.canvas_ = ol.reproj.render(width, height, this.sourcePixelRatio_, this.sourceImage_.getResolution(), this.maxSourceExtent_, this.targetResolution_, this.targetExtent_, this.triangulation_, [{extent:this.sourceImage_.getExtent(), image:this.sourceImage_.getImage()}], 0);
  }
  this.state = sourceState;
  this.changed();
};
ol.reproj.Image.prototype.load = function() {
  if (this.state == ol.Image.State.IDLE) {
    this.state = ol.Image.State.LOADING;
    this.changed();
    var sourceState = this.sourceImage_.getState();
    if (sourceState == ol.Image.State.LOADED || sourceState == ol.Image.State.ERROR) {
      this.reproject_();
    } else {
      this.sourceListenerKey_ = ol.events.listen(this.sourceImage_, ol.events.EventType.CHANGE, function(e) {
        var sourceState = this.sourceImage_.getState();
        if (sourceState == ol.Image.State.LOADED || sourceState == ol.Image.State.ERROR) {
          this.unlistenSource_();
          this.reproject_();
        }
      }, this);
      this.sourceImage_.load();
    }
  }
};
ol.reproj.Image.prototype.unlistenSource_ = function() {
  ol.DEBUG && console.assert(this.sourceListenerKey_, "this.sourceListenerKey_ should not be null");
  ol.events.unlistenByKey((this.sourceListenerKey_));
  this.sourceListenerKey_ = null;
};
goog.provide("ol.source.Image");
goog.require("ol");
goog.require("ol.Image");
goog.require("ol.array");
goog.require("ol.events.Event");
goog.require("ol.extent");
goog.require("ol.proj");
goog.require("ol.reproj.Image");
goog.require("ol.source.Source");
ol.source.Image = function(options) {
  ol.source.Source.call(this, {attributions:options.attributions, extent:options.extent, logo:options.logo, projection:options.projection, state:options.state});
  this.resolutions_ = options.resolutions !== undefined ? options.resolutions : null;
  ol.DEBUG && console.assert(!this.resolutions_ || ol.array.isSorted(this.resolutions_, function(a, b) {
    return b - a;
  }, true), "resolutions must be null or sorted in descending order");
  this.reprojectedImage_ = null;
  this.reprojectedRevision_ = 0;
};
ol.inherits(ol.source.Image, ol.source.Source);
ol.source.Image.prototype.getResolutions = function() {
  return this.resolutions_;
};
ol.source.Image.prototype.findNearestResolution = function(resolution) {
  if (this.resolutions_) {
    var idx = ol.array.linearFindNearest(this.resolutions_, resolution, 0);
    resolution = this.resolutions_[idx];
  }
  return resolution;
};
ol.source.Image.prototype.getImage = function(extent, resolution, pixelRatio, projection) {
  var sourceProjection = this.getProjection();
  if (!ol.ENABLE_RASTER_REPROJECTION || !sourceProjection || !projection || ol.proj.equivalent(sourceProjection, projection)) {
    if (sourceProjection) {
      projection = sourceProjection;
    }
    return this.getImageInternal(extent, resolution, pixelRatio, projection);
  } else {
    if (this.reprojectedImage_) {
      if (this.reprojectedRevision_ == this.getRevision() && ol.proj.equivalent(this.reprojectedImage_.getProjection(), projection) && this.reprojectedImage_.getResolution() == resolution && this.reprojectedImage_.getPixelRatio() == pixelRatio && ol.extent.equals(this.reprojectedImage_.getExtent(), extent)) {
        return this.reprojectedImage_;
      }
      this.reprojectedImage_.dispose();
      this.reprojectedImage_ = null;
    }
    this.reprojectedImage_ = new ol.reproj.Image(sourceProjection, projection, extent, resolution, pixelRatio, function(extent, resolution, pixelRatio) {
      return this.getImageInternal(extent, resolution, pixelRatio, sourceProjection);
    }.bind(this));
    this.reprojectedRevision_ = this.getRevision();
    return this.reprojectedImage_;
  }
};
ol.source.Image.prototype.getImageInternal = function(extent, resolution, pixelRatio, projection) {
};
ol.source.Image.prototype.handleImageChange = function(event) {
  var image = (event.target);
  switch(image.getState()) {
    case ol.Image.State.LOADING:
      this.dispatchEvent(new ol.source.Image.Event(ol.source.Image.EventType.IMAGELOADSTART, image));
      break;
    case ol.Image.State.LOADED:
      this.dispatchEvent(new ol.source.Image.Event(ol.source.Image.EventType.IMAGELOADEND, image));
      break;
    case ol.Image.State.ERROR:
      this.dispatchEvent(new ol.source.Image.Event(ol.source.Image.EventType.IMAGELOADERROR, image));
      break;
    default:
    ;
  }
};
ol.source.Image.defaultImageLoadFunction = function(image, src) {
  image.getImage().src = src;
};
ol.source.Image.Event = function(type, image) {
  ol.events.Event.call(this, type);
  this.image = image;
};
ol.inherits(ol.source.Image.Event, ol.events.Event);
ol.source.Image.EventType = {IMAGELOADSTART:"imageloadstart", IMAGELOADEND:"imageloadend", IMAGELOADERROR:"imageloaderror"};
goog.provide("ol.source.ImageCanvas");
goog.require("ol");
goog.require("ol.ImageCanvas");
goog.require("ol.extent");
goog.require("ol.source.Image");
ol.source.ImageCanvas = function(options) {
  ol.source.Image.call(this, {attributions:options.attributions, logo:options.logo, projection:options.projection, resolutions:options.resolutions, state:options.state});
  this.canvasFunction_ = options.canvasFunction;
  this.canvas_ = null;
  this.renderedRevision_ = 0;
  this.ratio_ = options.ratio !== undefined ? options.ratio : 1.5;
};
ol.inherits(ol.source.ImageCanvas, ol.source.Image);
ol.source.ImageCanvas.prototype.getImageInternal = function(extent, resolution, pixelRatio, projection) {
  resolution = this.findNearestResolution(resolution);
  var canvas = this.canvas_;
  if (canvas && this.renderedRevision_ == this.getRevision() && canvas.getResolution() == resolution && canvas.getPixelRatio() == pixelRatio && ol.extent.containsExtent(canvas.getExtent(), extent)) {
    return canvas;
  }
  extent = extent.slice();
  ol.extent.scaleFromCenter(extent, this.ratio_);
  var width = ol.extent.getWidth(extent) / resolution;
  var height = ol.extent.getHeight(extent) / resolution;
  var size = [width * pixelRatio, height * pixelRatio];
  var canvasElement = this.canvasFunction_(extent, resolution, pixelRatio, size, projection);
  if (canvasElement) {
    canvas = new ol.ImageCanvas(extent, resolution, pixelRatio, this.getAttributions(), canvasElement);
  }
  this.canvas_ = canvas;
  this.renderedRevision_ = this.getRevision();
  return canvas;
};
goog.provide("ol.source.ImageVector");
goog.require("ol");
goog.require("ol.dom");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.render.canvas.ReplayGroup");
goog.require("ol.renderer.vector");
goog.require("ol.source.ImageCanvas");
goog.require("ol.style.Style");
goog.require("ol.transform");
ol.source.ImageVector = function(options) {
  this.source_ = options.source;
  this.transform_ = ol.transform.create();
  this.canvasContext_ = ol.dom.createCanvasContext2D();
  this.canvasSize_ = [0, 0];
  this.renderBuffer_ = options.renderBuffer == undefined ? 100 : options.renderBuffer;
  this.replayGroup_ = null;
  ol.source.ImageCanvas.call(this, {attributions:options.attributions, canvasFunction:this.canvasFunctionInternal_.bind(this), logo:options.logo, projection:options.projection, ratio:options.ratio, resolutions:options.resolutions, state:this.source_.getState()});
  this.style_ = null;
  this.styleFunction_ = undefined;
  this.setStyle(options.style);
  ol.events.listen(this.source_, ol.events.EventType.CHANGE, this.handleSourceChange_, this);
};
ol.inherits(ol.source.ImageVector, ol.source.ImageCanvas);
ol.source.ImageVector.prototype.canvasFunctionInternal_ = function(extent, resolution, pixelRatio, size, projection) {
  var replayGroup = new ol.render.canvas.ReplayGroup(ol.renderer.vector.getTolerance(resolution, pixelRatio), extent, resolution, this.source_.getOverlaps(), this.renderBuffer_);
  this.source_.loadFeatures(extent, resolution, projection);
  var loading = false;
  this.source_.forEachFeatureInExtent(extent, function(feature) {
    loading = loading || this.renderFeature_(feature, resolution, pixelRatio, replayGroup);
  }, this);
  replayGroup.finish();
  if (loading) {
    return null;
  }
  if (this.canvasSize_[0] != size[0] || this.canvasSize_[1] != size[1]) {
    this.canvasContext_.canvas.width = size[0];
    this.canvasContext_.canvas.height = size[1];
    this.canvasSize_[0] = size[0];
    this.canvasSize_[1] = size[1];
  } else {
    this.canvasContext_.clearRect(0, 0, size[0], size[1]);
  }
  var transform = this.getTransform_(ol.extent.getCenter(extent), resolution, pixelRatio, size);
  replayGroup.replay(this.canvasContext_, pixelRatio, transform, 0, {});
  this.replayGroup_ = replayGroup;
  return this.canvasContext_.canvas;
};
ol.source.ImageVector.prototype.forEachFeatureAtCoordinate = function(coordinate, resolution, rotation, skippedFeatureUids, callback) {
  if (!this.replayGroup_) {
    return undefined;
  } else {
    var features = {};
    return this.replayGroup_.forEachFeatureAtCoordinate(coordinate, resolution, 0, skippedFeatureUids, function(feature) {
      var key = ol.getUid(feature).toString();
      if (!(key in features)) {
        features[key] = true;
        return callback(feature);
      }
    });
  }
};
ol.source.ImageVector.prototype.getSource = function() {
  return this.source_;
};
ol.source.ImageVector.prototype.getStyle = function() {
  return this.style_;
};
ol.source.ImageVector.prototype.getStyleFunction = function() {
  return this.styleFunction_;
};
ol.source.ImageVector.prototype.getTransform_ = function(center, resolution, pixelRatio, size) {
  var dx1 = size[0] / 2;
  var dy1 = size[1] / 2;
  var sx = pixelRatio / resolution;
  var sy = -sx;
  var dx2 = -center[0];
  var dy2 = -center[1];
  return ol.transform.compose(this.transform_, dx1, dy1, sx, sy, 0, dx2, dy2);
};
ol.source.ImageVector.prototype.handleImageChange_ = function(event) {
  this.changed();
};
ol.source.ImageVector.prototype.handleSourceChange_ = function() {
  this.setState(this.source_.getState());
};
ol.source.ImageVector.prototype.renderFeature_ = function(feature, resolution, pixelRatio, replayGroup) {
  var styles;
  var styleFunction = feature.getStyleFunction();
  if (styleFunction) {
    styles = styleFunction.call(feature, resolution);
  } else {
    if (this.styleFunction_) {
      styles = this.styleFunction_(feature, resolution);
    }
  }
  if (!styles) {
    return false;
  }
  var i, ii, loading = false;
  if (!Array.isArray(styles)) {
    styles = [styles];
  }
  for (i = 0, ii = styles.length;i < ii;++i) {
    loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles[i], ol.renderer.vector.getSquaredTolerance(resolution, pixelRatio), this.handleImageChange_, this) || loading;
  }
  return loading;
};
ol.source.ImageVector.prototype.setStyle = function(style) {
  this.style_ = style !== undefined ? style : ol.style.Style.defaultFunction;
  this.styleFunction_ = !style ? undefined : ol.style.Style.createFunction(this.style_);
  this.changed();
};
goog.provide("ol.renderer.canvas.ImageLayer");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.dom");
goog.require("ol.extent");
goog.require("ol.functions");
goog.require("ol.proj");
goog.require("ol.renderer.canvas.Layer");
goog.require("ol.source.ImageVector");
goog.require("ol.transform");
ol.renderer.canvas.ImageLayer = function(imageLayer) {
  ol.renderer.canvas.Layer.call(this, imageLayer);
  this.image_ = null;
  this.imageTransform_ = ol.transform.create();
  this.imageTransformInv_ = null;
  this.hitCanvasContext_ = null;
};
ol.inherits(ol.renderer.canvas.ImageLayer, ol.renderer.canvas.Layer);
ol.renderer.canvas.ImageLayer.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg) {
  var layer = this.getLayer();
  var source = layer.getSource();
  var resolution = frameState.viewState.resolution;
  var rotation = frameState.viewState.rotation;
  var skippedFeatureUids = frameState.skippedFeatureUids;
  return source.forEachFeatureAtCoordinate(coordinate, resolution, rotation, skippedFeatureUids, function(feature) {
    return callback.call(thisArg, feature, layer);
  });
};
ol.renderer.canvas.ImageLayer.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg) {
  if (!this.getImage()) {
    return undefined;
  }
  if (this.getLayer().getSource() instanceof ol.source.ImageVector) {
    var coordinate = ol.transform.apply(frameState.pixelToCoordinateTransform, pixel.slice());
    var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, ol.functions.TRUE, this);
    if (hasFeature) {
      return callback.call(thisArg, this.getLayer(), null);
    } else {
      return undefined;
    }
  } else {
    if (!this.imageTransformInv_) {
      this.imageTransformInv_ = ol.transform.invert(this.imageTransform_.slice());
    }
    var pixelOnCanvas = this.getPixelOnCanvas(pixel, this.imageTransformInv_);
    if (!this.hitCanvasContext_) {
      this.hitCanvasContext_ = ol.dom.createCanvasContext2D(1, 1);
    }
    this.hitCanvasContext_.clearRect(0, 0, 1, 1);
    this.hitCanvasContext_.drawImage(this.getImage(), pixelOnCanvas[0], pixelOnCanvas[1], 1, 1, 0, 0, 1, 1);
    var imageData = this.hitCanvasContext_.getImageData(0, 0, 1, 1).data;
    if (imageData[3] > 0) {
      return callback.call(thisArg, this.getLayer(), imageData);
    } else {
      return undefined;
    }
  }
};
ol.renderer.canvas.ImageLayer.prototype.getImage = function() {
  return !this.image_ ? null : this.image_.getImage();
};
ol.renderer.canvas.ImageLayer.prototype.getImageTransform = function() {
  return this.imageTransform_;
};
ol.renderer.canvas.ImageLayer.prototype.prepareFrame = function(frameState, layerState) {
  var pixelRatio = frameState.pixelRatio;
  var viewState = frameState.viewState;
  var viewCenter = viewState.center;
  var viewResolution = viewState.resolution;
  var image;
  var imageLayer = (this.getLayer());
  var imageSource = imageLayer.getSource();
  var hints = frameState.viewHints;
  var renderedExtent = frameState.extent;
  if (layerState.extent !== undefined) {
    renderedExtent = ol.extent.getIntersection(renderedExtent, layerState.extent);
  }
  if (!hints[ol.View.Hint.ANIMATING] && !hints[ol.View.Hint.INTERACTING] && !ol.extent.isEmpty(renderedExtent)) {
    var projection = viewState.projection;
    if (!ol.ENABLE_RASTER_REPROJECTION) {
      var sourceProjection = imageSource.getProjection();
      if (sourceProjection) {
        ol.DEBUG && console.assert(ol.proj.equivalent(projection, sourceProjection), "projection and sourceProjection are equivalent");
        projection = sourceProjection;
      }
    }
    image = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
    if (image) {
      var loaded = this.loadImage(image);
      if (loaded) {
        this.image_ = image;
      }
    }
  }
  if (this.image_) {
    image = this.image_;
    var imageExtent = image.getExtent();
    var imageResolution = image.getResolution();
    var imagePixelRatio = image.getPixelRatio();
    var scale = pixelRatio * imageResolution / (viewResolution * imagePixelRatio);
    var transform = ol.transform.reset(this.imageTransform_);
    ol.transform.translate(transform, pixelRatio * frameState.size[0] / 2, pixelRatio * frameState.size[1] / 2);
    ol.transform.scale(transform, scale, scale);
    ol.transform.translate(transform, imagePixelRatio * (imageExtent[0] - viewCenter[0]) / imageResolution, imagePixelRatio * (viewCenter[1] - imageExtent[3]) / imageResolution);
    this.imageTransformInv_ = null;
    this.updateAttributions(frameState.attributions, image.getAttributions());
    this.updateLogos(frameState, imageSource);
  }
  return !!this.image_;
};
goog.provide("ol.renderer.canvas.TileLayer");
goog.require("ol");
goog.require("ol.transform");
goog.require("ol.TileRange");
goog.require("ol.Tile");
goog.require("ol.array");
goog.require("ol.dom");
goog.require("ol.extent");
goog.require("ol.render.canvas");
goog.require("ol.render.Event");
goog.require("ol.renderer.canvas.Layer");
ol.renderer.canvas.TileLayer = function(tileLayer) {
  ol.renderer.canvas.Layer.call(this, tileLayer);
  this.context = ol.dom.createCanvasContext2D();
  this.renderedTiles = [];
  this.tmpExtent = ol.extent.createEmpty();
  this.tmpTileCoord_ = [0, 0, 0];
  this.imageTransform_ = ol.transform.create();
  this.zDirection = 0;
};
ol.inherits(ol.renderer.canvas.TileLayer, ol.renderer.canvas.Layer);
ol.renderer.canvas.TileLayer.prototype.composeFrame = function(frameState, layerState, context) {
  var transform = this.getTransform(frameState, 0);
  this.dispatchPreComposeEvent(context, frameState, transform);
  this.renderTileImages(context, frameState, layerState);
  this.dispatchPostComposeEvent(context, frameState, transform);
};
ol.renderer.canvas.TileLayer.prototype.prepareFrame = function(frameState, layerState) {
  var pixelRatio = frameState.pixelRatio;
  var viewState = frameState.viewState;
  var projection = viewState.projection;
  var tileLayer = this.getLayer();
  var tileSource = (tileLayer.getSource());
  var tileGrid = tileSource.getTileGridForProjection(projection);
  var z = tileGrid.getZForResolution(viewState.resolution, this.zDirection);
  var tileResolution = tileGrid.getResolution(z);
  var extent = frameState.extent;
  if (layerState.extent !== undefined) {
    extent = ol.extent.getIntersection(extent, layerState.extent);
  }
  if (ol.extent.isEmpty(extent)) {
    return false;
  }
  var tileRange = tileGrid.getTileRangeForExtentAndResolution(extent, tileResolution);
  var tilesToDrawByZ = {};
  tilesToDrawByZ[z] = {};
  var findLoadedTiles = this.createLoadedTileFinder(tileSource, projection, tilesToDrawByZ);
  var useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();
  var tmpExtent = this.tmpExtent;
  var tmpTileRange = new ol.TileRange(0, 0, 0, 0);
  var childTileRange, fullyLoaded, tile, x, y;
  var drawableTile = function(tile) {
    var tileState = tile.getState();
    return tileState == ol.Tile.State.LOADED || tileState == ol.Tile.State.EMPTY || tileState == ol.Tile.State.ERROR && !useInterimTilesOnError;
  };
  for (x = tileRange.minX;x <= tileRange.maxX;++x) {
    for (y = tileRange.minY;y <= tileRange.maxY;++y) {
      tile = tileSource.getTile(z, x, y, pixelRatio, projection);
      if (!drawableTile(tile)) {
        tile = tile.getInterimTile();
      }
      if (drawableTile(tile)) {
        tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
        continue;
      }
      fullyLoaded = tileGrid.forEachTileCoordParentTileRange(tile.tileCoord, findLoadedTiles, null, tmpTileRange, tmpExtent);
      if (!fullyLoaded) {
        childTileRange = tileGrid.getTileCoordChildTileRange(tile.tileCoord, tmpTileRange, tmpExtent);
        if (childTileRange) {
          findLoadedTiles(z + 1, childTileRange);
        }
      }
    }
  }
  var zs = Object.keys(tilesToDrawByZ).map(Number);
  zs.sort(ol.array.numberSafeCompareFunction);
  var renderables = this.renderedTiles;
  renderables.length = 0;
  var i, ii, currentZ, tileCoordKey, tilesToDraw;
  for (i = 0, ii = zs.length;i < ii;++i) {
    currentZ = zs[i];
    tilesToDraw = tilesToDrawByZ[currentZ];
    for (tileCoordKey in tilesToDraw) {
      tile = tilesToDraw[tileCoordKey];
      if (tile.getState() == ol.Tile.State.LOADED) {
        renderables.push(tile);
      }
    }
  }
  this.updateUsedTiles(frameState.usedTiles, tileSource, z, tileRange);
  this.manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, z, tileLayer.getPreload());
  this.scheduleExpireCache(frameState, tileSource);
  this.updateLogos(frameState, tileSource);
  return true;
};
ol.renderer.canvas.TileLayer.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg) {
  var canvas = this.context.canvas;
  var size = frameState.size;
  var pixelRatio = frameState.pixelRatio;
  canvas.width = size[0] * pixelRatio;
  canvas.height = size[1] * pixelRatio;
  this.composeFrame(frameState, this.getLayer().getLayerState(), this.context);
  var imageData = this.context.getImageData(pixel[0], pixel[1], 1, 1).data;
  if (imageData[3] > 0) {
    return callback.call(thisArg, this.getLayer(), imageData);
  } else {
    return undefined;
  }
};
ol.renderer.canvas.TileLayer.prototype.renderTileImages = function(context, frameState, layerState) {
  var tilesToDraw = this.renderedTiles;
  if (tilesToDraw.length === 0) {
    return;
  }
  var pixelRatio = frameState.pixelRatio;
  var viewState = frameState.viewState;
  var center = viewState.center;
  var projection = viewState.projection;
  var resolution = viewState.resolution;
  var rotation = viewState.rotation;
  var size = frameState.size;
  var offsetX = Math.round(pixelRatio * size[0] / 2);
  var offsetY = Math.round(pixelRatio * size[1] / 2);
  var pixelScale = pixelRatio / resolution;
  var layer = this.getLayer();
  var source = (layer.getSource());
  var tileGutter = source.getTilePixelRatio(pixelRatio) * source.getGutter(projection);
  var tileGrid = source.getTileGridForProjection(projection);
  var hasRenderListeners = layer.hasListener(ol.render.Event.Type.RENDER);
  var renderContext = context;
  var drawScale = 1;
  var drawOffsetX, drawOffsetY, drawSize;
  if (rotation || hasRenderListeners) {
    renderContext = this.context;
    var renderCanvas = renderContext.canvas;
    drawScale = source.getTilePixelRatio(pixelRatio) / pixelRatio;
    var width = context.canvas.width * drawScale;
    var height = context.canvas.height * drawScale;
    drawSize = Math.round(Math.sqrt(width * width + height * height));
    if (renderCanvas.width != drawSize) {
      renderCanvas.width = renderCanvas.height = drawSize;
    } else {
      renderContext.clearRect(0, 0, drawSize, drawSize);
    }
    drawOffsetX = (drawSize - width) / 2 / drawScale;
    drawOffsetY = (drawSize - height) / 2 / drawScale;
    pixelScale *= drawScale;
    offsetX = Math.round(drawScale * (offsetX + drawOffsetX));
    offsetY = Math.round(drawScale * (offsetY + drawOffsetY));
  }
  var alpha = renderContext.globalAlpha;
  renderContext.globalAlpha = layerState.opacity;
  var pixelExtents;
  var opaque = source.getOpaque(projection) && layerState.opacity == 1;
  if (!opaque) {
    tilesToDraw.reverse();
    pixelExtents = [];
  }
  var extent = layerState.extent;
  var clipped = extent !== undefined;
  if (clipped) {
    var topLeft = ol.extent.getTopLeft((extent));
    var topRight = ol.extent.getTopRight((extent));
    var bottomRight = ol.extent.getBottomRight((extent));
    var bottomLeft = ol.extent.getBottomLeft((extent));
    ol.transform.apply(frameState.coordinateToPixelTransform, topLeft);
    ol.transform.apply(frameState.coordinateToPixelTransform, topRight);
    ol.transform.apply(frameState.coordinateToPixelTransform, bottomRight);
    ol.transform.apply(frameState.coordinateToPixelTransform, bottomLeft);
    var ox = drawOffsetX || 0;
    var oy = drawOffsetY || 0;
    renderContext.save();
    var cx = renderContext.canvas.width / 2;
    var cy = renderContext.canvas.height / 2;
    ol.render.canvas.rotateAtOffset(renderContext, -rotation, cx, cy);
    renderContext.beginPath();
    renderContext.moveTo(drawScale * (topLeft[0] * pixelRatio + ox), drawScale * (topLeft[1] * pixelRatio + oy));
    renderContext.lineTo(drawScale * (topRight[0] * pixelRatio + ox), drawScale * (topRight[1] * pixelRatio + oy));
    renderContext.lineTo(drawScale * (bottomRight[0] * pixelRatio + ox), drawScale * (bottomRight[1] * pixelRatio + oy));
    renderContext.lineTo(drawScale * (bottomLeft[0] * pixelRatio + ox), drawScale * (bottomLeft[1] * pixelRatio + oy));
    renderContext.clip();
    ol.render.canvas.rotateAtOffset(renderContext, rotation, cx, cy);
  }
  for (var i = 0, ii = tilesToDraw.length;i < ii;++i) {
    var tile = tilesToDraw[i];
    var tileCoord = tile.getTileCoord();
    var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent);
    var currentZ = tileCoord[0];
    var origin = ol.extent.getBottomLeft(tileGrid.getTileCoordExtent(tileGrid.getTileCoordForCoordAndZ(center, currentZ, this.tmpTileCoord_)));
    var w = Math.round(ol.extent.getWidth(tileExtent) * pixelScale);
    var h = Math.round(ol.extent.getHeight(tileExtent) * pixelScale);
    var left = Math.round((tileExtent[0] - origin[0]) * pixelScale / w) * w + offsetX + Math.round((origin[0] - center[0]) * pixelScale);
    var top = Math.round((origin[1] - tileExtent[3]) * pixelScale / h) * h + offsetY + Math.round((center[1] - origin[1]) * pixelScale);
    if (!opaque) {
      var pixelExtent = [left, top, left + w, top + h];
      renderContext.save();
      for (var j = 0, jj = pixelExtents.length;j < jj;++j) {
        var clipExtent = pixelExtents[j];
        if (ol.extent.intersects(pixelExtent, clipExtent)) {
          renderContext.beginPath();
          renderContext.moveTo(pixelExtent[0], pixelExtent[1]);
          renderContext.lineTo(pixelExtent[0], pixelExtent[3]);
          renderContext.lineTo(pixelExtent[2], pixelExtent[3]);
          renderContext.lineTo(pixelExtent[2], pixelExtent[1]);
          renderContext.moveTo(clipExtent[0], clipExtent[1]);
          renderContext.lineTo(clipExtent[2], clipExtent[1]);
          renderContext.lineTo(clipExtent[2], clipExtent[3]);
          renderContext.lineTo(clipExtent[0], clipExtent[3]);
          renderContext.closePath();
          renderContext.clip();
        }
      }
      pixelExtents.push(pixelExtent);
    }
    var tilePixelSize = source.getTilePixelSize(currentZ, pixelRatio, projection);
    renderContext.drawImage(tile.getImage(), tileGutter, tileGutter, tilePixelSize[0], tilePixelSize[1], left, top, w, h);
    if (!opaque) {
      renderContext.restore();
    }
  }
  if (clipped) {
    renderContext.restore();
  }
  if (hasRenderListeners) {
    var dX = drawOffsetX - offsetX / drawScale + offsetX;
    var dY = drawOffsetY - offsetY / drawScale + offsetY;
    var imageTransform = ol.transform.compose(this.imageTransform_, drawSize / 2 - dX, drawSize / 2 - dY, pixelScale, -pixelScale, -rotation, -center[0] + dX / pixelScale, -center[1] - dY / pixelScale);
    this.dispatchRenderEvent(renderContext, frameState, imageTransform);
  }
  if (rotation || hasRenderListeners) {
    context.drawImage(renderContext.canvas, -Math.round(drawOffsetX), -Math.round(drawOffsetY), drawSize / drawScale, drawSize / drawScale);
  }
  renderContext.globalAlpha = alpha;
};
ol.renderer.canvas.TileLayer.prototype.getLayer;
goog.provide("ol.renderer.canvas.VectorLayer");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.dom");
goog.require("ol.extent");
goog.require("ol.render.Event");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.ReplayGroup");
goog.require("ol.renderer.canvas.Layer");
goog.require("ol.renderer.vector");
ol.renderer.canvas.VectorLayer = function(vectorLayer) {
  ol.renderer.canvas.Layer.call(this, vectorLayer);
  this.dirty_ = false;
  this.renderedRevision_ = -1;
  this.renderedResolution_ = NaN;
  this.renderedExtent_ = ol.extent.createEmpty();
  this.renderedRenderOrder_ = null;
  this.replayGroup_ = null;
  this.context_ = ol.dom.createCanvasContext2D();
};
ol.inherits(ol.renderer.canvas.VectorLayer, ol.renderer.canvas.Layer);
ol.renderer.canvas.VectorLayer.prototype.composeFrame = function(frameState, layerState, context) {
  var extent = frameState.extent;
  var pixelRatio = frameState.pixelRatio;
  var skippedFeatureUids = layerState.managed ? frameState.skippedFeatureUids : {};
  var viewState = frameState.viewState;
  var projection = viewState.projection;
  var rotation = viewState.rotation;
  var projectionExtent = projection.getExtent();
  var vectorSource = (this.getLayer().getSource());
  var transform = this.getTransform(frameState, 0);
  this.dispatchPreComposeEvent(context, frameState, transform);
  var clipExtent = layerState.extent;
  var clipped = clipExtent !== undefined;
  if (clipped) {
    this.clip(context, frameState, (clipExtent));
  }
  var replayGroup = this.replayGroup_;
  if (replayGroup && !replayGroup.isEmpty()) {
    var layer = this.getLayer();
    var drawOffsetX = 0;
    var drawOffsetY = 0;
    var replayContext;
    if (layer.hasListener(ol.render.Event.Type.RENDER)) {
      var drawWidth = context.canvas.width;
      var drawHeight = context.canvas.height;
      if (rotation) {
        var drawSize = Math.round(Math.sqrt(drawWidth * drawWidth + drawHeight * drawHeight));
        drawOffsetX = (drawSize - drawWidth) / 2;
        drawOffsetY = (drawSize - drawHeight) / 2;
        drawWidth = drawHeight = drawSize;
      }
      this.context_.canvas.width = drawWidth;
      this.context_.canvas.height = drawHeight;
      replayContext = this.context_;
    } else {
      replayContext = context;
    }
    var alpha = replayContext.globalAlpha;
    replayContext.globalAlpha = layerState.opacity;
    if (replayContext != context) {
      replayContext.translate(drawOffsetX, drawOffsetY);
    }
    var width = frameState.size[0] * pixelRatio;
    var height = frameState.size[1] * pixelRatio;
    ol.render.canvas.rotateAtOffset(replayContext, -rotation, width / 2, height / 2);
    replayGroup.replay(replayContext, pixelRatio, transform, rotation, skippedFeatureUids);
    if (vectorSource.getWrapX() && projection.canWrapX() && !ol.extent.containsExtent(projectionExtent, extent)) {
      var startX = extent[0];
      var worldWidth = ol.extent.getWidth(projectionExtent);
      var world = 0;
      var offsetX;
      while (startX < projectionExtent[0]) {
        --world;
        offsetX = worldWidth * world;
        transform = this.getTransform(frameState, offsetX);
        replayGroup.replay(replayContext, pixelRatio, transform, rotation, skippedFeatureUids);
        startX += worldWidth;
      }
      world = 0;
      startX = extent[2];
      while (startX > projectionExtent[2]) {
        ++world;
        offsetX = worldWidth * world;
        transform = this.getTransform(frameState, offsetX);
        replayGroup.replay(replayContext, pixelRatio, transform, rotation, skippedFeatureUids);
        startX -= worldWidth;
      }
      transform = this.getTransform(frameState, 0);
    }
    ol.render.canvas.rotateAtOffset(replayContext, rotation, width / 2, height / 2);
    if (replayContext != context) {
      this.dispatchRenderEvent(replayContext, frameState, transform);
      context.drawImage(replayContext.canvas, -drawOffsetX, -drawOffsetY);
      replayContext.translate(-drawOffsetX, -drawOffsetY);
    }
    replayContext.globalAlpha = alpha;
  }
  if (clipped) {
    context.restore();
  }
  this.dispatchPostComposeEvent(context, frameState, transform);
};
ol.renderer.canvas.VectorLayer.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg) {
  if (!this.replayGroup_) {
    return undefined;
  } else {
    var resolution = frameState.viewState.resolution;
    var rotation = frameState.viewState.rotation;
    var layer = this.getLayer();
    var features = {};
    return this.replayGroup_.forEachFeatureAtCoordinate(coordinate, resolution, rotation, {}, function(feature) {
      var key = ol.getUid(feature).toString();
      if (!(key in features)) {
        features[key] = true;
        return callback.call(thisArg, feature, layer);
      }
    });
  }
};
ol.renderer.canvas.VectorLayer.prototype.handleStyleImageChange_ = function(event) {
  this.renderIfReadyAndVisible();
};
ol.renderer.canvas.VectorLayer.prototype.prepareFrame = function(frameState, layerState) {
  var vectorLayer = (this.getLayer());
  var vectorSource = vectorLayer.getSource();
  this.updateAttributions(frameState.attributions, vectorSource.getAttributions());
  this.updateLogos(frameState, vectorSource);
  var animating = frameState.viewHints[ol.View.Hint.ANIMATING];
  var interacting = frameState.viewHints[ol.View.Hint.INTERACTING];
  var updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
  var updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();
  if (!this.dirty_ && (!updateWhileAnimating && animating) || !updateWhileInteracting && interacting) {
    return true;
  }
  var frameStateExtent = frameState.extent;
  var viewState = frameState.viewState;
  var projection = viewState.projection;
  var resolution = viewState.resolution;
  var pixelRatio = frameState.pixelRatio;
  var vectorLayerRevision = vectorLayer.getRevision();
  var vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
  var vectorLayerRenderOrder = vectorLayer.getRenderOrder();
  if (vectorLayerRenderOrder === undefined) {
    vectorLayerRenderOrder = ol.renderer.vector.defaultOrder;
  }
  var extent = ol.extent.buffer(frameStateExtent, vectorLayerRenderBuffer * resolution);
  var projectionExtent = viewState.projection.getExtent();
  if (vectorSource.getWrapX() && viewState.projection.canWrapX() && !ol.extent.containsExtent(projectionExtent, frameState.extent)) {
    var worldWidth = ol.extent.getWidth(projectionExtent);
    var buffer = Math.max(ol.extent.getWidth(extent) / 2, worldWidth);
    extent[0] = projectionExtent[0] - buffer;
    extent[2] = projectionExtent[2] + buffer;
  }
  if (!this.dirty_ && this.renderedResolution_ == resolution && this.renderedRevision_ == vectorLayerRevision && this.renderedRenderOrder_ == vectorLayerRenderOrder && ol.extent.containsExtent(this.renderedExtent_, extent)) {
    return true;
  }
  this.replayGroup_ = null;
  this.dirty_ = false;
  var replayGroup = new ol.render.canvas.ReplayGroup(ol.renderer.vector.getTolerance(resolution, pixelRatio), extent, resolution, vectorSource.getOverlaps(), vectorLayer.getRenderBuffer());
  vectorSource.loadFeatures(extent, resolution, projection);
  var renderFeature = function(feature) {
    var styles;
    var styleFunction = feature.getStyleFunction();
    if (styleFunction) {
      styles = styleFunction.call(feature, resolution);
    } else {
      styleFunction = vectorLayer.getStyleFunction();
      if (styleFunction) {
        styles = styleFunction(feature, resolution);
      }
    }
    if (styles) {
      var dirty = this.renderFeature(feature, resolution, pixelRatio, styles, replayGroup);
      this.dirty_ = this.dirty_ || dirty;
    }
  };
  if (vectorLayerRenderOrder) {
    var features = [];
    vectorSource.forEachFeatureInExtent(extent, function(feature) {
      features.push(feature);
    }, this);
    features.sort(vectorLayerRenderOrder);
    features.forEach(renderFeature, this);
  } else {
    vectorSource.forEachFeatureInExtent(extent, renderFeature, this);
  }
  replayGroup.finish();
  this.renderedResolution_ = resolution;
  this.renderedRevision_ = vectorLayerRevision;
  this.renderedRenderOrder_ = vectorLayerRenderOrder;
  this.renderedExtent_ = extent;
  this.replayGroup_ = replayGroup;
  return true;
};
ol.renderer.canvas.VectorLayer.prototype.renderFeature = function(feature, resolution, pixelRatio, styles, replayGroup) {
  if (!styles) {
    return false;
  }
  var loading = false;
  if (Array.isArray(styles)) {
    for (var i = 0, ii = styles.length;i < ii;++i) {
      loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles[i], ol.renderer.vector.getSquaredTolerance(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
    }
  } else {
    loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles, ol.renderer.vector.getSquaredTolerance(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
  }
  return loading;
};
goog.provide("ol.renderer.canvas.VectorTileLayer");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.proj");
goog.require("ol.proj.Units");
goog.require("ol.layer.VectorTile");
goog.require("ol.render.Event");
goog.require("ol.render.ReplayType");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.ReplayGroup");
goog.require("ol.render.replay");
goog.require("ol.renderer.canvas.TileLayer");
goog.require("ol.renderer.vector");
goog.require("ol.size");
goog.require("ol.transform");
ol.renderer.canvas.VectorTileLayer = function(layer) {
  ol.renderer.canvas.TileLayer.call(this, layer);
  this.dirty_ = false;
  this.tmpTransform_ = ol.transform.create();
  this.zDirection = layer.getRenderMode() == ol.layer.VectorTile.RenderType.VECTOR ? 1 : 0;
};
ol.inherits(ol.renderer.canvas.VectorTileLayer, ol.renderer.canvas.TileLayer);
ol.renderer.canvas.VectorTileLayer.IMAGE_REPLAYS = {"image":ol.render.replay.ORDER, "hybrid":[ol.render.ReplayType.POLYGON, ol.render.ReplayType.LINE_STRING]};
ol.renderer.canvas.VectorTileLayer.VECTOR_REPLAYS = {"hybrid":[ol.render.ReplayType.IMAGE, ol.render.ReplayType.TEXT], "vector":ol.render.replay.ORDER};
ol.renderer.canvas.VectorTileLayer.prototype.composeFrame = function(frameState, layerState, context) {
  var transform = this.getTransform(frameState, 0);
  this.dispatchPreComposeEvent(context, frameState, transform);
  var extent = layerState.extent;
  var clipped = extent !== undefined;
  if (clipped) {
    this.clip(context, frameState, (extent));
  }
  var renderMode = this.getLayer().getRenderMode();
  if (renderMode !== ol.layer.VectorTile.RenderType.VECTOR) {
    this.renderTileImages(context, frameState, layerState);
  }
  if (renderMode !== ol.layer.VectorTile.RenderType.IMAGE) {
    this.renderTileReplays_(context, frameState, layerState);
  }
  if (clipped) {
    context.restore();
  }
  this.dispatchPostComposeEvent(context, frameState, transform);
};
ol.renderer.canvas.VectorTileLayer.prototype.renderTileReplays_ = function(context, frameState, layerState) {
  var layer = this.getLayer();
  var replays = ol.renderer.canvas.VectorTileLayer.VECTOR_REPLAYS[layer.getRenderMode()];
  var pixelRatio = frameState.pixelRatio;
  var skippedFeatureUids = layerState.managed ? frameState.skippedFeatureUids : {};
  var viewState = frameState.viewState;
  var center = viewState.center;
  var resolution = viewState.resolution;
  var rotation = viewState.rotation;
  var size = frameState.size;
  var pixelScale = pixelRatio / resolution;
  var source = (layer.getSource());
  var tilePixelRatio = source.getTilePixelRatio();
  var transform = this.getTransform(frameState, 0);
  var replayContext;
  if (layer.hasListener(ol.render.Event.Type.RENDER)) {
    this.context.canvas.width = context.canvas.width;
    this.context.canvas.height = context.canvas.height;
    replayContext = this.context;
  } else {
    replayContext = context;
  }
  var alpha = replayContext.globalAlpha;
  replayContext.globalAlpha = layerState.opacity;
  var tilesToDraw = this.renderedTiles;
  var tileGrid = source.getTileGrid();
  var currentZ, i, ii, offsetX, offsetY, origin, pixelSpace, replayState;
  var tile, tileExtent, tilePixelResolution, tileResolution, tileTransform;
  for (i = 0, ii = tilesToDraw.length;i < ii;++i) {
    tile = tilesToDraw[i];
    replayState = tile.getReplayState();
    tileExtent = tileGrid.getTileCoordExtent(tile.getTileCoord(), this.tmpExtent);
    currentZ = tile.getTileCoord()[0];
    pixelSpace = tile.getProjection().getUnits() == ol.proj.Units.TILE_PIXELS;
    tileResolution = tileGrid.getResolution(currentZ);
    tilePixelResolution = tileResolution / tilePixelRatio;
    offsetX = Math.round(pixelRatio * size[0] / 2);
    offsetY = Math.round(pixelRatio * size[1] / 2);
    if (pixelSpace) {
      origin = ol.extent.getTopLeft(tileExtent);
      tileTransform = ol.transform.reset(this.tmpTransform_);
      tileTransform = ol.transform.compose(this.tmpTransform_, offsetX, offsetY, pixelScale * tilePixelResolution, pixelScale * tilePixelResolution, rotation, (origin[0] - center[0]) / tilePixelResolution, (center[1] - origin[1]) / tilePixelResolution);
    } else {
      tileTransform = transform;
    }
    ol.render.canvas.rotateAtOffset(replayContext, -rotation, offsetX, offsetY);
    replayState.replayGroup.replay(replayContext, pixelRatio, tileTransform, rotation, skippedFeatureUids, replays);
    ol.render.canvas.rotateAtOffset(replayContext, rotation, offsetX, offsetY);
  }
  if (replayContext != context) {
    this.dispatchRenderEvent(replayContext, frameState, transform);
    context.drawImage(replayContext.canvas, 0, 0);
  }
  replayContext.globalAlpha = alpha;
};
ol.renderer.canvas.VectorTileLayer.prototype.createReplayGroup = function(tile, frameState) {
  var layer = this.getLayer();
  var pixelRatio = frameState.pixelRatio;
  var projection = frameState.viewState.projection;
  var revision = layer.getRevision();
  var renderOrder = layer.getRenderOrder() || null;
  var replayState = tile.getReplayState();
  if (!replayState.dirty && replayState.renderedRevision == revision && replayState.renderedRenderOrder == renderOrder) {
    return;
  }
  replayState.replayGroup = null;
  replayState.dirty = false;
  var source = (layer.getSource());
  var tileGrid = source.getTileGrid();
  var tileCoord = tile.getTileCoord();
  var tileProjection = tile.getProjection();
  var pixelSpace = tileProjection.getUnits() == ol.proj.Units.TILE_PIXELS;
  var resolution = tileGrid.getResolution(tileCoord[0]);
  var extent, reproject, tileResolution;
  if (pixelSpace) {
    var tilePixelRatio = tileResolution = source.getTilePixelRatio();
    var tileSize = ol.size.toSize(tileGrid.getTileSize(tileCoord[0]));
    extent = [0, 0, tileSize[0] * tilePixelRatio, tileSize[1] * tilePixelRatio];
  } else {
    tileResolution = resolution;
    extent = tileGrid.getTileCoordExtent(tileCoord);
    if (!ol.proj.equivalent(projection, tileProjection)) {
      reproject = true;
      tile.setProjection(projection);
    }
  }
  replayState.dirty = false;
  var replayGroup = new ol.render.canvas.ReplayGroup(0, extent, tileResolution, source.getOverlaps(), layer.getRenderBuffer());
  var squaredTolerance = ol.renderer.vector.getSquaredTolerance(tileResolution, pixelRatio);
  function renderFeature(feature) {
    var styles;
    var styleFunction = feature.getStyleFunction();
    if (styleFunction) {
      styles = styleFunction.call((feature), resolution);
    } else {
      styleFunction = layer.getStyleFunction();
      if (styleFunction) {
        styles = styleFunction(feature, resolution);
      }
    }
    if (styles) {
      if (!Array.isArray(styles)) {
        styles = [styles];
      }
      var dirty = this.renderFeature(feature, squaredTolerance, styles, replayGroup);
      this.dirty_ = this.dirty_ || dirty;
      replayState.dirty = replayState.dirty || dirty;
    }
  }
  var features = tile.getFeatures();
  if (renderOrder && renderOrder !== replayState.renderedRenderOrder) {
    features.sort(renderOrder);
  }
  var feature;
  for (var i = 0, ii = features.length;i < ii;++i) {
    feature = features[i];
    if (reproject) {
      feature.getGeometry().transform(tileProjection, projection);
    }
    renderFeature.call(this, feature);
  }
  replayGroup.finish();
  replayState.renderedRevision = revision;
  replayState.renderedRenderOrder = renderOrder;
  replayState.replayGroup = replayGroup;
  replayState.resolution = NaN;
};
ol.renderer.canvas.VectorTileLayer.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg) {
  var resolution = frameState.viewState.resolution;
  var rotation = frameState.viewState.rotation;
  var layer = this.getLayer();
  var features = {};
  var replayables = this.renderedTiles;
  var source = (layer.getSource());
  var tileGrid = source.getTileGrid();
  var found, tileSpaceCoordinate;
  var i, ii, origin, replayGroup;
  var tile, tileCoord, tileExtent, tilePixelRatio, tileResolution;
  for (i = 0, ii = replayables.length;i < ii;++i) {
    tile = replayables[i];
    tileCoord = tile.getTileCoord();
    tileExtent = source.getTileGrid().getTileCoordExtent(tileCoord, this.tmpExtent);
    if (!ol.extent.containsCoordinate(tileExtent, coordinate)) {
      continue;
    }
    if (tile.getProjection().getUnits() === ol.proj.Units.TILE_PIXELS) {
      origin = ol.extent.getTopLeft(tileExtent);
      tilePixelRatio = source.getTilePixelRatio();
      tileResolution = tileGrid.getResolution(tileCoord[0]) / tilePixelRatio;
      tileSpaceCoordinate = [(coordinate[0] - origin[0]) / tileResolution, (origin[1] - coordinate[1]) / tileResolution];
      resolution = tilePixelRatio;
    } else {
      tileSpaceCoordinate = coordinate;
    }
    replayGroup = tile.getReplayState().replayGroup;
    found = found || replayGroup.forEachFeatureAtCoordinate(tileSpaceCoordinate, resolution, rotation, {}, function(feature) {
      var key = ol.getUid(feature).toString();
      if (!(key in features)) {
        features[key] = true;
        return callback.call(thisArg, feature, layer);
      }
    });
  }
  return found;
};
ol.renderer.canvas.VectorTileLayer.prototype.handleStyleImageChange_ = function(event) {
  this.renderIfReadyAndVisible();
};
ol.renderer.canvas.VectorTileLayer.prototype.prepareFrame = function(frameState, layerState) {
  var prepared = ol.renderer.canvas.TileLayer.prototype.prepareFrame.call(this, frameState, layerState);
  if (prepared) {
    var skippedFeatures = Object.keys(frameState.skippedFeatureUids_ || {});
    for (var i = 0, ii = this.renderedTiles.length;i < ii;++i) {
      var tile = (this.renderedTiles[i]);
      this.createReplayGroup(tile, frameState);
      this.renderTileImage_(tile, frameState, layerState, skippedFeatures);
    }
  }
  return prepared;
};
ol.renderer.canvas.VectorTileLayer.prototype.renderFeature = function(feature, squaredTolerance, styles, replayGroup) {
  if (!styles) {
    return false;
  }
  var loading = false;
  if (Array.isArray(styles)) {
    for (var i = 0, ii = styles.length;i < ii;++i) {
      loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles[i], squaredTolerance, this.handleStyleImageChange_, this) || loading;
    }
  } else {
    loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles, squaredTolerance, this.handleStyleImageChange_, this) || loading;
  }
  return loading;
};
ol.renderer.canvas.VectorTileLayer.prototype.renderTileImage_ = function(tile, frameState, layerState, skippedFeatures) {
  var layer = this.getLayer();
  var replays = ol.renderer.canvas.VectorTileLayer.IMAGE_REPLAYS[layer.getRenderMode()];
  if (!replays) {
    return;
  }
  var pixelRatio = frameState.pixelRatio;
  var replayState = tile.getReplayState();
  var revision = layer.getRevision();
  if (!ol.array.equals(replayState.skippedFeatures, skippedFeatures) || replayState.renderedTileRevision !== revision) {
    replayState.skippedFeatures = skippedFeatures;
    replayState.renderedTileRevision = revision;
    var tileContext = tile.getContext();
    var source = layer.getSource();
    var tileGrid = source.getTileGrid();
    var currentZ = tile.getTileCoord()[0];
    var resolution = tileGrid.getResolution(currentZ);
    var tileSize = ol.size.toSize(tileGrid.getTileSize(currentZ));
    var tileResolution = tileGrid.getResolution(currentZ);
    var resolutionRatio = tileResolution / resolution;
    var width = tileSize[0] * pixelRatio * resolutionRatio;
    var height = tileSize[1] * pixelRatio * resolutionRatio;
    tileContext.canvas.width = width / resolutionRatio + .5;
    tileContext.canvas.height = height / resolutionRatio + .5;
    tileContext.scale(1 / resolutionRatio, 1 / resolutionRatio);
    tileContext.translate(width / 2, height / 2);
    var pixelSpace = tile.getProjection().getUnits() == ol.proj.Units.TILE_PIXELS;
    var pixelScale = pixelRatio / resolution;
    var tilePixelRatio = source.getTilePixelRatio();
    var tilePixelResolution = tileResolution / tilePixelRatio;
    var tileExtent = tileGrid.getTileCoordExtent(tile.getTileCoord(), this.tmpExtent);
    var tileTransform = ol.transform.reset(this.tmpTransform_);
    if (pixelSpace) {
      ol.transform.scale(tileTransform, pixelScale * tilePixelResolution, pixelScale * tilePixelResolution);
      ol.transform.translate(tileTransform, -tileSize[0] * tilePixelRatio / 2, -tileSize[1] * tilePixelRatio / 2);
    } else {
      var tileCenter = ol.extent.getCenter(tileExtent);
      ol.transform.scale(tileTransform, pixelScale, -pixelScale);
      ol.transform.translate(tileTransform, -tileCenter[0], -tileCenter[1]);
    }
    replayState.replayGroup.replay(tileContext, pixelRatio, tileTransform, 0, frameState.skippedFeatureUids || {}, replays);
  }
};
goog.provide("ol.renderer.canvas.Map");
goog.require("ol.transform");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.css");
goog.require("ol.dom");
goog.require("ol.layer.Image");
goog.require("ol.layer.Layer");
goog.require("ol.layer.Tile");
goog.require("ol.layer.Vector");
goog.require("ol.layer.VectorTile");
goog.require("ol.render.Event");
goog.require("ol.render.canvas");
goog.require("ol.render.canvas.Immediate");
goog.require("ol.renderer.Map");
goog.require("ol.renderer.Type");
goog.require("ol.renderer.canvas.ImageLayer");
goog.require("ol.renderer.canvas.TileLayer");
goog.require("ol.renderer.canvas.VectorLayer");
goog.require("ol.renderer.canvas.VectorTileLayer");
goog.require("ol.source.State");
ol.renderer.canvas.Map = function(container, map) {
  ol.renderer.Map.call(this, container, map);
  this.context_ = ol.dom.createCanvasContext2D();
  this.canvas_ = this.context_.canvas;
  this.canvas_.style.width = "100%";
  this.canvas_.style.height = "100%";
  this.canvas_.className = ol.css.CLASS_UNSELECTABLE;
  container.insertBefore(this.canvas_, container.childNodes[0] || null);
  this.renderedVisible_ = true;
  this.transform_ = ol.transform.create();
};
ol.inherits(ol.renderer.canvas.Map, ol.renderer.Map);
ol.renderer.canvas.Map.prototype.createLayerRenderer = function(layer) {
  if (ol.ENABLE_IMAGE && layer instanceof ol.layer.Image) {
    return new ol.renderer.canvas.ImageLayer(layer);
  } else {
    if (ol.ENABLE_TILE && layer instanceof ol.layer.Tile) {
      return new ol.renderer.canvas.TileLayer(layer);
    } else {
      if (ol.ENABLE_VECTOR_TILE && layer instanceof ol.layer.VectorTile) {
        return new ol.renderer.canvas.VectorTileLayer(layer);
      } else {
        if (ol.ENABLE_VECTOR && layer instanceof ol.layer.Vector) {
          return new ol.renderer.canvas.VectorLayer(layer);
        } else {
          ol.DEBUG && console.assert(false, "unexpected layer configuration");
          return null;
        }
      }
    }
  }
};
ol.renderer.canvas.Map.prototype.dispatchComposeEvent_ = function(type, frameState) {
  var map = this.getMap();
  var context = this.context_;
  if (map.hasListener(type)) {
    var extent = frameState.extent;
    var pixelRatio = frameState.pixelRatio;
    var viewState = frameState.viewState;
    var rotation = viewState.rotation;
    var transform = this.getTransform(frameState);
    var vectorContext = new ol.render.canvas.Immediate(context, pixelRatio, extent, transform, rotation);
    var composeEvent = new ol.render.Event(type, vectorContext, frameState, context, null);
    map.dispatchEvent(composeEvent);
  }
};
ol.renderer.canvas.Map.prototype.getTransform = function(frameState) {
  var viewState = frameState.viewState;
  var dx1 = this.canvas_.width / 2;
  var dy1 = this.canvas_.height / 2;
  var sx = frameState.pixelRatio / viewState.resolution;
  var sy = -sx;
  var angle = -viewState.rotation;
  var dx2 = -viewState.center[0];
  var dy2 = -viewState.center[1];
  return ol.transform.compose(this.transform_, dx1, dy1, sx, sy, angle, dx2, dy2);
};
ol.renderer.canvas.Map.prototype.getType = function() {
  return ol.renderer.Type.CANVAS;
};
ol.renderer.canvas.Map.prototype.renderFrame = function(frameState) {
  if (!frameState) {
    if (this.renderedVisible_) {
      this.canvas_.style.display = "none";
      this.renderedVisible_ = false;
    }
    return;
  }
  var context = this.context_;
  var pixelRatio = frameState.pixelRatio;
  var width = Math.round(frameState.size[0] * pixelRatio);
  var height = Math.round(frameState.size[1] * pixelRatio);
  if (this.canvas_.width != width || this.canvas_.height != height) {
    this.canvas_.width = width;
    this.canvas_.height = height;
  } else {
    context.clearRect(0, 0, width, height);
  }
  var rotation = frameState.viewState.rotation;
  this.calculateMatrices2D(frameState);
  this.dispatchComposeEvent_(ol.render.Event.Type.PRECOMPOSE, frameState);
  var layerStatesArray = frameState.layerStatesArray;
  ol.array.stableSort(layerStatesArray, ol.renderer.Map.sortByZIndex);
  ol.render.canvas.rotateAtOffset(context, rotation, width / 2, height / 2);
  var viewResolution = frameState.viewState.resolution;
  var i, ii, layer, layerRenderer, layerState;
  for (i = 0, ii = layerStatesArray.length;i < ii;++i) {
    layerState = layerStatesArray[i];
    layer = layerState.layer;
    layerRenderer = (this.getLayerRenderer(layer));
    if (!ol.layer.Layer.visibleAtResolution(layerState, viewResolution) || layerState.sourceState != ol.source.State.READY) {
      continue;
    }
    if (layerRenderer.prepareFrame(frameState, layerState)) {
      layerRenderer.composeFrame(frameState, layerState, context);
    }
  }
  ol.render.canvas.rotateAtOffset(context, -rotation, width / 2, height / 2);
  this.dispatchComposeEvent_(ol.render.Event.Type.POSTCOMPOSE, frameState);
  if (!this.renderedVisible_) {
    this.canvas_.style.display = "";
    this.renderedVisible_ = true;
  }
  this.scheduleRemoveUnusedLayerRenderers(frameState);
  this.scheduleExpireIconCache(frameState);
};
goog.provide("ol.webgl.Shader");
goog.require("ol.functions");
goog.require("ol.webgl");
ol.webgl.Shader = function(source) {
  this.source_ = source;
};
ol.webgl.Shader.prototype.getType = function() {
};
ol.webgl.Shader.prototype.getSource = function() {
  return this.source_;
};
ol.webgl.Shader.prototype.isAnimated = ol.functions.FALSE;
goog.provide("ol.webgl.Fragment");
goog.require("ol");
goog.require("ol.webgl");
goog.require("ol.webgl.Shader");
ol.webgl.Fragment = function(source) {
  ol.webgl.Shader.call(this, source);
};
ol.inherits(ol.webgl.Fragment, ol.webgl.Shader);
ol.webgl.Fragment.prototype.getType = function() {
  return ol.webgl.FRAGMENT_SHADER;
};
goog.provide("ol.webgl.Vertex");
goog.require("ol");
goog.require("ol.webgl");
goog.require("ol.webgl.Shader");
ol.webgl.Vertex = function(source) {
  ol.webgl.Shader.call(this, source);
};
ol.inherits(ol.webgl.Vertex, ol.webgl.Shader);
ol.webgl.Vertex.prototype.getType = function() {
  return ol.webgl.VERTEX_SHADER;
};
goog.provide("ol.render.webgl.imagereplay.defaultshader");
goog.require("ol");
goog.require("ol.webgl.Fragment");
goog.require("ol.webgl.Vertex");
ol.render.webgl.imagereplay.defaultshader.Fragment = function() {
  ol.webgl.Fragment.call(this, ol.render.webgl.imagereplay.defaultshader.Fragment.SOURCE);
};
ol.inherits(ol.render.webgl.imagereplay.defaultshader.Fragment, ol.webgl.Fragment);
ol.render.webgl.imagereplay.defaultshader.Fragment.DEBUG_SOURCE = "precision mediump float;\nvarying vec2 v_texCoord;\nvarying float v_opacity;\n\nuniform float u_opacity;\nuniform sampler2D u_image;\n\nvoid main(void) {\n  vec4 texColor = texture2D(u_image, v_texCoord);\n  gl_FragColor.rgb = texColor.rgb;\n  float alpha = texColor.a * v_opacity * u_opacity;\n  if (alpha == 0.0) {\n    discard;\n  }\n  gl_FragColor.a = alpha;\n}\n";
ol.render.webgl.imagereplay.defaultshader.Fragment.OPTIMIZED_SOURCE = "precision mediump float;varying vec2 a;varying float b;uniform float k;uniform sampler2D l;void main(void){vec4 texColor=texture2D(l,a);gl_FragColor.rgb=texColor.rgb;float alpha=texColor.a*b*k;if(alpha==0.0){discard;}gl_FragColor.a=alpha;}";
ol.render.webgl.imagereplay.defaultshader.Fragment.SOURCE = ol.DEBUG ? ol.render.webgl.imagereplay.defaultshader.Fragment.DEBUG_SOURCE : ol.render.webgl.imagereplay.defaultshader.Fragment.OPTIMIZED_SOURCE;
ol.render.webgl.imagereplay.defaultshader.fragment = new ol.render.webgl.imagereplay.defaultshader.Fragment;
ol.render.webgl.imagereplay.defaultshader.Vertex = function() {
  ol.webgl.Vertex.call(this, ol.render.webgl.imagereplay.defaultshader.Vertex.SOURCE);
};
ol.inherits(ol.render.webgl.imagereplay.defaultshader.Vertex, ol.webgl.Vertex);
ol.render.webgl.imagereplay.defaultshader.Vertex.DEBUG_SOURCE = "varying vec2 v_texCoord;\nvarying float v_opacity;\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nattribute vec2 a_offsets;\nattribute float a_opacity;\nattribute float a_rotateWithView;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\n\nvoid main(void) {\n  mat4 offsetMatrix = u_offsetScaleMatrix;\n  if (a_rotateWithView == 1.0) {\n    offsetMatrix = u_offsetScaleMatrix * u_offsetRotateMatrix;\n  }\n  vec4 offsets = offsetMatrix * vec4(a_offsets, 0., 0.);\n  gl_Position = u_projectionMatrix * vec4(a_position, 0., 1.) + offsets;\n  v_texCoord = a_texCoord;\n  v_opacity = a_opacity;\n}\n\n\n";
ol.render.webgl.imagereplay.defaultshader.Vertex.OPTIMIZED_SOURCE = "varying vec2 a;varying float b;attribute vec2 c;attribute vec2 d;attribute vec2 e;attribute float f;attribute float g;uniform mat4 h;uniform mat4 i;uniform mat4 j;void main(void){mat4 offsetMatrix=i;if(g==1.0){offsetMatrix=i*j;}vec4 offsets=offsetMatrix*vec4(e,0.,0.);gl_Position=h*vec4(c,0.,1.)+offsets;a=d;b=f;}";
ol.render.webgl.imagereplay.defaultshader.Vertex.SOURCE = ol.DEBUG ? ol.render.webgl.imagereplay.defaultshader.Vertex.DEBUG_SOURCE : ol.render.webgl.imagereplay.defaultshader.Vertex.OPTIMIZED_SOURCE;
ol.render.webgl.imagereplay.defaultshader.vertex = new ol.render.webgl.imagereplay.defaultshader.Vertex;
ol.render.webgl.imagereplay.defaultshader.Locations = function(gl, program) {
  this.u_image = gl.getUniformLocation(program, ol.DEBUG ? "u_image" : "l");
  this.u_offsetRotateMatrix = gl.getUniformLocation(program, ol.DEBUG ? "u_offsetRotateMatrix" : "j");
  this.u_offsetScaleMatrix = gl.getUniformLocation(program, ol.DEBUG ? "u_offsetScaleMatrix" : "i");
  this.u_opacity = gl.getUniformLocation(program, ol.DEBUG ? "u_opacity" : "k");
  this.u_projectionMatrix = gl.getUniformLocation(program, ol.DEBUG ? "u_projectionMatrix" : "h");
  this.a_offsets = gl.getAttribLocation(program, ol.DEBUG ? "a_offsets" : "e");
  this.a_opacity = gl.getAttribLocation(program, ol.DEBUG ? "a_opacity" : "f");
  this.a_position = gl.getAttribLocation(program, ol.DEBUG ? "a_position" : "c");
  this.a_rotateWithView = gl.getAttribLocation(program, ol.DEBUG ? "a_rotateWithView" : "g");
  this.a_texCoord = gl.getAttribLocation(program, ol.DEBUG ? "a_texCoord" : "d");
};
goog.provide("ol.vec.Mat4");
ol.vec.Mat4.create = function() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};
ol.vec.Mat4.fromTransform = function(mat4, transform) {
  mat4[0] = transform[0];
  mat4[1] = transform[1];
  mat4[4] = transform[2];
  mat4[5] = transform[3];
  mat4[12] = transform[4];
  mat4[13] = transform[5];
  return mat4;
};
goog.provide("ol.webgl.Buffer");
goog.require("ol");
goog.require("ol.webgl");
ol.webgl.Buffer = function(opt_arr, opt_usage) {
  this.arr_ = opt_arr !== undefined ? opt_arr : [];
  this.usage_ = opt_usage !== undefined ? opt_usage : ol.webgl.Buffer.Usage.STATIC_DRAW;
};
ol.webgl.Buffer.prototype.getArray = function() {
  return this.arr_;
};
ol.webgl.Buffer.prototype.getUsage = function() {
  return this.usage_;
};
ol.webgl.Buffer.Usage = {STATIC_DRAW:ol.webgl.STATIC_DRAW, STREAM_DRAW:ol.webgl.STREAM_DRAW, DYNAMIC_DRAW:ol.webgl.DYNAMIC_DRAW};
goog.provide("ol.webgl.ContextEventType");
ol.webgl.ContextEventType = {LOST:"webglcontextlost", RESTORED:"webglcontextrestored"};
goog.provide("ol.webgl.Context");
goog.require("ol");
goog.require("ol.Disposable");
goog.require("ol.array");
goog.require("ol.events");
goog.require("ol.obj");
goog.require("ol.webgl");
goog.require("ol.webgl.ContextEventType");
ol.webgl.Context = function(canvas, gl) {
  this.canvas_ = canvas;
  this.gl_ = gl;
  this.bufferCache_ = {};
  this.shaderCache_ = {};
  this.programCache_ = {};
  this.currentProgram_ = null;
  this.hitDetectionFramebuffer_ = null;
  this.hitDetectionTexture_ = null;
  this.hitDetectionRenderbuffer_ = null;
  this.hasOESElementIndexUint = ol.array.includes(ol.WEBGL_EXTENSIONS, "OES_element_index_uint");
  if (this.hasOESElementIndexUint) {
    var ext = gl.getExtension("OES_element_index_uint");
    ol.DEBUG && console.assert(ext, 'Failed to get extension "OES_element_index_uint"');
  }
  ol.events.listen(this.canvas_, ol.webgl.ContextEventType.LOST, this.handleWebGLContextLost, this);
  ol.events.listen(this.canvas_, ol.webgl.ContextEventType.RESTORED, this.handleWebGLContextRestored, this);
};
ol.inherits(ol.webgl.Context, ol.Disposable);
ol.webgl.Context.prototype.bindBuffer = function(target, buf) {
  var gl = this.getGL();
  var arr = buf.getArray();
  var bufferKey = String(ol.getUid(buf));
  if (bufferKey in this.bufferCache_) {
    var bufferCacheEntry = this.bufferCache_[bufferKey];
    gl.bindBuffer(target, bufferCacheEntry.buffer);
  } else {
    var buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    ol.DEBUG && console.assert(target == ol.webgl.ARRAY_BUFFER || target == ol.webgl.ELEMENT_ARRAY_BUFFER, "target is supposed to be an ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER");
    var arrayBuffer;
    if (target == ol.webgl.ARRAY_BUFFER) {
      arrayBuffer = new Float32Array(arr);
    } else {
      if (target == ol.webgl.ELEMENT_ARRAY_BUFFER) {
        arrayBuffer = this.hasOESElementIndexUint ? new Uint32Array(arr) : new Uint16Array(arr);
      }
    }
    gl.bufferData(target, arrayBuffer, buf.getUsage());
    this.bufferCache_[bufferKey] = {buf:buf, buffer:buffer};
  }
};
ol.webgl.Context.prototype.deleteBuffer = function(buf) {
  var gl = this.getGL();
  var bufferKey = String(ol.getUid(buf));
  ol.DEBUG && console.assert(bufferKey in this.bufferCache_, "attempted to delete uncached buffer");
  var bufferCacheEntry = this.bufferCache_[bufferKey];
  if (!gl.isContextLost()) {
    gl.deleteBuffer(bufferCacheEntry.buffer);
  }
  delete this.bufferCache_[bufferKey];
};
ol.webgl.Context.prototype.disposeInternal = function() {
  ol.events.unlistenAll(this.canvas_);
  var gl = this.getGL();
  if (!gl.isContextLost()) {
    var key;
    for (key in this.bufferCache_) {
      gl.deleteBuffer(this.bufferCache_[key].buffer);
    }
    for (key in this.programCache_) {
      gl.deleteProgram(this.programCache_[key]);
    }
    for (key in this.shaderCache_) {
      gl.deleteShader(this.shaderCache_[key]);
    }
    gl.deleteFramebuffer(this.hitDetectionFramebuffer_);
    gl.deleteRenderbuffer(this.hitDetectionRenderbuffer_);
    gl.deleteTexture(this.hitDetectionTexture_);
  }
};
ol.webgl.Context.prototype.getCanvas = function() {
  return this.canvas_;
};
ol.webgl.Context.prototype.getGL = function() {
  return this.gl_;
};
ol.webgl.Context.prototype.getHitDetectionFramebuffer = function() {
  if (!this.hitDetectionFramebuffer_) {
    this.initHitDetectionFramebuffer_();
  }
  return this.hitDetectionFramebuffer_;
};
ol.webgl.Context.prototype.getShader = function(shaderObject) {
  var shaderKey = String(ol.getUid(shaderObject));
  if (shaderKey in this.shaderCache_) {
    return this.shaderCache_[shaderKey];
  } else {
    var gl = this.getGL();
    var shader = gl.createShader(shaderObject.getType());
    gl.shaderSource(shader, shaderObject.getSource());
    gl.compileShader(shader);
    ol.DEBUG && console.assert(gl.getShaderParameter(shader, ol.webgl.COMPILE_STATUS) || gl.isContextLost(), gl.getShaderInfoLog(shader) || "illegal state, shader not compiled or context lost");
    this.shaderCache_[shaderKey] = shader;
    return shader;
  }
};
ol.webgl.Context.prototype.getProgram = function(fragmentShaderObject, vertexShaderObject) {
  var programKey = ol.getUid(fragmentShaderObject) + "/" + ol.getUid(vertexShaderObject);
  if (programKey in this.programCache_) {
    return this.programCache_[programKey];
  } else {
    var gl = this.getGL();
    var program = gl.createProgram();
    gl.attachShader(program, this.getShader(fragmentShaderObject));
    gl.attachShader(program, this.getShader(vertexShaderObject));
    gl.linkProgram(program);
    ol.DEBUG && console.assert(gl.getProgramParameter(program, ol.webgl.LINK_STATUS) || gl.isContextLost(), gl.getProgramInfoLog(program) || "illegal state, shader not linked or context lost");
    this.programCache_[programKey] = program;
    return program;
  }
};
ol.webgl.Context.prototype.handleWebGLContextLost = function() {
  ol.obj.clear(this.bufferCache_);
  ol.obj.clear(this.shaderCache_);
  ol.obj.clear(this.programCache_);
  this.currentProgram_ = null;
  this.hitDetectionFramebuffer_ = null;
  this.hitDetectionTexture_ = null;
  this.hitDetectionRenderbuffer_ = null;
};
ol.webgl.Context.prototype.handleWebGLContextRestored = function() {
};
ol.webgl.Context.prototype.initHitDetectionFramebuffer_ = function() {
  var gl = this.gl_;
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  var texture = ol.webgl.Context.createEmptyTexture(gl, 1, 1);
  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1, 1);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  this.hitDetectionFramebuffer_ = framebuffer;
  this.hitDetectionTexture_ = texture;
  this.hitDetectionRenderbuffer_ = renderbuffer;
};
ol.webgl.Context.prototype.useProgram = function(program) {
  if (program == this.currentProgram_) {
    return false;
  } else {
    var gl = this.getGL();
    gl.useProgram(program);
    this.currentProgram_ = program;
    return true;
  }
};
ol.webgl.Context.createTexture_ = function(gl, opt_wrapS, opt_wrapT) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  if (opt_wrapS !== undefined) {
    gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_WRAP_S, opt_wrapS);
  }
  if (opt_wrapT !== undefined) {
    gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_WRAP_T, opt_wrapT);
  }
  return texture;
};
ol.webgl.Context.createEmptyTexture = function(gl, width, height, opt_wrapS, opt_wrapT) {
  var texture = ol.webgl.Context.createTexture_(gl, opt_wrapS, opt_wrapT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return texture;
};
ol.webgl.Context.createTexture = function(gl, image, opt_wrapS, opt_wrapT) {
  var texture = ol.webgl.Context.createTexture_(gl, opt_wrapS, opt_wrapT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return texture;
};
goog.provide("ol.render.webgl.ImageReplay");
goog.provide("ol.render.webgl.ReplayGroup");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.obj");
goog.require("ol.render.ReplayGroup");
goog.require("ol.render.VectorContext");
goog.require("ol.render.replay");
goog.require("ol.render.webgl.imagereplay.defaultshader");
goog.require("ol.transform");
goog.require("ol.vec.Mat4");
goog.require("ol.webgl");
goog.require("ol.webgl.Buffer");
goog.require("ol.webgl.Context");
ol.render.webgl.ImageReplay = function(tolerance, maxExtent) {
  ol.render.VectorContext.call(this);
  this.anchorX_ = undefined;
  this.anchorY_ = undefined;
  this.origin_ = ol.extent.getCenter(maxExtent);
  this.groupIndices_ = [];
  this.hitDetectionGroupIndices_ = [];
  this.height_ = undefined;
  this.images_ = [];
  this.hitDetectionImages_ = [];
  this.imageHeight_ = undefined;
  this.imageWidth_ = undefined;
  this.indices_ = [];
  this.indicesBuffer_ = null;
  this.defaultLocations_ = null;
  this.opacity_ = undefined;
  this.offsetRotateMatrix_ = ol.transform.create();
  this.offsetScaleMatrix_ = ol.transform.create();
  this.originX_ = undefined;
  this.originY_ = undefined;
  this.projectionMatrix_ = ol.transform.create();
  this.tmpMat4_ = ol.vec.Mat4.create();
  this.rotateWithView_ = undefined;
  this.rotation_ = undefined;
  this.scale_ = undefined;
  this.textures_ = [];
  this.hitDetectionTextures_ = [];
  this.vertices_ = [];
  this.verticesBuffer_ = null;
  this.startIndices_ = [];
  this.startIndicesFeature_ = [];
  this.width_ = undefined;
};
ol.inherits(ol.render.webgl.ImageReplay, ol.render.VectorContext);
ol.render.webgl.ImageReplay.prototype.getDeleteResourcesFunction = function(context) {
  ol.DEBUG && console.assert(this.verticesBuffer_, "verticesBuffer must not be null");
  ol.DEBUG && console.assert(this.indicesBuffer_, "indicesBuffer must not be null");
  var verticesBuffer = this.verticesBuffer_;
  var indicesBuffer = this.indicesBuffer_;
  var textures = this.textures_;
  var hitDetectionTextures = this.hitDetectionTextures_;
  var gl = context.getGL();
  return function() {
    if (!gl.isContextLost()) {
      var i, ii;
      for (i = 0, ii = textures.length;i < ii;++i) {
        gl.deleteTexture(textures[i]);
      }
      for (i = 0, ii = hitDetectionTextures.length;i < ii;++i) {
        gl.deleteTexture(hitDetectionTextures[i]);
      }
    }
    context.deleteBuffer(verticesBuffer);
    context.deleteBuffer(indicesBuffer);
  };
};
ol.render.webgl.ImageReplay.prototype.drawCoordinates_ = function(flatCoordinates, offset, end, stride) {
  ol.DEBUG && console.assert(this.anchorX_ !== undefined, "anchorX is defined");
  ol.DEBUG && console.assert(this.anchorY_ !== undefined, "anchorY is defined");
  ol.DEBUG && console.assert(this.height_ !== undefined, "height is defined");
  ol.DEBUG && console.assert(this.imageHeight_ !== undefined, "imageHeight is defined");
  ol.DEBUG && console.assert(this.imageWidth_ !== undefined, "imageWidth is defined");
  ol.DEBUG && console.assert(this.opacity_ !== undefined, "opacity is defined");
  ol.DEBUG && console.assert(this.originX_ !== undefined, "originX is defined");
  ol.DEBUG && console.assert(this.originY_ !== undefined, "originY is defined");
  ol.DEBUG && console.assert(this.rotateWithView_ !== undefined, "rotateWithView is defined");
  ol.DEBUG && console.assert(this.rotation_ !== undefined, "rotation is defined");
  ol.DEBUG && console.assert(this.scale_ !== undefined, "scale is defined");
  ol.DEBUG && console.assert(this.width_ !== undefined, "width is defined");
  var anchorX = (this.anchorX_);
  var anchorY = (this.anchorY_);
  var height = (this.height_);
  var imageHeight = (this.imageHeight_);
  var imageWidth = (this.imageWidth_);
  var opacity = (this.opacity_);
  var originX = (this.originX_);
  var originY = (this.originY_);
  var rotateWithView = this.rotateWithView_ ? 1 : 0;
  var rotation = (this.rotation_);
  var scale = (this.scale_);
  var width = (this.width_);
  var cos = Math.cos(rotation);
  var sin = Math.sin(rotation);
  var numIndices = this.indices_.length;
  var numVertices = this.vertices_.length;
  var i, n, offsetX, offsetY, x, y;
  for (i = offset;i < end;i += stride) {
    x = flatCoordinates[i] - this.origin_[0];
    y = flatCoordinates[i + 1] - this.origin_[1];
    n = numVertices / 8;
    offsetX = -scale * anchorX;
    offsetY = -scale * (height - anchorY);
    this.vertices_[numVertices++] = x;
    this.vertices_[numVertices++] = y;
    this.vertices_[numVertices++] = offsetX * cos - offsetY * sin;
    this.vertices_[numVertices++] = offsetX * sin + offsetY * cos;
    this.vertices_[numVertices++] = originX / imageWidth;
    this.vertices_[numVertices++] = (originY + height) / imageHeight;
    this.vertices_[numVertices++] = opacity;
    this.vertices_[numVertices++] = rotateWithView;
    offsetX = scale * (width - anchorX);
    offsetY = -scale * (height - anchorY);
    this.vertices_[numVertices++] = x;
    this.vertices_[numVertices++] = y;
    this.vertices_[numVertices++] = offsetX * cos - offsetY * sin;
    this.vertices_[numVertices++] = offsetX * sin + offsetY * cos;
    this.vertices_[numVertices++] = (originX + width) / imageWidth;
    this.vertices_[numVertices++] = (originY + height) / imageHeight;
    this.vertices_[numVertices++] = opacity;
    this.vertices_[numVertices++] = rotateWithView;
    offsetX = scale * (width - anchorX);
    offsetY = scale * anchorY;
    this.vertices_[numVertices++] = x;
    this.vertices_[numVertices++] = y;
    this.vertices_[numVertices++] = offsetX * cos - offsetY * sin;
    this.vertices_[numVertices++] = offsetX * sin + offsetY * cos;
    this.vertices_[numVertices++] = (originX + width) / imageWidth;
    this.vertices_[numVertices++] = originY / imageHeight;
    this.vertices_[numVertices++] = opacity;
    this.vertices_[numVertices++] = rotateWithView;
    offsetX = -scale * anchorX;
    offsetY = scale * anchorY;
    this.vertices_[numVertices++] = x;
    this.vertices_[numVertices++] = y;
    this.vertices_[numVertices++] = offsetX * cos - offsetY * sin;
    this.vertices_[numVertices++] = offsetX * sin + offsetY * cos;
    this.vertices_[numVertices++] = originX / imageWidth;
    this.vertices_[numVertices++] = originY / imageHeight;
    this.vertices_[numVertices++] = opacity;
    this.vertices_[numVertices++] = rotateWithView;
    this.indices_[numIndices++] = n;
    this.indices_[numIndices++] = n + 1;
    this.indices_[numIndices++] = n + 2;
    this.indices_[numIndices++] = n;
    this.indices_[numIndices++] = n + 2;
    this.indices_[numIndices++] = n + 3;
  }
  return numVertices;
};
ol.render.webgl.ImageReplay.prototype.drawMultiPoint = function(multiPointGeometry, feature) {
  this.startIndices_.push(this.indices_.length);
  this.startIndicesFeature_.push(feature);
  var flatCoordinates = multiPointGeometry.getFlatCoordinates();
  var stride = multiPointGeometry.getStride();
  this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
};
ol.render.webgl.ImageReplay.prototype.drawPoint = function(pointGeometry, feature) {
  this.startIndices_.push(this.indices_.length);
  this.startIndicesFeature_.push(feature);
  var flatCoordinates = pointGeometry.getFlatCoordinates();
  var stride = pointGeometry.getStride();
  this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
};
ol.render.webgl.ImageReplay.prototype.finish = function(context) {
  var gl = context.getGL();
  this.groupIndices_.push(this.indices_.length);
  ol.DEBUG && console.assert(this.images_.length === this.groupIndices_.length, "number of images and groupIndices match");
  this.hitDetectionGroupIndices_.push(this.indices_.length);
  ol.DEBUG && console.assert(this.hitDetectionImages_.length === this.hitDetectionGroupIndices_.length, "number of hitDetectionImages and hitDetectionGroupIndices match");
  this.verticesBuffer_ = new ol.webgl.Buffer(this.vertices_);
  context.bindBuffer(ol.webgl.ARRAY_BUFFER, this.verticesBuffer_);
  var indices = this.indices_;
  var bits = context.hasOESElementIndexUint ? 32 : 16;
  ol.DEBUG && console.assert(indices[indices.length - 1] < Math.pow(2, bits), 'Too large element index detected [%s] (OES_element_index_uint "%s")', indices[indices.length - 1], context.hasOESElementIndexUint);
  this.indicesBuffer_ = new ol.webgl.Buffer(indices);
  context.bindBuffer(ol.webgl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer_);
  var texturePerImage = {};
  this.createTextures_(this.textures_, this.images_, texturePerImage, gl);
  ol.DEBUG && console.assert(this.textures_.length === this.groupIndices_.length, "number of textures and groupIndices match");
  this.createTextures_(this.hitDetectionTextures_, this.hitDetectionImages_, texturePerImage, gl);
  ol.DEBUG && console.assert(this.hitDetectionTextures_.length === this.hitDetectionGroupIndices_.length, "number of hitDetectionTextures and hitDetectionGroupIndices match");
  this.anchorX_ = undefined;
  this.anchorY_ = undefined;
  this.height_ = undefined;
  this.images_ = null;
  this.hitDetectionImages_ = null;
  this.imageHeight_ = undefined;
  this.imageWidth_ = undefined;
  this.indices_ = null;
  this.opacity_ = undefined;
  this.originX_ = undefined;
  this.originY_ = undefined;
  this.rotateWithView_ = undefined;
  this.rotation_ = undefined;
  this.scale_ = undefined;
  this.vertices_ = null;
  this.width_ = undefined;
};
ol.render.webgl.ImageReplay.prototype.createTextures_ = function(textures, images, texturePerImage, gl) {
  ol.DEBUG && console.assert(textures.length === 0, "upon creation, textures is empty");
  var texture, image, uid, i;
  var ii = images.length;
  for (i = 0;i < ii;++i) {
    image = images[i];
    uid = ol.getUid(image).toString();
    if (uid in texturePerImage) {
      texture = texturePerImage[uid];
    } else {
      texture = ol.webgl.Context.createTexture(gl, image, ol.webgl.CLAMP_TO_EDGE, ol.webgl.CLAMP_TO_EDGE);
      texturePerImage[uid] = texture;
    }
    textures[i] = texture;
  }
};
ol.render.webgl.ImageReplay.prototype.replay = function(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
  var gl = context.getGL();
  ol.DEBUG && console.assert(this.verticesBuffer_, "verticesBuffer must not be null");
  context.bindBuffer(ol.webgl.ARRAY_BUFFER, this.verticesBuffer_);
  ol.DEBUG && console.assert(this.indicesBuffer_, "indecesBuffer must not be null");
  context.bindBuffer(ol.webgl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer_);
  var fragmentShader = ol.render.webgl.imagereplay.defaultshader.fragment;
  var vertexShader = ol.render.webgl.imagereplay.defaultshader.vertex;
  var program = context.getProgram(fragmentShader, vertexShader);
  var locations;
  if (!this.defaultLocations_) {
    locations = new ol.render.webgl.imagereplay.defaultshader.Locations(gl, program);
    this.defaultLocations_ = locations;
  } else {
    locations = this.defaultLocations_;
  }
  context.useProgram(program);
  gl.enableVertexAttribArray(locations.a_position);
  gl.vertexAttribPointer(locations.a_position, 2, ol.webgl.FLOAT, false, 32, 0);
  gl.enableVertexAttribArray(locations.a_offsets);
  gl.vertexAttribPointer(locations.a_offsets, 2, ol.webgl.FLOAT, false, 32, 8);
  gl.enableVertexAttribArray(locations.a_texCoord);
  gl.vertexAttribPointer(locations.a_texCoord, 2, ol.webgl.FLOAT, false, 32, 16);
  gl.enableVertexAttribArray(locations.a_opacity);
  gl.vertexAttribPointer(locations.a_opacity, 1, ol.webgl.FLOAT, false, 32, 24);
  gl.enableVertexAttribArray(locations.a_rotateWithView);
  gl.vertexAttribPointer(locations.a_rotateWithView, 1, ol.webgl.FLOAT, false, 32, 28);
  var projectionMatrix = ol.transform.reset(this.projectionMatrix_);
  ol.transform.scale(projectionMatrix, 2 / (resolution * size[0]), 2 / (resolution * size[1]));
  ol.transform.rotate(projectionMatrix, -rotation);
  ol.transform.translate(projectionMatrix, -(center[0] - this.origin_[0]), -(center[1] - this.origin_[1]));
  var offsetScaleMatrix = ol.transform.reset(this.offsetScaleMatrix_);
  ol.transform.scale(offsetScaleMatrix, 2 / size[0], 2 / size[1]);
  var offsetRotateMatrix = ol.transform.reset(this.offsetRotateMatrix_);
  if (rotation !== 0) {
    ol.transform.rotate(offsetRotateMatrix, -rotation);
  }
  gl.uniformMatrix4fv(locations.u_projectionMatrix, false, ol.vec.Mat4.fromTransform(this.tmpMat4_, projectionMatrix));
  gl.uniformMatrix4fv(locations.u_offsetScaleMatrix, false, ol.vec.Mat4.fromTransform(this.tmpMat4_, offsetScaleMatrix));
  gl.uniformMatrix4fv(locations.u_offsetRotateMatrix, false, ol.vec.Mat4.fromTransform(this.tmpMat4_, offsetRotateMatrix));
  gl.uniform1f(locations.u_opacity, opacity);
  var result;
  if (featureCallback === undefined) {
    this.drawReplay_(gl, context, skippedFeaturesHash, this.textures_, this.groupIndices_);
  } else {
    result = this.drawHitDetectionReplay_(gl, context, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);
  }
  gl.disableVertexAttribArray(locations.a_position);
  gl.disableVertexAttribArray(locations.a_offsets);
  gl.disableVertexAttribArray(locations.a_texCoord);
  gl.disableVertexAttribArray(locations.a_opacity);
  gl.disableVertexAttribArray(locations.a_rotateWithView);
  return result;
};
ol.render.webgl.ImageReplay.prototype.drawReplay_ = function(gl, context, skippedFeaturesHash, textures, groupIndices) {
  ol.DEBUG && console.assert(textures.length === groupIndices.length, "number of textures and groupIndeces match");
  var elementType = context.hasOESElementIndexUint ? ol.webgl.UNSIGNED_INT : ol.webgl.UNSIGNED_SHORT;
  var elementSize = context.hasOESElementIndexUint ? 4 : 2;
  if (!ol.obj.isEmpty(skippedFeaturesHash)) {
    this.drawReplaySkipping_(gl, skippedFeaturesHash, textures, groupIndices, elementType, elementSize);
  } else {
    var i, ii, start;
    for (i = 0, ii = textures.length, start = 0;i < ii;++i) {
      gl.bindTexture(ol.webgl.TEXTURE_2D, textures[i]);
      var end = groupIndices[i];
      this.drawElements_(gl, start, end, elementType, elementSize);
      start = end;
    }
  }
};
ol.render.webgl.ImageReplay.prototype.drawReplaySkipping_ = function(gl, skippedFeaturesHash, textures, groupIndices, elementType, elementSize) {
  var featureIndex = 0;
  var i, ii;
  for (i = 0, ii = textures.length;i < ii;++i) {
    gl.bindTexture(ol.webgl.TEXTURE_2D, textures[i]);
    var groupStart = i > 0 ? groupIndices[i - 1] : 0;
    var groupEnd = groupIndices[i];
    var start = groupStart;
    var end = groupStart;
    while (featureIndex < this.startIndices_.length && this.startIndices_[featureIndex] <= groupEnd) {
      var feature = this.startIndicesFeature_[featureIndex];
      var featureUid = ol.getUid(feature).toString();
      if (skippedFeaturesHash[featureUid] !== undefined) {
        if (start !== end) {
          this.drawElements_(gl, start, end, elementType, elementSize);
        }
        start = featureIndex === this.startIndices_.length - 1 ? groupEnd : this.startIndices_[featureIndex + 1];
        end = start;
      } else {
        end = featureIndex === this.startIndices_.length - 1 ? groupEnd : this.startIndices_[featureIndex + 1];
      }
      featureIndex++;
    }
    if (start !== end) {
      this.drawElements_(gl, start, end, elementType, elementSize);
    }
  }
};
ol.render.webgl.ImageReplay.prototype.drawElements_ = function(gl, start, end, elementType, elementSize) {
  var numItems = end - start;
  var offsetInBytes = start * elementSize;
  gl.drawElements(ol.webgl.TRIANGLES, numItems, elementType, offsetInBytes);
};
ol.render.webgl.ImageReplay.prototype.drawHitDetectionReplay_ = function(gl, context, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
  if (!oneByOne) {
    return this.drawHitDetectionReplayAll_(gl, context, skippedFeaturesHash, featureCallback);
  } else {
    return this.drawHitDetectionReplayOneByOne_(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent);
  }
};
ol.render.webgl.ImageReplay.prototype.drawHitDetectionReplayAll_ = function(gl, context, skippedFeaturesHash, featureCallback) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.drawReplay_(gl, context, skippedFeaturesHash, this.hitDetectionTextures_, this.hitDetectionGroupIndices_);
  var result = featureCallback(null);
  if (result) {
    return result;
  } else {
    return undefined;
  }
};
ol.render.webgl.ImageReplay.prototype.drawHitDetectionReplayOneByOne_ = function(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent) {
  ol.DEBUG && console.assert(this.hitDetectionTextures_.length === this.hitDetectionGroupIndices_.length, "number of hitDetectionTextures and hitDetectionGroupIndices match");
  var elementType = context.hasOESElementIndexUint ? ol.webgl.UNSIGNED_INT : ol.webgl.UNSIGNED_SHORT;
  var elementSize = context.hasOESElementIndexUint ? 4 : 2;
  var i, groupStart, start, end, feature, featureUid;
  var featureIndex = this.startIndices_.length - 1;
  for (i = this.hitDetectionTextures_.length - 1;i >= 0;--i) {
    gl.bindTexture(ol.webgl.TEXTURE_2D, this.hitDetectionTextures_[i]);
    groupStart = i > 0 ? this.hitDetectionGroupIndices_[i - 1] : 0;
    end = this.hitDetectionGroupIndices_[i];
    while (featureIndex >= 0 && this.startIndices_[featureIndex] >= groupStart) {
      start = this.startIndices_[featureIndex];
      feature = this.startIndicesFeature_[featureIndex];
      featureUid = ol.getUid(feature).toString();
      if (skippedFeaturesHash[featureUid] === undefined && feature.getGeometry() && (opt_hitExtent === undefined || ol.extent.intersects((opt_hitExtent), feature.getGeometry().getExtent()))) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.drawElements_(gl, start, end, elementType, elementSize);
        var result = featureCallback(feature);
        if (result) {
          return result;
        }
      }
      end = start;
      featureIndex--;
    }
  }
  return undefined;
};
ol.render.webgl.ImageReplay.prototype.setFillStrokeStyle = function() {
};
ol.render.webgl.ImageReplay.prototype.setImageStyle = function(imageStyle) {
  var anchor = imageStyle.getAnchor();
  var image = imageStyle.getImage(1);
  var imageSize = imageStyle.getImageSize();
  var hitDetectionImage = imageStyle.getHitDetectionImage(1);
  var hitDetectionImageSize = imageStyle.getHitDetectionImageSize();
  var opacity = imageStyle.getOpacity();
  var origin = imageStyle.getOrigin();
  var rotateWithView = imageStyle.getRotateWithView();
  var rotation = imageStyle.getRotation();
  var size = imageStyle.getSize();
  var scale = imageStyle.getScale();
  ol.DEBUG && console.assert(anchor, "imageStyle anchor is not null");
  ol.DEBUG && console.assert(image, "imageStyle image is not null");
  ol.DEBUG && console.assert(imageSize, "imageStyle imageSize is not null");
  ol.DEBUG && console.assert(hitDetectionImage, "imageStyle hitDetectionImage is not null");
  ol.DEBUG && console.assert(hitDetectionImageSize, "imageStyle hitDetectionImageSize is not null");
  ol.DEBUG && console.assert(opacity !== undefined, "imageStyle opacity is defined");
  ol.DEBUG && console.assert(origin, "imageStyle origin is not null");
  ol.DEBUG && console.assert(rotateWithView !== undefined, "imageStyle rotateWithView is defined");
  ol.DEBUG && console.assert(rotation !== undefined, "imageStyle rotation is defined");
  ol.DEBUG && console.assert(size, "imageStyle size is not null");
  ol.DEBUG && console.assert(scale !== undefined, "imageStyle scale is defined");
  var currentImage;
  if (this.images_.length === 0) {
    this.images_.push(image);
  } else {
    currentImage = this.images_[this.images_.length - 1];
    if (ol.getUid(currentImage) != ol.getUid(image)) {
      this.groupIndices_.push(this.indices_.length);
      ol.DEBUG && console.assert(this.groupIndices_.length === this.images_.length, "number of groupIndices and images match");
      this.images_.push(image);
    }
  }
  if (this.hitDetectionImages_.length === 0) {
    this.hitDetectionImages_.push(hitDetectionImage);
  } else {
    currentImage = this.hitDetectionImages_[this.hitDetectionImages_.length - 1];
    if (ol.getUid(currentImage) != ol.getUid(hitDetectionImage)) {
      this.hitDetectionGroupIndices_.push(this.indices_.length);
      ol.DEBUG && console.assert(this.hitDetectionGroupIndices_.length === this.hitDetectionImages_.length, "number of hitDetectionGroupIndices and hitDetectionImages match");
      this.hitDetectionImages_.push(hitDetectionImage);
    }
  }
  this.anchorX_ = anchor[0];
  this.anchorY_ = anchor[1];
  this.height_ = size[1];
  this.imageHeight_ = imageSize[1];
  this.imageWidth_ = imageSize[0];
  this.opacity_ = opacity;
  this.originX_ = origin[0];
  this.originY_ = origin[1];
  this.rotation_ = rotation;
  this.rotateWithView_ = rotateWithView;
  this.scale_ = scale;
  this.width_ = size[0];
};
ol.render.webgl.ReplayGroup = function(tolerance, maxExtent, opt_renderBuffer) {
  ol.render.ReplayGroup.call(this);
  this.maxExtent_ = maxExtent;
  this.tolerance_ = tolerance;
  this.renderBuffer_ = opt_renderBuffer;
  this.replays_ = {};
};
ol.inherits(ol.render.webgl.ReplayGroup, ol.render.ReplayGroup);
ol.render.webgl.ReplayGroup.prototype.getDeleteResourcesFunction = function(context) {
  var functions = [];
  var replayKey;
  for (replayKey in this.replays_) {
    functions.push(this.replays_[replayKey].getDeleteResourcesFunction(context));
  }
  return function() {
    var length = functions.length;
    var result;
    for (var i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
ol.render.webgl.ReplayGroup.prototype.finish = function(context) {
  var replayKey;
  for (replayKey in this.replays_) {
    this.replays_[replayKey].finish(context);
  }
};
ol.render.webgl.ReplayGroup.prototype.getReplay = function(zIndex, replayType) {
  var replay = this.replays_[replayType];
  if (replay === undefined) {
    var constructor = ol.render.webgl.BATCH_CONSTRUCTORS_[replayType];
    replay = new constructor(this.tolerance_, this.maxExtent_);
    this.replays_[replayType] = replay;
  }
  return replay;
};
ol.render.webgl.ReplayGroup.prototype.isEmpty = function() {
  return ol.obj.isEmpty(this.replays_);
};
ol.render.webgl.ReplayGroup.prototype.replay = function(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash) {
  var i, ii, replay;
  for (i = 0, ii = ol.render.replay.ORDER.length;i < ii;++i) {
    replay = this.replays_[ol.render.replay.ORDER[i]];
    if (replay !== undefined) {
      replay.replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, undefined, false);
    }
  }
};
ol.render.webgl.ReplayGroup.prototype.replayHitDetection_ = function(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
  var i, replay, result;
  for (i = ol.render.replay.ORDER.length - 1;i >= 0;--i) {
    replay = this.replays_[ol.render.replay.ORDER[i]];
    if (replay !== undefined) {
      result = replay.replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};
ol.render.webgl.ReplayGroup.prototype.forEachFeatureAtCoordinate = function(coordinate, context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, callback) {
  var gl = context.getGL();
  gl.bindFramebuffer(gl.FRAMEBUFFER, context.getHitDetectionFramebuffer());
  var hitExtent;
  if (this.renderBuffer_ !== undefined) {
    hitExtent = ol.extent.buffer(ol.extent.createOrUpdateFromCoordinate(coordinate), resolution * this.renderBuffer_);
  }
  return this.replayHitDetection_(context, coordinate, resolution, rotation, ol.render.webgl.HIT_DETECTION_SIZE_, pixelRatio, opacity, skippedFeaturesHash, function(feature) {
    var imageData = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    if (imageData[3] > 0) {
      var result = callback(feature);
      if (result) {
        return result;
      }
    }
  }, true, hitExtent);
};
ol.render.webgl.ReplayGroup.prototype.hasFeatureAtCoordinate = function(coordinate, context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash) {
  var gl = context.getGL();
  gl.bindFramebuffer(gl.FRAMEBUFFER, context.getHitDetectionFramebuffer());
  var hasFeature = this.replayHitDetection_(context, coordinate, resolution, rotation, ol.render.webgl.HIT_DETECTION_SIZE_, pixelRatio, opacity, skippedFeaturesHash, function(feature) {
    var imageData = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    return imageData[3] > 0;
  }, false);
  return hasFeature !== undefined;
};
ol.render.webgl.BATCH_CONSTRUCTORS_ = {"Image":ol.render.webgl.ImageReplay};
ol.render.webgl.HIT_DETECTION_SIZE_ = [1, 1];
goog.provide("ol.render.webgl.Immediate");
goog.require("ol");
goog.require("ol.extent");
goog.require("ol.geom.GeometryType");
goog.require("ol.render.ReplayType");
goog.require("ol.render.VectorContext");
goog.require("ol.render.webgl.ReplayGroup");
ol.render.webgl.Immediate = function(context, center, resolution, rotation, size, extent, pixelRatio) {
  ol.render.VectorContext.call(this);
  this.context_ = context;
  this.center_ = center;
  this.extent_ = extent;
  this.pixelRatio_ = pixelRatio;
  this.size_ = size;
  this.rotation_ = rotation;
  this.resolution_ = resolution;
  this.imageStyle_ = null;
};
ol.inherits(ol.render.webgl.Immediate, ol.render.VectorContext);
ol.render.webgl.Immediate.prototype.setStyle = function(style) {
  this.setImageStyle(style.getImage());
};
ol.render.webgl.Immediate.prototype.drawGeometry = function(geometry) {
  var type = geometry.getType();
  switch(type) {
    case ol.geom.GeometryType.POINT:
      this.drawPoint((geometry), null);
      break;
    case ol.geom.GeometryType.MULTI_POINT:
      this.drawMultiPoint((geometry), null);
      break;
    case ol.geom.GeometryType.GEOMETRY_COLLECTION:
      this.drawGeometryCollection((geometry), null);
      break;
    default:
      ol.DEBUG && console.assert(false, "Unsupported geometry type: " + type);
  }
};
ol.render.webgl.Immediate.prototype.drawFeature = function(feature, style) {
  var geometry = style.getGeometryFunction()(feature);
  if (!geometry || !ol.extent.intersects(this.extent_, geometry.getExtent())) {
    return;
  }
  this.setStyle(style);
  ol.DEBUG && console.assert(geometry, "geometry must be truthy");
  this.drawGeometry(geometry);
};
ol.render.webgl.Immediate.prototype.drawGeometryCollection = function(geometry, data) {
  var geometries = geometry.getGeometriesArray();
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    this.drawGeometry(geometries[i]);
  }
};
ol.render.webgl.Immediate.prototype.drawPoint = function(geometry, data) {
  var context = this.context_;
  var replayGroup = new ol.render.webgl.ReplayGroup(1, this.extent_);
  var replay = (replayGroup.getReplay(0, ol.render.ReplayType.IMAGE));
  replay.setImageStyle(this.imageStyle_);
  replay.drawPoint(geometry, data);
  replay.finish(context);
  var opacity = 1;
  var skippedFeatures = {};
  var featureCallback;
  var oneByOne = false;
  replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
  replay.getDeleteResourcesFunction(context)();
};
ol.render.webgl.Immediate.prototype.drawMultiPoint = function(geometry, data) {
  var context = this.context_;
  var replayGroup = new ol.render.webgl.ReplayGroup(1, this.extent_);
  var replay = (replayGroup.getReplay(0, ol.render.ReplayType.IMAGE));
  replay.setImageStyle(this.imageStyle_);
  replay.drawMultiPoint(geometry, data);
  replay.finish(context);
  var opacity = 1;
  var skippedFeatures = {};
  var featureCallback;
  var oneByOne = false;
  replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
  replay.getDeleteResourcesFunction(context)();
};
ol.render.webgl.Immediate.prototype.setImageStyle = function(imageStyle) {
  this.imageStyle_ = imageStyle;
};
goog.provide("ol.renderer.webgl.defaultmapshader");
goog.require("ol");
goog.require("ol.webgl.Fragment");
goog.require("ol.webgl.Vertex");
ol.renderer.webgl.defaultmapshader.Fragment = function() {
  ol.webgl.Fragment.call(this, ol.renderer.webgl.defaultmapshader.Fragment.SOURCE);
};
ol.inherits(ol.renderer.webgl.defaultmapshader.Fragment, ol.webgl.Fragment);
ol.renderer.webgl.defaultmapshader.Fragment.DEBUG_SOURCE = "precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform float u_opacity;\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  vec4 texColor = texture2D(u_texture, v_texCoord);\n  gl_FragColor.rgb = texColor.rgb;\n  gl_FragColor.a = texColor.a * u_opacity;\n}\n";
ol.renderer.webgl.defaultmapshader.Fragment.OPTIMIZED_SOURCE = "precision mediump float;varying vec2 a;uniform float f;uniform sampler2D g;void main(void){vec4 texColor=texture2D(g,a);gl_FragColor.rgb=texColor.rgb;gl_FragColor.a=texColor.a*f;}";
ol.renderer.webgl.defaultmapshader.Fragment.SOURCE = ol.DEBUG ? ol.renderer.webgl.defaultmapshader.Fragment.DEBUG_SOURCE : ol.renderer.webgl.defaultmapshader.Fragment.OPTIMIZED_SOURCE;
ol.renderer.webgl.defaultmapshader.fragment = new ol.renderer.webgl.defaultmapshader.Fragment;
ol.renderer.webgl.defaultmapshader.Vertex = function() {
  ol.webgl.Vertex.call(this, ol.renderer.webgl.defaultmapshader.Vertex.SOURCE);
};
ol.inherits(ol.renderer.webgl.defaultmapshader.Vertex, ol.webgl.Vertex);
ol.renderer.webgl.defaultmapshader.Vertex.DEBUG_SOURCE = "varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nuniform mat4 u_texCoordMatrix;\nuniform mat4 u_projectionMatrix;\n\nvoid main(void) {\n  gl_Position = u_projectionMatrix * vec4(a_position, 0., 1.);\n  v_texCoord = (u_texCoordMatrix * vec4(a_texCoord, 0., 1.)).st;\n}\n\n\n";
ol.renderer.webgl.defaultmapshader.Vertex.OPTIMIZED_SOURCE = "varying vec2 a;attribute vec2 b;attribute vec2 c;uniform mat4 d;uniform mat4 e;void main(void){gl_Position=e*vec4(b,0.,1.);a=(d*vec4(c,0.,1.)).st;}";
ol.renderer.webgl.defaultmapshader.Vertex.SOURCE = ol.DEBUG ? ol.renderer.webgl.defaultmapshader.Vertex.DEBUG_SOURCE : ol.renderer.webgl.defaultmapshader.Vertex.OPTIMIZED_SOURCE;
ol.renderer.webgl.defaultmapshader.vertex = new ol.renderer.webgl.defaultmapshader.Vertex;
ol.renderer.webgl.defaultmapshader.Locations = function(gl, program) {
  this.u_opacity = gl.getUniformLocation(program, ol.DEBUG ? "u_opacity" : "f");
  this.u_projectionMatrix = gl.getUniformLocation(program, ol.DEBUG ? "u_projectionMatrix" : "e");
  this.u_texCoordMatrix = gl.getUniformLocation(program, ol.DEBUG ? "u_texCoordMatrix" : "d");
  this.u_texture = gl.getUniformLocation(program, ol.DEBUG ? "u_texture" : "g");
  this.a_position = gl.getAttribLocation(program, ol.DEBUG ? "a_position" : "b");
  this.a_texCoord = gl.getAttribLocation(program, ol.DEBUG ? "a_texCoord" : "c");
};
goog.provide("ol.renderer.webgl.Layer");
goog.require("ol");
goog.require("ol.render.Event");
goog.require("ol.render.webgl.Immediate");
goog.require("ol.renderer.Layer");
goog.require("ol.renderer.webgl.defaultmapshader");
goog.require("ol.transform");
goog.require("ol.vec.Mat4");
goog.require("ol.webgl");
goog.require("ol.webgl.Buffer");
goog.require("ol.webgl.Context");
ol.renderer.webgl.Layer = function(mapRenderer, layer) {
  ol.renderer.Layer.call(this, layer);
  this.mapRenderer = mapRenderer;
  this.arrayBuffer_ = new ol.webgl.Buffer([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]);
  this.texture = null;
  this.framebuffer = null;
  this.framebufferDimension = undefined;
  this.texCoordMatrix = ol.transform.create();
  this.projectionMatrix = ol.transform.create();
  this.tmpMat4_ = ol.vec.Mat4.create();
  this.defaultLocations_ = null;
};
ol.inherits(ol.renderer.webgl.Layer, ol.renderer.Layer);
ol.renderer.webgl.Layer.prototype.bindFramebuffer = function(frameState, framebufferDimension) {
  var gl = this.mapRenderer.getGL();
  if (this.framebufferDimension === undefined || this.framebufferDimension != framebufferDimension) {
    var postRenderFunction = function(gl, framebuffer, texture) {
      if (!gl.isContextLost()) {
        gl.deleteFramebuffer(framebuffer);
        gl.deleteTexture(texture);
      }
    }.bind(null, gl, this.framebuffer, this.texture);
    frameState.postRenderFunctions.push((postRenderFunction));
    var texture = ol.webgl.Context.createEmptyTexture(gl, framebufferDimension, framebufferDimension);
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(ol.webgl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(ol.webgl.FRAMEBUFFER, ol.webgl.COLOR_ATTACHMENT0, ol.webgl.TEXTURE_2D, texture, 0);
    this.texture = texture;
    this.framebuffer = framebuffer;
    this.framebufferDimension = framebufferDimension;
  } else {
    gl.bindFramebuffer(ol.webgl.FRAMEBUFFER, this.framebuffer);
  }
};
ol.renderer.webgl.Layer.prototype.composeFrame = function(frameState, layerState, context) {
  this.dispatchComposeEvent_(ol.render.Event.Type.PRECOMPOSE, context, frameState);
  context.bindBuffer(ol.webgl.ARRAY_BUFFER, this.arrayBuffer_);
  var gl = context.getGL();
  var fragmentShader = ol.renderer.webgl.defaultmapshader.fragment;
  var vertexShader = ol.renderer.webgl.defaultmapshader.vertex;
  var program = context.getProgram(fragmentShader, vertexShader);
  var locations;
  if (!this.defaultLocations_) {
    locations = new ol.renderer.webgl.defaultmapshader.Locations(gl, program);
    this.defaultLocations_ = locations;
  } else {
    locations = this.defaultLocations_;
  }
  if (context.useProgram(program)) {
    gl.enableVertexAttribArray(locations.a_position);
    gl.vertexAttribPointer(locations.a_position, 2, ol.webgl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(locations.a_texCoord);
    gl.vertexAttribPointer(locations.a_texCoord, 2, ol.webgl.FLOAT, false, 16, 8);
    gl.uniform1i(locations.u_texture, 0);
  }
  gl.uniformMatrix4fv(locations.u_texCoordMatrix, false, ol.vec.Mat4.fromTransform(this.tmpMat4_, this.getTexCoordMatrix()));
  gl.uniformMatrix4fv(locations.u_projectionMatrix, false, ol.vec.Mat4.fromTransform(this.tmpMat4_, this.getProjectionMatrix()));
  gl.uniform1f(locations.u_opacity, layerState.opacity);
  gl.bindTexture(ol.webgl.TEXTURE_2D, this.getTexture());
  gl.drawArrays(ol.webgl.TRIANGLE_STRIP, 0, 4);
  this.dispatchComposeEvent_(ol.render.Event.Type.POSTCOMPOSE, context, frameState);
};
ol.renderer.webgl.Layer.prototype.dispatchComposeEvent_ = function(type, context, frameState) {
  var layer = this.getLayer();
  if (layer.hasListener(type)) {
    var viewState = frameState.viewState;
    var resolution = viewState.resolution;
    var pixelRatio = frameState.pixelRatio;
    var extent = frameState.extent;
    var center = viewState.center;
    var rotation = viewState.rotation;
    var size = frameState.size;
    var render = new ol.render.webgl.Immediate(context, center, resolution, rotation, size, extent, pixelRatio);
    var composeEvent = new ol.render.Event(type, render, frameState, null, context);
    layer.dispatchEvent(composeEvent);
  }
};
ol.renderer.webgl.Layer.prototype.getTexCoordMatrix = function() {
  return this.texCoordMatrix;
};
ol.renderer.webgl.Layer.prototype.getTexture = function() {
  return this.texture;
};
ol.renderer.webgl.Layer.prototype.getProjectionMatrix = function() {
  return this.projectionMatrix;
};
ol.renderer.webgl.Layer.prototype.handleWebGLContextLost = function() {
  this.texture = null;
  this.framebuffer = null;
  this.framebufferDimension = undefined;
};
ol.renderer.webgl.Layer.prototype.prepareFrame = function(frameState, layerState, context) {
};
goog.provide("ol.renderer.webgl.ImageLayer");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.dom");
goog.require("ol.extent");
goog.require("ol.functions");
goog.require("ol.proj");
goog.require("ol.renderer.webgl.Layer");
goog.require("ol.source.ImageVector");
goog.require("ol.transform");
goog.require("ol.webgl");
goog.require("ol.webgl.Context");
ol.renderer.webgl.ImageLayer = function(mapRenderer, imageLayer) {
  ol.renderer.webgl.Layer.call(this, mapRenderer, imageLayer);
  this.image_ = null;
  this.hitCanvasContext_ = null;
  this.hitTransformationMatrix_ = null;
};
ol.inherits(ol.renderer.webgl.ImageLayer, ol.renderer.webgl.Layer);
ol.renderer.webgl.ImageLayer.prototype.createTexture_ = function(image) {
  var imageElement = image.getImage();
  var gl = this.mapRenderer.getGL();
  return ol.webgl.Context.createTexture(gl, imageElement, ol.webgl.CLAMP_TO_EDGE, ol.webgl.CLAMP_TO_EDGE);
};
ol.renderer.webgl.ImageLayer.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg) {
  var layer = this.getLayer();
  var source = layer.getSource();
  var resolution = frameState.viewState.resolution;
  var rotation = frameState.viewState.rotation;
  var skippedFeatureUids = frameState.skippedFeatureUids;
  return source.forEachFeatureAtCoordinate(coordinate, resolution, rotation, skippedFeatureUids, function(feature) {
    return callback.call(thisArg, feature, layer);
  });
};
ol.renderer.webgl.ImageLayer.prototype.prepareFrame = function(frameState, layerState, context) {
  var gl = this.mapRenderer.getGL();
  var pixelRatio = frameState.pixelRatio;
  var viewState = frameState.viewState;
  var viewCenter = viewState.center;
  var viewResolution = viewState.resolution;
  var viewRotation = viewState.rotation;
  var image = this.image_;
  var texture = this.texture;
  var imageLayer = (this.getLayer());
  var imageSource = imageLayer.getSource();
  var hints = frameState.viewHints;
  var renderedExtent = frameState.extent;
  if (layerState.extent !== undefined) {
    renderedExtent = ol.extent.getIntersection(renderedExtent, layerState.extent);
  }
  if (!hints[ol.View.Hint.ANIMATING] && !hints[ol.View.Hint.INTERACTING] && !ol.extent.isEmpty(renderedExtent)) {
    var projection = viewState.projection;
    if (!ol.ENABLE_RASTER_REPROJECTION) {
      var sourceProjection = imageSource.getProjection();
      if (sourceProjection) {
        ol.DEBUG && console.assert(ol.proj.equivalent(projection, sourceProjection), "projection and sourceProjection are equivalent");
        projection = sourceProjection;
      }
    }
    var image_ = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
    if (image_) {
      var loaded = this.loadImage(image_);
      if (loaded) {
        image = image_;
        texture = this.createTexture_(image_);
        if (this.texture) {
          var postRenderFunction = function(gl, texture) {
            if (!gl.isContextLost()) {
              gl.deleteTexture(texture);
            }
          }.bind(null, gl, this.texture);
          frameState.postRenderFunctions.push((postRenderFunction));
        }
      }
    }
  }
  if (image) {
    ol.DEBUG && console.assert(texture, "texture is truthy");
    var canvas = this.mapRenderer.getContext().getCanvas();
    this.updateProjectionMatrix_(canvas.width, canvas.height, pixelRatio, viewCenter, viewResolution, viewRotation, image.getExtent());
    this.hitTransformationMatrix_ = null;
    var texCoordMatrix = this.texCoordMatrix;
    ol.transform.reset(texCoordMatrix);
    ol.transform.scale(texCoordMatrix, 1, -1);
    ol.transform.translate(texCoordMatrix, 0, -1);
    this.image_ = image;
    this.texture = texture;
    this.updateAttributions(frameState.attributions, image.getAttributions());
    this.updateLogos(frameState, imageSource);
  }
  return true;
};
ol.renderer.webgl.ImageLayer.prototype.updateProjectionMatrix_ = function(canvasWidth, canvasHeight, pixelRatio, viewCenter, viewResolution, viewRotation, imageExtent) {
  var canvasExtentWidth = canvasWidth * viewResolution;
  var canvasExtentHeight = canvasHeight * viewResolution;
  var projectionMatrix = this.projectionMatrix;
  ol.transform.reset(projectionMatrix);
  ol.transform.scale(projectionMatrix, pixelRatio * 2 / canvasExtentWidth, pixelRatio * 2 / canvasExtentHeight);
  ol.transform.rotate(projectionMatrix, -viewRotation);
  ol.transform.translate(projectionMatrix, imageExtent[0] - viewCenter[0], imageExtent[1] - viewCenter[1]);
  ol.transform.scale(projectionMatrix, (imageExtent[2] - imageExtent[0]) / 2, (imageExtent[3] - imageExtent[1]) / 2);
  ol.transform.translate(projectionMatrix, 1, 1);
};
ol.renderer.webgl.ImageLayer.prototype.hasFeatureAtCoordinate = function(coordinate, frameState) {
  var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, ol.functions.TRUE, this);
  return hasFeature !== undefined;
};
ol.renderer.webgl.ImageLayer.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg) {
  if (!this.image_ || !this.image_.getImage()) {
    return undefined;
  }
  if (this.getLayer().getSource() instanceof ol.source.ImageVector) {
    var coordinate = ol.transform.apply(frameState.pixelToCoordinateTransform, pixel.slice());
    var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, ol.functions.TRUE, this);
    if (hasFeature) {
      return callback.call(thisArg, this.getLayer(), null);
    } else {
      return undefined;
    }
  } else {
    var imageSize = [this.image_.getImage().width, this.image_.getImage().height];
    if (!this.hitTransformationMatrix_) {
      this.hitTransformationMatrix_ = this.getHitTransformationMatrix_(frameState.size, imageSize);
    }
    var pixelOnFrameBuffer = ol.transform.apply(this.hitTransformationMatrix_, pixel.slice());
    if (pixelOnFrameBuffer[0] < 0 || pixelOnFrameBuffer[0] > imageSize[0] || pixelOnFrameBuffer[1] < 0 || pixelOnFrameBuffer[1] > imageSize[1]) {
      return undefined;
    }
    if (!this.hitCanvasContext_) {
      this.hitCanvasContext_ = ol.dom.createCanvasContext2D(1, 1);
    }
    this.hitCanvasContext_.clearRect(0, 0, 1, 1);
    this.hitCanvasContext_.drawImage(this.image_.getImage(), pixelOnFrameBuffer[0], pixelOnFrameBuffer[1], 1, 1, 0, 0, 1, 1);
    var imageData = this.hitCanvasContext_.getImageData(0, 0, 1, 1).data;
    if (imageData[3] > 0) {
      return callback.call(thisArg, this.getLayer(), imageData);
    } else {
      return undefined;
    }
  }
};
ol.renderer.webgl.ImageLayer.prototype.getHitTransformationMatrix_ = function(mapSize, imageSize) {
  var mapCoordTransform = ol.transform.create();
  ol.transform.translate(mapCoordTransform, -1, -1);
  ol.transform.scale(mapCoordTransform, 2 / mapSize[0], 2 / mapSize[1]);
  ol.transform.translate(mapCoordTransform, 0, mapSize[1]);
  ol.transform.scale(mapCoordTransform, 1, -1);
  var projectionMatrixInv = ol.transform.invert(this.projectionMatrix.slice());
  var transform = ol.transform.create();
  ol.transform.translate(transform, 0, imageSize[1]);
  ol.transform.scale(transform, 1, -1);
  ol.transform.scale(transform, imageSize[0] / 2, imageSize[1] / 2);
  ol.transform.translate(transform, 1, 1);
  ol.transform.multiply(transform, projectionMatrixInv);
  ol.transform.multiply(transform, mapCoordTransform);
  return transform;
};
goog.provide("ol.renderer.webgl.tilelayershader");
goog.require("ol");
goog.require("ol.webgl.Fragment");
goog.require("ol.webgl.Vertex");
ol.renderer.webgl.tilelayershader.Fragment = function() {
  ol.webgl.Fragment.call(this, ol.renderer.webgl.tilelayershader.Fragment.SOURCE);
};
ol.inherits(ol.renderer.webgl.tilelayershader.Fragment, ol.webgl.Fragment);
ol.renderer.webgl.tilelayershader.Fragment.DEBUG_SOURCE = "precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  gl_FragColor = texture2D(u_texture, v_texCoord);\n}\n";
ol.renderer.webgl.tilelayershader.Fragment.OPTIMIZED_SOURCE = "precision mediump float;varying vec2 a;uniform sampler2D e;void main(void){gl_FragColor=texture2D(e,a);}";
ol.renderer.webgl.tilelayershader.Fragment.SOURCE = ol.DEBUG ? ol.renderer.webgl.tilelayershader.Fragment.DEBUG_SOURCE : ol.renderer.webgl.tilelayershader.Fragment.OPTIMIZED_SOURCE;
ol.renderer.webgl.tilelayershader.fragment = new ol.renderer.webgl.tilelayershader.Fragment;
ol.renderer.webgl.tilelayershader.Vertex = function() {
  ol.webgl.Vertex.call(this, ol.renderer.webgl.tilelayershader.Vertex.SOURCE);
};
ol.inherits(ol.renderer.webgl.tilelayershader.Vertex, ol.webgl.Vertex);
ol.renderer.webgl.tilelayershader.Vertex.DEBUG_SOURCE = "varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec4 u_tileOffset;\n\nvoid main(void) {\n  gl_Position = vec4(a_position * u_tileOffset.xy + u_tileOffset.zw, 0., 1.);\n  v_texCoord = a_texCoord;\n}\n\n\n";
ol.renderer.webgl.tilelayershader.Vertex.OPTIMIZED_SOURCE = "varying vec2 a;attribute vec2 b;attribute vec2 c;uniform vec4 d;void main(void){gl_Position=vec4(b*d.xy+d.zw,0.,1.);a=c;}";
ol.renderer.webgl.tilelayershader.Vertex.SOURCE = ol.DEBUG ? ol.renderer.webgl.tilelayershader.Vertex.DEBUG_SOURCE : ol.renderer.webgl.tilelayershader.Vertex.OPTIMIZED_SOURCE;
ol.renderer.webgl.tilelayershader.vertex = new ol.renderer.webgl.tilelayershader.Vertex;
ol.renderer.webgl.tilelayershader.Locations = function(gl, program) {
  this.u_texture = gl.getUniformLocation(program, ol.DEBUG ? "u_texture" : "e");
  this.u_tileOffset = gl.getUniformLocation(program, ol.DEBUG ? "u_tileOffset" : "d");
  this.a_position = gl.getAttribLocation(program, ol.DEBUG ? "a_position" : "b");
  this.a_texCoord = gl.getAttribLocation(program, ol.DEBUG ? "a_texCoord" : "c");
};
goog.provide("ol.renderer.webgl.TileLayer");
goog.require("ol");
goog.require("ol.Tile");
goog.require("ol.TileRange");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.math");
goog.require("ol.renderer.webgl.Layer");
goog.require("ol.renderer.webgl.tilelayershader");
goog.require("ol.size");
goog.require("ol.transform");
goog.require("ol.webgl");
goog.require("ol.webgl.Buffer");
ol.renderer.webgl.TileLayer = function(mapRenderer, tileLayer) {
  ol.renderer.webgl.Layer.call(this, mapRenderer, tileLayer);
  this.fragmentShader_ = ol.renderer.webgl.tilelayershader.fragment;
  this.vertexShader_ = ol.renderer.webgl.tilelayershader.vertex;
  this.locations_ = null;
  this.renderArrayBuffer_ = new ol.webgl.Buffer([0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0]);
  this.renderedTileRange_ = null;
  this.renderedFramebufferExtent_ = null;
  this.renderedRevision_ = -1;
  this.tmpSize_ = [0, 0];
};
ol.inherits(ol.renderer.webgl.TileLayer, ol.renderer.webgl.Layer);
ol.renderer.webgl.TileLayer.prototype.disposeInternal = function() {
  var context = this.mapRenderer.getContext();
  context.deleteBuffer(this.renderArrayBuffer_);
  ol.renderer.webgl.Layer.prototype.disposeInternal.call(this);
};
ol.renderer.webgl.TileLayer.prototype.createLoadedTileFinder = function(source, projection, tiles) {
  var mapRenderer = this.mapRenderer;
  return function(zoom, tileRange) {
    function callback(tile) {
      var loaded = mapRenderer.isTileTextureLoaded(tile);
      if (loaded) {
        if (!tiles[zoom]) {
          tiles[zoom] = {};
        }
        tiles[zoom][tile.tileCoord.toString()] = tile;
      }
      return loaded;
    }
    return source.forEachLoadedTile(projection, zoom, tileRange, callback);
  };
};
ol.renderer.webgl.TileLayer.prototype.handleWebGLContextLost = function() {
  ol.renderer.webgl.Layer.prototype.handleWebGLContextLost.call(this);
  this.locations_ = null;
};
ol.renderer.webgl.TileLayer.prototype.prepareFrame = function(frameState, layerState, context) {
  var mapRenderer = this.mapRenderer;
  var gl = context.getGL();
  var viewState = frameState.viewState;
  var projection = viewState.projection;
  var tileLayer = (this.getLayer());
  var tileSource = tileLayer.getSource();
  var tileGrid = tileSource.getTileGridForProjection(projection);
  var z = tileGrid.getZForResolution(viewState.resolution);
  var tileResolution = tileGrid.getResolution(z);
  var tilePixelSize = tileSource.getTilePixelSize(z, frameState.pixelRatio, projection);
  var pixelRatio = tilePixelSize[0] / ol.size.toSize(tileGrid.getTileSize(z), this.tmpSize_)[0];
  var tilePixelResolution = tileResolution / pixelRatio;
  var tileGutter = tileSource.getTilePixelRatio(pixelRatio) * tileSource.getGutter(projection);
  var center = viewState.center;
  var extent = frameState.extent;
  var tileRange = tileGrid.getTileRangeForExtentAndResolution(extent, tileResolution);
  var framebufferExtent;
  if (this.renderedTileRange_ && this.renderedTileRange_.equals(tileRange) && this.renderedRevision_ == tileSource.getRevision()) {
    framebufferExtent = this.renderedFramebufferExtent_;
  } else {
    var tileRangeSize = tileRange.getSize();
    var maxDimension = Math.max(tileRangeSize[0] * tilePixelSize[0], tileRangeSize[1] * tilePixelSize[1]);
    var framebufferDimension = ol.math.roundUpToPowerOfTwo(maxDimension);
    var framebufferExtentDimension = tilePixelResolution * framebufferDimension;
    var origin = tileGrid.getOrigin(z);
    var minX = origin[0] + tileRange.minX * tilePixelSize[0] * tilePixelResolution;
    var minY = origin[1] + tileRange.minY * tilePixelSize[1] * tilePixelResolution;
    framebufferExtent = [minX, minY, minX + framebufferExtentDimension, minY + framebufferExtentDimension];
    this.bindFramebuffer(frameState, framebufferDimension);
    gl.viewport(0, 0, framebufferDimension, framebufferDimension);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(ol.webgl.COLOR_BUFFER_BIT);
    gl.disable(ol.webgl.BLEND);
    var program = context.getProgram(this.fragmentShader_, this.vertexShader_);
    context.useProgram(program);
    if (!this.locations_) {
      this.locations_ = new ol.renderer.webgl.tilelayershader.Locations(gl, program);
    }
    context.bindBuffer(ol.webgl.ARRAY_BUFFER, this.renderArrayBuffer_);
    gl.enableVertexAttribArray(this.locations_.a_position);
    gl.vertexAttribPointer(this.locations_.a_position, 2, ol.webgl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.locations_.a_texCoord);
    gl.vertexAttribPointer(this.locations_.a_texCoord, 2, ol.webgl.FLOAT, false, 16, 8);
    gl.uniform1i(this.locations_.u_texture, 0);
    var tilesToDrawByZ = {};
    tilesToDrawByZ[z] = {};
    var findLoadedTiles = this.createLoadedTileFinder(tileSource, projection, tilesToDrawByZ);
    var useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();
    var allTilesLoaded = true;
    var tmpExtent = ol.extent.createEmpty();
    var tmpTileRange = new ol.TileRange(0, 0, 0, 0);
    var childTileRange, drawable, fullyLoaded, tile, tileState;
    var x, y, tileExtent;
    for (x = tileRange.minX;x <= tileRange.maxX;++x) {
      for (y = tileRange.minY;y <= tileRange.maxY;++y) {
        tile = tileSource.getTile(z, x, y, pixelRatio, projection);
        if (layerState.extent !== undefined) {
          tileExtent = tileGrid.getTileCoordExtent(tile.tileCoord, tmpExtent);
          if (!ol.extent.intersects(tileExtent, layerState.extent)) {
            continue;
          }
        }
        tileState = tile.getState();
        drawable = tileState == ol.Tile.State.LOADED || tileState == ol.Tile.State.EMPTY || tileState == ol.Tile.State.ERROR && !useInterimTilesOnError;
        if (!drawable) {
          tile = tile.getInterimTile();
        }
        tileState = tile.getState();
        if (tileState == ol.Tile.State.LOADED) {
          if (mapRenderer.isTileTextureLoaded(tile)) {
            tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
            continue;
          }
        } else {
          if (tileState == ol.Tile.State.EMPTY || tileState == ol.Tile.State.ERROR && !useInterimTilesOnError) {
            continue;
          }
        }
        allTilesLoaded = false;
        fullyLoaded = tileGrid.forEachTileCoordParentTileRange(tile.tileCoord, findLoadedTiles, null, tmpTileRange, tmpExtent);
        if (!fullyLoaded) {
          childTileRange = tileGrid.getTileCoordChildTileRange(tile.tileCoord, tmpTileRange, tmpExtent);
          if (childTileRange) {
            findLoadedTiles(z + 1, childTileRange);
          }
        }
      }
    }
    var zs = Object.keys(tilesToDrawByZ).map(Number);
    zs.sort(ol.array.numberSafeCompareFunction);
    var u_tileOffset = new Float32Array(4);
    var i, ii, tileKey, tilesToDraw;
    for (i = 0, ii = zs.length;i < ii;++i) {
      tilesToDraw = tilesToDrawByZ[zs[i]];
      for (tileKey in tilesToDraw) {
        tile = tilesToDraw[tileKey];
        tileExtent = tileGrid.getTileCoordExtent(tile.tileCoord, tmpExtent);
        u_tileOffset[0] = 2 * (tileExtent[2] - tileExtent[0]) / framebufferExtentDimension;
        u_tileOffset[1] = 2 * (tileExtent[3] - tileExtent[1]) / framebufferExtentDimension;
        u_tileOffset[2] = 2 * (tileExtent[0] - framebufferExtent[0]) / framebufferExtentDimension - 1;
        u_tileOffset[3] = 2 * (tileExtent[1] - framebufferExtent[1]) / framebufferExtentDimension - 1;
        gl.uniform4fv(this.locations_.u_tileOffset, u_tileOffset);
        mapRenderer.bindTileTexture(tile, tilePixelSize, tileGutter * pixelRatio, ol.webgl.LINEAR, ol.webgl.LINEAR);
        gl.drawArrays(ol.webgl.TRIANGLE_STRIP, 0, 4);
      }
    }
    if (allTilesLoaded) {
      this.renderedTileRange_ = tileRange;
      this.renderedFramebufferExtent_ = framebufferExtent;
      this.renderedRevision_ = tileSource.getRevision();
    } else {
      this.renderedTileRange_ = null;
      this.renderedFramebufferExtent_ = null;
      this.renderedRevision_ = -1;
      frameState.animate = true;
    }
  }
  this.updateUsedTiles(frameState.usedTiles, tileSource, z, tileRange);
  var tileTextureQueue = mapRenderer.getTileTextureQueue();
  this.manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, z, tileLayer.getPreload(), function(tile) {
    if (tile.getState() == ol.Tile.State.LOADED && !mapRenderer.isTileTextureLoaded(tile) && !tileTextureQueue.isKeyQueued(tile.getKey())) {
      tileTextureQueue.enqueue([tile, tileGrid.getTileCoordCenter(tile.tileCoord), tileGrid.getResolution(tile.tileCoord[0]), tilePixelSize, tileGutter * pixelRatio]);
    }
  }, this);
  this.scheduleExpireCache(frameState, tileSource);
  this.updateLogos(frameState, tileSource);
  var texCoordMatrix = this.texCoordMatrix;
  ol.transform.reset(texCoordMatrix);
  ol.transform.translate(texCoordMatrix, (Math.round(center[0] / tileResolution) * tileResolution - framebufferExtent[0]) / (framebufferExtent[2] - framebufferExtent[0]), (Math.round(center[1] / tileResolution) * tileResolution - framebufferExtent[1]) / (framebufferExtent[3] - framebufferExtent[1]));
  if (viewState.rotation !== 0) {
    ol.transform.rotate(texCoordMatrix, viewState.rotation);
  }
  ol.transform.scale(texCoordMatrix, frameState.size[0] * viewState.resolution / (framebufferExtent[2] - framebufferExtent[0]), frameState.size[1] * viewState.resolution / (framebufferExtent[3] - framebufferExtent[1]));
  ol.transform.translate(texCoordMatrix, -.5, -.5);
  return true;
};
ol.renderer.webgl.TileLayer.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg) {
  if (!this.framebuffer) {
    return undefined;
  }
  var pixelOnMapScaled = [pixel[0] / frameState.size[0], (frameState.size[1] - pixel[1]) / frameState.size[1]];
  var pixelOnFrameBufferScaled = ol.transform.apply(this.texCoordMatrix, pixelOnMapScaled.slice());
  var pixelOnFrameBuffer = [pixelOnFrameBufferScaled[0] * this.framebufferDimension, pixelOnFrameBufferScaled[1] * this.framebufferDimension];
  var gl = this.mapRenderer.getContext().getGL();
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  var imageData = new Uint8Array(4);
  gl.readPixels(pixelOnFrameBuffer[0], pixelOnFrameBuffer[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
  if (imageData[3] > 0) {
    return callback.call(thisArg, this.getLayer(), imageData);
  } else {
    return undefined;
  }
};
goog.provide("ol.renderer.webgl.VectorLayer");
goog.require("ol");
goog.require("ol.View");
goog.require("ol.extent");
goog.require("ol.render.webgl.ReplayGroup");
goog.require("ol.renderer.vector");
goog.require("ol.renderer.webgl.Layer");
goog.require("ol.transform");
ol.renderer.webgl.VectorLayer = function(mapRenderer, vectorLayer) {
  ol.renderer.webgl.Layer.call(this, mapRenderer, vectorLayer);
  this.dirty_ = false;
  this.renderedRevision_ = -1;
  this.renderedResolution_ = NaN;
  this.renderedExtent_ = ol.extent.createEmpty();
  this.renderedRenderOrder_ = null;
  this.replayGroup_ = null;
  this.layerState_ = null;
};
ol.inherits(ol.renderer.webgl.VectorLayer, ol.renderer.webgl.Layer);
ol.renderer.webgl.VectorLayer.prototype.composeFrame = function(frameState, layerState, context) {
  this.layerState_ = layerState;
  var viewState = frameState.viewState;
  var replayGroup = this.replayGroup_;
  if (replayGroup && !replayGroup.isEmpty()) {
    replayGroup.replay(context, viewState.center, viewState.resolution, viewState.rotation, frameState.size, frameState.pixelRatio, layerState.opacity, layerState.managed ? frameState.skippedFeatureUids : {});
  }
};
ol.renderer.webgl.VectorLayer.prototype.disposeInternal = function() {
  var replayGroup = this.replayGroup_;
  if (replayGroup) {
    var context = this.mapRenderer.getContext();
    replayGroup.getDeleteResourcesFunction(context)();
    this.replayGroup_ = null;
  }
  ol.renderer.webgl.Layer.prototype.disposeInternal.call(this);
};
ol.renderer.webgl.VectorLayer.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg) {
  if (!this.replayGroup_ || !this.layerState_) {
    return undefined;
  } else {
    var context = this.mapRenderer.getContext();
    var viewState = frameState.viewState;
    var layer = this.getLayer();
    var layerState = this.layerState_;
    var features = {};
    return this.replayGroup_.forEachFeatureAtCoordinate(coordinate, context, viewState.center, viewState.resolution, viewState.rotation, frameState.size, frameState.pixelRatio, layerState.opacity, {}, function(feature) {
      var key = ol.getUid(feature).toString();
      if (!(key in features)) {
        features[key] = true;
        return callback.call(thisArg, feature, layer);
      }
    });
  }
};
ol.renderer.webgl.VectorLayer.prototype.hasFeatureAtCoordinate = function(coordinate, frameState) {
  if (!this.replayGroup_ || !this.layerState_) {
    return false;
  } else {
    var context = this.mapRenderer.getContext();
    var viewState = frameState.viewState;
    var layerState = this.layerState_;
    return this.replayGroup_.hasFeatureAtCoordinate(coordinate, context, viewState.center, viewState.resolution, viewState.rotation, frameState.size, frameState.pixelRatio, layerState.opacity, frameState.skippedFeatureUids);
  }
};
ol.renderer.webgl.VectorLayer.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg) {
  var coordinate = ol.transform.apply(frameState.pixelToCoordinateTransform, pixel.slice());
  var hasFeature = this.hasFeatureAtCoordinate(coordinate, frameState);
  if (hasFeature) {
    return callback.call(thisArg, this.getLayer(), null);
  } else {
    return undefined;
  }
};
ol.renderer.webgl.VectorLayer.prototype.handleStyleImageChange_ = function(event) {
  this.renderIfReadyAndVisible();
};
ol.renderer.webgl.VectorLayer.prototype.prepareFrame = function(frameState, layerState, context) {
  var vectorLayer = (this.getLayer());
  var vectorSource = vectorLayer.getSource();
  this.updateAttributions(frameState.attributions, vectorSource.getAttributions());
  this.updateLogos(frameState, vectorSource);
  var animating = frameState.viewHints[ol.View.Hint.ANIMATING];
  var interacting = frameState.viewHints[ol.View.Hint.INTERACTING];
  var updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
  var updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();
  if (!this.dirty_ && (!updateWhileAnimating && animating) || !updateWhileInteracting && interacting) {
    return true;
  }
  var frameStateExtent = frameState.extent;
  var viewState = frameState.viewState;
  var projection = viewState.projection;
  var resolution = viewState.resolution;
  var pixelRatio = frameState.pixelRatio;
  var vectorLayerRevision = vectorLayer.getRevision();
  var vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
  var vectorLayerRenderOrder = vectorLayer.getRenderOrder();
  if (vectorLayerRenderOrder === undefined) {
    vectorLayerRenderOrder = ol.renderer.vector.defaultOrder;
  }
  var extent = ol.extent.buffer(frameStateExtent, vectorLayerRenderBuffer * resolution);
  if (!this.dirty_ && this.renderedResolution_ == resolution && this.renderedRevision_ == vectorLayerRevision && this.renderedRenderOrder_ == vectorLayerRenderOrder && ol.extent.containsExtent(this.renderedExtent_, extent)) {
    return true;
  }
  if (this.replayGroup_) {
    frameState.postRenderFunctions.push(this.replayGroup_.getDeleteResourcesFunction(context));
  }
  this.dirty_ = false;
  var replayGroup = new ol.render.webgl.ReplayGroup(ol.renderer.vector.getTolerance(resolution, pixelRatio), extent, vectorLayer.getRenderBuffer());
  vectorSource.loadFeatures(extent, resolution, projection);
  var renderFeature = function(feature) {
    var styles;
    var styleFunction = feature.getStyleFunction();
    if (styleFunction) {
      styles = styleFunction.call(feature, resolution);
    } else {
      styleFunction = vectorLayer.getStyleFunction();
      if (styleFunction) {
        styles = styleFunction(feature, resolution);
      }
    }
    if (styles) {
      var dirty = this.renderFeature(feature, resolution, pixelRatio, styles, replayGroup);
      this.dirty_ = this.dirty_ || dirty;
    }
  };
  if (vectorLayerRenderOrder) {
    var features = [];
    vectorSource.forEachFeatureInExtent(extent, function(feature) {
      features.push(feature);
    }, this);
    features.sort(vectorLayerRenderOrder);
    features.forEach(renderFeature, this);
  } else {
    vectorSource.forEachFeatureInExtent(extent, renderFeature, this);
  }
  replayGroup.finish(context);
  this.renderedResolution_ = resolution;
  this.renderedRevision_ = vectorLayerRevision;
  this.renderedRenderOrder_ = vectorLayerRenderOrder;
  this.renderedExtent_ = extent;
  this.replayGroup_ = replayGroup;
  return true;
};
ol.renderer.webgl.VectorLayer.prototype.renderFeature = function(feature, resolution, pixelRatio, styles, replayGroup) {
  if (!styles) {
    return false;
  }
  var loading = false;
  if (Array.isArray(styles)) {
    for (var i = 0, ii = styles.length;i < ii;++i) {
      loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles[i], ol.renderer.vector.getSquaredTolerance(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
    }
  } else {
    loading = ol.renderer.vector.renderFeature(replayGroup, feature, styles, ol.renderer.vector.getSquaredTolerance(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
  }
  return loading;
};
goog.provide("ol.renderer.webgl.Map");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.css");
goog.require("ol.dom");
goog.require("ol.events");
goog.require("ol.layer.Image");
goog.require("ol.layer.Layer");
goog.require("ol.layer.Tile");
goog.require("ol.layer.Vector");
goog.require("ol.render.Event");
goog.require("ol.render.webgl.Immediate");
goog.require("ol.renderer.Map");
goog.require("ol.renderer.Type");
goog.require("ol.renderer.webgl.ImageLayer");
goog.require("ol.renderer.webgl.TileLayer");
goog.require("ol.renderer.webgl.VectorLayer");
goog.require("ol.source.State");
goog.require("ol.structs.LRUCache");
goog.require("ol.structs.PriorityQueue");
goog.require("ol.webgl");
goog.require("ol.webgl.Context");
goog.require("ol.webgl.ContextEventType");
ol.renderer.webgl.Map = function(container, map) {
  ol.renderer.Map.call(this, container, map);
  this.canvas_ = (document.createElement("CANVAS"));
  this.canvas_.style.width = "100%";
  this.canvas_.style.height = "100%";
  this.canvas_.className = ol.css.CLASS_UNSELECTABLE;
  container.insertBefore(this.canvas_, container.childNodes[0] || null);
  this.clipTileCanvasWidth_ = 0;
  this.clipTileCanvasHeight_ = 0;
  this.clipTileContext_ = ol.dom.createCanvasContext2D();
  this.renderedVisible_ = true;
  this.gl_ = ol.webgl.getContext(this.canvas_, {antialias:true, depth:false, failIfMajorPerformanceCaveat:true, preserveDrawingBuffer:false, stencil:true});
  ol.DEBUG && console.assert(this.gl_, "got a WebGLRenderingContext");
  this.context_ = new ol.webgl.Context(this.canvas_, this.gl_);
  ol.events.listen(this.canvas_, ol.webgl.ContextEventType.LOST, this.handleWebGLContextLost, this);
  ol.events.listen(this.canvas_, ol.webgl.ContextEventType.RESTORED, this.handleWebGLContextRestored, this);
  this.textureCache_ = new ol.structs.LRUCache;
  this.focus_ = null;
  this.tileTextureQueue_ = new ol.structs.PriorityQueue(function(element) {
    var tileCenter = (element[1]);
    var tileResolution = (element[2]);
    var deltaX = tileCenter[0] - this.focus_[0];
    var deltaY = tileCenter[1] - this.focus_[1];
    return 65536 * Math.log(tileResolution) + Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
  }.bind(this), function(element) {
    return (element[0]).getKey();
  });
  this.loadNextTileTexture_ = function(map, frameState) {
    if (!this.tileTextureQueue_.isEmpty()) {
      this.tileTextureQueue_.reprioritize();
      var element = this.tileTextureQueue_.dequeue();
      var tile = (element[0]);
      var tileSize = (element[3]);
      var tileGutter = (element[4]);
      this.bindTileTexture(tile, tileSize, tileGutter, ol.webgl.LINEAR, ol.webgl.LINEAR);
    }
    return false;
  }.bind(this);
  this.textureCacheFrameMarkerCount_ = 0;
  this.initializeGL_();
};
ol.inherits(ol.renderer.webgl.Map, ol.renderer.Map);
ol.renderer.webgl.Map.prototype.bindTileTexture = function(tile, tileSize, tileGutter, magFilter, minFilter) {
  var gl = this.getGL();
  var tileKey = tile.getKey();
  if (this.textureCache_.containsKey(tileKey)) {
    var textureCacheEntry = this.textureCache_.get(tileKey);
    gl.bindTexture(ol.webgl.TEXTURE_2D, textureCacheEntry.texture);
    if (textureCacheEntry.magFilter != magFilter) {
      gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_MAG_FILTER, magFilter);
      textureCacheEntry.magFilter = magFilter;
    }
    if (textureCacheEntry.minFilter != minFilter) {
      gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_MIN_FILTER, minFilter);
      textureCacheEntry.minFilter = minFilter;
    }
  } else {
    var texture = gl.createTexture();
    gl.bindTexture(ol.webgl.TEXTURE_2D, texture);
    if (tileGutter > 0) {
      var clipTileCanvas = this.clipTileContext_.canvas;
      var clipTileContext = this.clipTileContext_;
      if (this.clipTileCanvasWidth_ !== tileSize[0] || this.clipTileCanvasHeight_ !== tileSize[1]) {
        clipTileCanvas.width = tileSize[0];
        clipTileCanvas.height = tileSize[1];
        this.clipTileCanvasWidth_ = tileSize[0];
        this.clipTileCanvasHeight_ = tileSize[1];
      } else {
        clipTileContext.clearRect(0, 0, tileSize[0], tileSize[1]);
      }
      clipTileContext.drawImage(tile.getImage(), tileGutter, tileGutter, tileSize[0], tileSize[1], 0, 0, tileSize[0], tileSize[1]);
      gl.texImage2D(ol.webgl.TEXTURE_2D, 0, ol.webgl.RGBA, ol.webgl.RGBA, ol.webgl.UNSIGNED_BYTE, clipTileCanvas);
    } else {
      gl.texImage2D(ol.webgl.TEXTURE_2D, 0, ol.webgl.RGBA, ol.webgl.RGBA, ol.webgl.UNSIGNED_BYTE, tile.getImage());
    }
    gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_WRAP_S, ol.webgl.CLAMP_TO_EDGE);
    gl.texParameteri(ol.webgl.TEXTURE_2D, ol.webgl.TEXTURE_WRAP_T, ol.webgl.CLAMP_TO_EDGE);
    this.textureCache_.set(tileKey, {texture:texture, magFilter:magFilter, minFilter:minFilter});
  }
};
ol.renderer.webgl.Map.prototype.createLayerRenderer = function(layer) {
  if (ol.ENABLE_IMAGE && layer instanceof ol.layer.Image) {
    return new ol.renderer.webgl.ImageLayer(this, layer);
  } else {
    if (ol.ENABLE_TILE && layer instanceof ol.layer.Tile) {
      return new ol.renderer.webgl.TileLayer(this, layer);
    } else {
      if (ol.ENABLE_VECTOR && layer instanceof ol.layer.Vector) {
        return new ol.renderer.webgl.VectorLayer(this, layer);
      } else {
        ol.DEBUG && console.assert(false, "unexpected layer configuration");
        return null;
      }
    }
  }
};
ol.renderer.webgl.Map.prototype.dispatchComposeEvent_ = function(type, frameState) {
  var map = this.getMap();
  if (map.hasListener(type)) {
    var context = this.context_;
    var extent = frameState.extent;
    var size = frameState.size;
    var viewState = frameState.viewState;
    var pixelRatio = frameState.pixelRatio;
    var resolution = viewState.resolution;
    var center = viewState.center;
    var rotation = viewState.rotation;
    var vectorContext = new ol.render.webgl.Immediate(context, center, resolution, rotation, size, extent, pixelRatio);
    var composeEvent = new ol.render.Event(type, vectorContext, frameState, null, context);
    map.dispatchEvent(composeEvent);
  }
};
ol.renderer.webgl.Map.prototype.disposeInternal = function() {
  var gl = this.getGL();
  if (!gl.isContextLost()) {
    this.textureCache_.forEach(function(textureCacheEntry) {
      if (textureCacheEntry) {
        gl.deleteTexture(textureCacheEntry.texture);
      }
    });
  }
  this.context_.dispose();
  ol.renderer.Map.prototype.disposeInternal.call(this);
};
ol.renderer.webgl.Map.prototype.expireCache_ = function(map, frameState) {
  var gl = this.getGL();
  var textureCacheEntry;
  while (this.textureCache_.getCount() - this.textureCacheFrameMarkerCount_ > ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK) {
    textureCacheEntry = this.textureCache_.peekLast();
    if (!textureCacheEntry) {
      if (+this.textureCache_.peekLastKey() == frameState.index) {
        break;
      } else {
        --this.textureCacheFrameMarkerCount_;
      }
    } else {
      gl.deleteTexture(textureCacheEntry.texture);
    }
    this.textureCache_.pop();
  }
};
ol.renderer.webgl.Map.prototype.getContext = function() {
  return this.context_;
};
ol.renderer.webgl.Map.prototype.getGL = function() {
  return this.gl_;
};
ol.renderer.webgl.Map.prototype.getTileTextureQueue = function() {
  return this.tileTextureQueue_;
};
ol.renderer.webgl.Map.prototype.getType = function() {
  return ol.renderer.Type.WEBGL;
};
ol.renderer.webgl.Map.prototype.handleWebGLContextLost = function(event) {
  event.preventDefault();
  this.textureCache_.clear();
  this.textureCacheFrameMarkerCount_ = 0;
  var renderers = this.getLayerRenderers();
  for (var id in renderers) {
    var renderer = (renderers[id]);
    renderer.handleWebGLContextLost();
  }
};
ol.renderer.webgl.Map.prototype.handleWebGLContextRestored = function() {
  this.initializeGL_();
  this.getMap().render();
};
ol.renderer.webgl.Map.prototype.initializeGL_ = function() {
  var gl = this.gl_;
  gl.activeTexture(ol.webgl.TEXTURE0);
  gl.blendFuncSeparate(ol.webgl.SRC_ALPHA, ol.webgl.ONE_MINUS_SRC_ALPHA, ol.webgl.ONE, ol.webgl.ONE_MINUS_SRC_ALPHA);
  gl.disable(ol.webgl.CULL_FACE);
  gl.disable(ol.webgl.DEPTH_TEST);
  gl.disable(ol.webgl.SCISSOR_TEST);
  gl.disable(ol.webgl.STENCIL_TEST);
};
ol.renderer.webgl.Map.prototype.isTileTextureLoaded = function(tile) {
  return this.textureCache_.containsKey(tile.getKey());
};
ol.renderer.webgl.Map.prototype.renderFrame = function(frameState) {
  var context = this.getContext();
  var gl = this.getGL();
  if (gl.isContextLost()) {
    return false;
  }
  if (!frameState) {
    if (this.renderedVisible_) {
      this.canvas_.style.display = "none";
      this.renderedVisible_ = false;
    }
    return false;
  }
  this.focus_ = frameState.focus;
  this.textureCache_.set((-frameState.index).toString(), null);
  ++this.textureCacheFrameMarkerCount_;
  this.dispatchComposeEvent_(ol.render.Event.Type.PRECOMPOSE, frameState);
  var layerStatesToDraw = [];
  var layerStatesArray = frameState.layerStatesArray;
  ol.array.stableSort(layerStatesArray, ol.renderer.Map.sortByZIndex);
  var viewResolution = frameState.viewState.resolution;
  var i, ii, layerRenderer, layerState;
  for (i = 0, ii = layerStatesArray.length;i < ii;++i) {
    layerState = layerStatesArray[i];
    if (ol.layer.Layer.visibleAtResolution(layerState, viewResolution) && layerState.sourceState == ol.source.State.READY) {
      layerRenderer = (this.getLayerRenderer(layerState.layer));
      if (layerRenderer.prepareFrame(frameState, layerState, context)) {
        layerStatesToDraw.push(layerState);
      }
    }
  }
  var width = frameState.size[0] * frameState.pixelRatio;
  var height = frameState.size[1] * frameState.pixelRatio;
  if (this.canvas_.width != width || this.canvas_.height != height) {
    this.canvas_.width = width;
    this.canvas_.height = height;
  }
  gl.bindFramebuffer(ol.webgl.FRAMEBUFFER, null);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(ol.webgl.COLOR_BUFFER_BIT);
  gl.enable(ol.webgl.BLEND);
  gl.viewport(0, 0, this.canvas_.width, this.canvas_.height);
  for (i = 0, ii = layerStatesToDraw.length;i < ii;++i) {
    layerState = layerStatesToDraw[i];
    layerRenderer = (this.getLayerRenderer(layerState.layer));
    layerRenderer.composeFrame(frameState, layerState, context);
  }
  if (!this.renderedVisible_) {
    this.canvas_.style.display = "";
    this.renderedVisible_ = true;
  }
  this.calculateMatrices2D(frameState);
  if (this.textureCache_.getCount() - this.textureCacheFrameMarkerCount_ > ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK) {
    frameState.postRenderFunctions.push((this.expireCache_.bind(this)));
  }
  if (!this.tileTextureQueue_.isEmpty()) {
    frameState.postRenderFunctions.push(this.loadNextTileTexture_);
    frameState.animate = true;
  }
  this.dispatchComposeEvent_(ol.render.Event.Type.POSTCOMPOSE, frameState);
  this.scheduleRemoveUnusedLayerRenderers(frameState);
  this.scheduleExpireIconCache(frameState);
};
ol.renderer.webgl.Map.prototype.forEachFeatureAtCoordinate = function(coordinate, frameState, callback, thisArg, layerFilter, thisArg2) {
  var result;
  if (this.getGL().isContextLost()) {
    return false;
  }
  var viewState = frameState.viewState;
  var layerStates = frameState.layerStatesArray;
  var numLayers = layerStates.length;
  var i;
  for (i = numLayers - 1;i >= 0;--i) {
    var layerState = layerStates[i];
    var layer = layerState.layer;
    if (ol.layer.Layer.visibleAtResolution(layerState, viewState.resolution) && layerFilter.call(thisArg2, layer)) {
      var layerRenderer = this.getLayerRenderer(layer);
      result = layerRenderer.forEachFeatureAtCoordinate(coordinate, frameState, callback, thisArg);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};
ol.renderer.webgl.Map.prototype.hasFeatureAtCoordinate = function(coordinate, frameState, layerFilter, thisArg) {
  var hasFeature = false;
  if (this.getGL().isContextLost()) {
    return false;
  }
  var viewState = frameState.viewState;
  var layerStates = frameState.layerStatesArray;
  var numLayers = layerStates.length;
  var i;
  for (i = numLayers - 1;i >= 0;--i) {
    var layerState = layerStates[i];
    var layer = layerState.layer;
    if (ol.layer.Layer.visibleAtResolution(layerState, viewState.resolution) && layerFilter.call(thisArg, layer)) {
      var layerRenderer = this.getLayerRenderer(layer);
      hasFeature = layerRenderer.hasFeatureAtCoordinate(coordinate, frameState);
      if (hasFeature) {
        return true;
      }
    }
  }
  return hasFeature;
};
ol.renderer.webgl.Map.prototype.forEachLayerAtPixel = function(pixel, frameState, callback, thisArg, layerFilter, thisArg2) {
  if (this.getGL().isContextLost()) {
    return false;
  }
  var viewState = frameState.viewState;
  var result;
  var layerStates = frameState.layerStatesArray;
  var numLayers = layerStates.length;
  var i;
  for (i = numLayers - 1;i >= 0;--i) {
    var layerState = layerStates[i];
    var layer = layerState.layer;
    if (ol.layer.Layer.visibleAtResolution(layerState, viewState.resolution) && layerFilter.call(thisArg, layer)) {
      var layerRenderer = this.getLayerRenderer(layer);
      result = layerRenderer.forEachLayerAtPixel(pixel, frameState, callback, thisArg);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};
goog.provide("ol.Map");
goog.require("ol");
goog.require("ol.Collection");
goog.require("ol.MapBrowserEvent");
goog.require("ol.MapBrowserEvent.EventType");
goog.require("ol.MapBrowserEventHandler");
goog.require("ol.MapEvent");
goog.require("ol.Object");
goog.require("ol.ObjectEventType");
goog.require("ol.TileQueue");
goog.require("ol.View");
goog.require("ol.array");
goog.require("ol.asserts");
goog.require("ol.control");
goog.require("ol.dom");
goog.require("ol.events");
goog.require("ol.events.Event");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.functions");
goog.require("ol.has");
goog.require("ol.interaction");
goog.require("ol.layer.Group");
goog.require("ol.obj");
goog.require("ol.proj.common");
goog.require("ol.renderer.Type");
goog.require("ol.renderer.Map");
goog.require("ol.renderer.canvas.Map");
goog.require("ol.renderer.webgl.Map");
goog.require("ol.size");
goog.require("ol.structs.PriorityQueue");
goog.require("ol.transform");
ol.OL3_URL = "https://openlayers.org/";
ol.OL3_LOGO_URL = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBI" + "WXMAAAHGAAABxgEXwfpGAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAA" + "AhNQTFRF////AP//AICAgP//AFVVQECA////K1VVSbbbYL/fJ05idsTYJFtbbcjbJllmZszW" + "WMTOIFhoHlNiZszTa9DdUcHNHlNlV8XRIVdiasrUHlZjIVZjaMnVH1RlIFRkH1RkH1ZlasvY" + "asvXVsPQH1VkacnVa8vWIVZjIFRjVMPQa8rXIVVkXsXRsNveIFVkIFZlIVVj3eDeh6GmbMvX" + "H1ZkIFRka8rWbMvXIFVkIFVjIFVkbMvWH1VjbMvWIFVlbcvWIFVla8vVIFVkbMvWbMvVH1Vk" + 
"bMvWIFVlbcvWIFVkbcvVbMvWjNPbIFVkU8LPwMzNIFVkbczWIFVkbsvWbMvXIFVkRnB8bcvW" + "2+TkW8XRIFVkIlZlJVloJlpoKlxrLl9tMmJwOWd0Omh1RXF8TneCT3iDUHiDU8LPVMLPVcLP" + "VcPQVsPPVsPQV8PQWMTQWsTQW8TQXMXSXsXRX4SNX8bSYMfTYcfTYsfTY8jUZcfSZsnUaIqT" + "acrVasrVa8jTa8rWbI2VbMvWbcvWdJObdcvUdszUd8vVeJaee87Yfc3WgJyjhqGnitDYjaar" + "ldPZnrK2oNbborW5o9bbo9fbpLa6q9ndrL3ArtndscDDutzfu8fJwN7gwt7gxc/QyuHhy+Hi" + "zeHi0NfX0+Pj19zb1+Tj2uXk29/e3uLg3+Lh3+bl4uXj4ufl4+fl5Ofl5ufl5ujm5+jmySDn" + "BAAAAFp0Uk5TAAECAgMEBAYHCA0NDg4UGRogIiMmKSssLzU7PkJJT1JTVFliY2hrdHZ3foSF" + 
"hYeJjY2QkpugqbG1tre5w8zQ09XY3uXn6+zx8vT09vf4+Pj5+fr6/P39/f3+gz7SsAAAAVVJ" + "REFUOMtjYKA7EBDnwCPLrObS1BRiLoJLnte6CQy8FLHLCzs2QUG4FjZ5GbcmBDDjxJBXDWxC" + "Brb8aM4zbkIDzpLYnAcE9VXlJSWlZRU13koIeW57mGx5XjoMZEUqwxWYQaQbSzLSkYGfKFSe" + "0QMsX5WbjgY0YS4MBplemI4BdGBW+DQ11eZiymfqQuXZIjqwyadPNoSZ4L+0FVM6e+oGI6g8" + "a9iKNT3o8kVzNkzRg5lgl7p4wyRUL9Yt2jAxVh6mQCogae6GmflI8p0r13VFWTHBQ0rWPW7a" + "hgWVcPm+9cuLoyy4kCJDzCm6d8PSFoh0zvQNC5OjDJhQopPPJqph1doJBUD5tnkbZiUEqaCn" + "B3bTqLTFG1bPn71kw4b+GFdpLElKIzRxxgYgWNYc5SCENVHKeUaltHdXx0dZ8uBI1hJ2UUDg" + 
"q82CM2MwKeibqAvSO7MCABq0wXEPiqWEAAAAAElFTkSuQmCC";
ol.DEFAULT_RENDERER_TYPES = [ol.renderer.Type.CANVAS, ol.renderer.Type.WEBGL];
ol.Map = function(options) {
  ol.Object.call(this);
  var optionsInternal = ol.Map.createOptionsInternal(options);
  this.loadTilesWhileAnimating_ = options.loadTilesWhileAnimating !== undefined ? options.loadTilesWhileAnimating : false;
  this.loadTilesWhileInteracting_ = options.loadTilesWhileInteracting !== undefined ? options.loadTilesWhileInteracting : false;
  this.pixelRatio_ = options.pixelRatio !== undefined ? options.pixelRatio : ol.has.DEVICE_PIXEL_RATIO;
  this.logos_ = optionsInternal.logos;
  this.animationDelayKey_;
  this.animationDelay_ = function() {
    this.animationDelayKey_ = undefined;
    this.renderFrame_.call(this, Date.now());
  }.bind(this);
  this.coordinateToPixelTransform_ = ol.transform.create();
  this.pixelToCoordinateTransform_ = ol.transform.create();
  this.frameIndex_ = 0;
  this.frameState_ = null;
  this.previousExtent_ = ol.extent.createEmpty();
  this.viewPropertyListenerKey_ = null;
  this.layerGroupPropertyListenerKeys_ = null;
  this.viewport_ = document.createElement("DIV");
  this.viewport_.className = "ol-viewport" + (ol.has.TOUCH ? " ol-touch" : "");
  this.viewport_.style.position = "relative";
  this.viewport_.style.overflow = "hidden";
  this.viewport_.style.width = "100%";
  this.viewport_.style.height = "100%";
  this.viewport_.style.msTouchAction = "none";
  this.viewport_.style.touchAction = "none";
  this.overlayContainer_ = document.createElement("DIV");
  this.overlayContainer_.className = "ol-overlaycontainer";
  this.viewport_.appendChild(this.overlayContainer_);
  this.overlayContainerStopEvent_ = document.createElement("DIV");
  this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent";
  var overlayEvents = [ol.events.EventType.CLICK, ol.events.EventType.DBLCLICK, ol.events.EventType.MOUSEDOWN, ol.events.EventType.TOUCHSTART, ol.events.EventType.MSPOINTERDOWN, ol.MapBrowserEvent.EventType.POINTERDOWN, ol.events.EventType.MOUSEWHEEL, ol.events.EventType.WHEEL];
  for (var i = 0, ii = overlayEvents.length;i < ii;++i) {
    ol.events.listen(this.overlayContainerStopEvent_, overlayEvents[i], ol.events.Event.stopPropagation);
  }
  this.viewport_.appendChild(this.overlayContainerStopEvent_);
  this.mapBrowserEventHandler_ = new ol.MapBrowserEventHandler(this);
  for (var key in ol.MapBrowserEvent.EventType) {
    ol.events.listen(this.mapBrowserEventHandler_, ol.MapBrowserEvent.EventType[key], this.handleMapBrowserEvent, this);
  }
  this.keyboardEventTarget_ = optionsInternal.keyboardEventTarget;
  this.keyHandlerKeys_ = null;
  ol.events.listen(this.viewport_, ol.events.EventType.WHEEL, this.handleBrowserEvent, this);
  ol.events.listen(this.viewport_, ol.events.EventType.MOUSEWHEEL, this.handleBrowserEvent, this);
  this.controls_ = optionsInternal.controls;
  this.interactions_ = optionsInternal.interactions;
  this.overlays_ = optionsInternal.overlays;
  this.overlayIdIndex_ = {};
  this.renderer_ = new optionsInternal.rendererConstructor(this.viewport_, this);
  this.handleResize_;
  this.focus_ = null;
  this.preRenderFunctions_ = [];
  this.postRenderFunctions_ = [];
  this.tileQueue_ = new ol.TileQueue(this.getTilePriority.bind(this), this.handleTileChange_.bind(this));
  this.skippedFeatureUids_ = {};
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Map.Property.LAYERGROUP), this.handleLayerGroupChanged_, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Map.Property.VIEW), this.handleViewChanged_, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Map.Property.SIZE), this.handleSizeChanged_, this);
  ol.events.listen(this, ol.Object.getChangeEventType(ol.Map.Property.TARGET), this.handleTargetChanged_, this);
  this.setProperties(optionsInternal.values);
  this.controls_.forEach(function(control) {
    control.setMap(this);
  }, this);
  ol.events.listen(this.controls_, ol.Collection.EventType.ADD, function(event) {
    event.element.setMap(this);
  }, this);
  ol.events.listen(this.controls_, ol.Collection.EventType.REMOVE, function(event) {
    event.element.setMap(null);
  }, this);
  this.interactions_.forEach(function(interaction) {
    interaction.setMap(this);
  }, this);
  ol.events.listen(this.interactions_, ol.Collection.EventType.ADD, function(event) {
    event.element.setMap(this);
  }, this);
  ol.events.listen(this.interactions_, ol.Collection.EventType.REMOVE, function(event) {
    event.element.setMap(null);
  }, this);
  this.overlays_.forEach(this.addOverlayInternal_, this);
  ol.events.listen(this.overlays_, ol.Collection.EventType.ADD, function(event) {
    this.addOverlayInternal_((event.element));
  }, this);
  ol.events.listen(this.overlays_, ol.Collection.EventType.REMOVE, function(event) {
    var overlay = (event.element);
    var id = overlay.getId();
    if (id !== undefined) {
      delete this.overlayIdIndex_[id.toString()];
    }
    event.element.setMap(null);
  }, this);
};
ol.inherits(ol.Map, ol.Object);
ol.Map.prototype.addControl = function(control) {
  this.getControls().push(control);
};
ol.Map.prototype.addInteraction = function(interaction) {
  this.getInteractions().push(interaction);
};
ol.Map.prototype.addLayer = function(layer) {
  var layers = this.getLayerGroup().getLayers();
  layers.push(layer);
};
ol.Map.prototype.addOverlay = function(overlay) {
  this.getOverlays().push(overlay);
};
ol.Map.prototype.addOverlayInternal_ = function(overlay) {
  var id = overlay.getId();
  if (id !== undefined) {
    this.overlayIdIndex_[id.toString()] = overlay;
  }
  overlay.setMap(this);
};
ol.Map.prototype.beforeRender = function(var_args) {
  ol.DEBUG && console.warn("map.beforeRender() is deprecated.  Use view.animate() instead.");
  this.render();
  Array.prototype.push.apply(this.preRenderFunctions_, arguments);
};
ol.Map.prototype.removePreRenderFunction = function(preRenderFunction) {
  return ol.array.remove(this.preRenderFunctions_, preRenderFunction);
};
ol.Map.prototype.disposeInternal = function() {
  this.mapBrowserEventHandler_.dispose();
  this.renderer_.dispose();
  ol.events.unlisten(this.viewport_, ol.events.EventType.WHEEL, this.handleBrowserEvent, this);
  ol.events.unlisten(this.viewport_, ol.events.EventType.MOUSEWHEEL, this.handleBrowserEvent, this);
  if (this.handleResize_ !== undefined) {
    window.removeEventListener(ol.events.EventType.RESIZE, this.handleResize_, false);
    this.handleResize_ = undefined;
  }
  if (this.animationDelayKey_) {
    cancelAnimationFrame(this.animationDelayKey_);
    this.animationDelayKey_ = undefined;
  }
  this.setTarget(null);
  ol.Object.prototype.disposeInternal.call(this);
};
ol.Map.prototype.forEachFeatureAtPixel = function(pixel, callback, opt_this, opt_layerFilter, opt_this2) {
  if (!this.frameState_) {
    return;
  }
  var coordinate = this.getCoordinateFromPixel(pixel);
  var thisArg = opt_this !== undefined ? opt_this : null;
  var layerFilter = opt_layerFilter !== undefined ? opt_layerFilter : ol.functions.TRUE;
  var thisArg2 = opt_this2 !== undefined ? opt_this2 : null;
  return this.renderer_.forEachFeatureAtCoordinate(coordinate, this.frameState_, callback, thisArg, layerFilter, thisArg2);
};
ol.Map.prototype.forEachLayerAtPixel = function(pixel, callback, opt_this, opt_layerFilter, opt_this2) {
  if (!this.frameState_) {
    return;
  }
  var thisArg = opt_this !== undefined ? opt_this : null;
  var layerFilter = opt_layerFilter !== undefined ? opt_layerFilter : ol.functions.TRUE;
  var thisArg2 = opt_this2 !== undefined ? opt_this2 : null;
  return this.renderer_.forEachLayerAtPixel(pixel, this.frameState_, callback, thisArg, layerFilter, thisArg2);
};
ol.Map.prototype.hasFeatureAtPixel = function(pixel, opt_layerFilter, opt_this) {
  if (!this.frameState_) {
    return false;
  }
  var coordinate = this.getCoordinateFromPixel(pixel);
  var layerFilter = opt_layerFilter !== undefined ? opt_layerFilter : ol.functions.TRUE;
  var thisArg = opt_this !== undefined ? opt_this : null;
  return this.renderer_.hasFeatureAtCoordinate(coordinate, this.frameState_, layerFilter, thisArg);
};
ol.Map.prototype.getEventCoordinate = function(event) {
  return this.getCoordinateFromPixel(this.getEventPixel(event));
};
ol.Map.prototype.getEventPixel = function(event) {
  var viewportPosition = this.viewport_.getBoundingClientRect();
  var eventPosition = event.changedTouches ? event.changedTouches[0] : event;
  return [eventPosition.clientX - viewportPosition.left, eventPosition.clientY - viewportPosition.top];
};
ol.Map.prototype.getTarget = function() {
  return (this.get(ol.Map.Property.TARGET));
};
ol.Map.prototype.getTargetElement = function() {
  var target = this.getTarget();
  if (target !== undefined) {
    return typeof target === "string" ? document.getElementById(target) : target;
  } else {
    return null;
  }
};
ol.Map.prototype.getCoordinateFromPixel = function(pixel) {
  var frameState = this.frameState_;
  if (!frameState) {
    return null;
  } else {
    return ol.transform.apply(frameState.pixelToCoordinateTransform, pixel.slice());
  }
};
ol.Map.prototype.getControls = function() {
  return this.controls_;
};
ol.Map.prototype.getOverlays = function() {
  return this.overlays_;
};
ol.Map.prototype.getOverlayById = function(id) {
  var overlay = this.overlayIdIndex_[id.toString()];
  return overlay !== undefined ? overlay : null;
};
ol.Map.prototype.getInteractions = function() {
  return this.interactions_;
};
ol.Map.prototype.getLayerGroup = function() {
  return (this.get(ol.Map.Property.LAYERGROUP));
};
ol.Map.prototype.getLayers = function() {
  var layers = this.getLayerGroup().getLayers();
  return layers;
};
ol.Map.prototype.getPixelFromCoordinate = function(coordinate) {
  var frameState = this.frameState_;
  if (!frameState) {
    return null;
  } else {
    return ol.transform.apply(frameState.coordinateToPixelTransform, coordinate.slice(0, 2));
  }
};
ol.Map.prototype.getRenderer = function() {
  return this.renderer_;
};
ol.Map.prototype.getSize = function() {
  return (this.get(ol.Map.Property.SIZE));
};
ol.Map.prototype.getView = function() {
  return (this.get(ol.Map.Property.VIEW));
};
ol.Map.prototype.getViewport = function() {
  return this.viewport_;
};
ol.Map.prototype.getOverlayContainer = function() {
  return this.overlayContainer_;
};
ol.Map.prototype.getOverlayContainerStopEvent = function() {
  return this.overlayContainerStopEvent_;
};
ol.Map.prototype.getTilePriority = function(tile, tileSourceKey, tileCenter, tileResolution) {
  var frameState = this.frameState_;
  if (!frameState || !(tileSourceKey in frameState.wantedTiles)) {
    return ol.structs.PriorityQueue.DROP;
  }
  if (!frameState.wantedTiles[tileSourceKey][tile.getKey()]) {
    return ol.structs.PriorityQueue.DROP;
  }
  var deltaX = tileCenter[0] - frameState.focus[0];
  var deltaY = tileCenter[1] - frameState.focus[1];
  return 65536 * Math.log(tileResolution) + Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
};
ol.Map.prototype.handleBrowserEvent = function(browserEvent, opt_type) {
  var type = opt_type || browserEvent.type;
  var mapBrowserEvent = new ol.MapBrowserEvent(type, this, browserEvent);
  this.handleMapBrowserEvent(mapBrowserEvent);
};
ol.Map.prototype.handleMapBrowserEvent = function(mapBrowserEvent) {
  if (!this.frameState_) {
    return;
  }
  this.focus_ = mapBrowserEvent.coordinate;
  mapBrowserEvent.frameState = this.frameState_;
  var interactionsArray = this.getInteractions().getArray();
  var i;
  if (this.dispatchEvent(mapBrowserEvent) !== false) {
    for (i = interactionsArray.length - 1;i >= 0;i--) {
      var interaction = interactionsArray[i];
      if (!interaction.getActive()) {
        continue;
      }
      var cont = interaction.handleEvent(mapBrowserEvent);
      if (!cont) {
        break;
      }
    }
  }
};
ol.Map.prototype.handlePostRender = function() {
  var frameState = this.frameState_;
  var tileQueue = this.tileQueue_;
  if (!tileQueue.isEmpty()) {
    var maxTotalLoading = 16;
    var maxNewLoads = maxTotalLoading;
    if (frameState) {
      var hints = frameState.viewHints;
      if (hints[ol.View.Hint.ANIMATING]) {
        maxTotalLoading = this.loadTilesWhileAnimating_ ? 8 : 0;
        maxNewLoads = 2;
      }
      if (hints[ol.View.Hint.INTERACTING]) {
        maxTotalLoading = this.loadTilesWhileInteracting_ ? 8 : 0;
        maxNewLoads = 2;
      }
    }
    if (tileQueue.getTilesLoading() < maxTotalLoading) {
      tileQueue.reprioritize();
      tileQueue.loadMoreTiles(maxTotalLoading, maxNewLoads);
    }
  }
  var postRenderFunctions = this.postRenderFunctions_;
  var i, ii;
  for (i = 0, ii = postRenderFunctions.length;i < ii;++i) {
    postRenderFunctions[i](this, frameState);
  }
  postRenderFunctions.length = 0;
};
ol.Map.prototype.handleSizeChanged_ = function() {
  this.render();
};
ol.Map.prototype.handleTargetChanged_ = function() {
  var targetElement;
  if (this.getTarget()) {
    targetElement = this.getTargetElement();
    ol.DEBUG && console.assert(targetElement !== null, "expects a non-null value for targetElement");
  }
  if (this.keyHandlerKeys_) {
    for (var i = 0, ii = this.keyHandlerKeys_.length;i < ii;++i) {
      ol.events.unlistenByKey(this.keyHandlerKeys_[i]);
    }
    this.keyHandlerKeys_ = null;
  }
  if (!targetElement) {
    ol.dom.removeNode(this.viewport_);
    if (this.handleResize_ !== undefined) {
      window.removeEventListener(ol.events.EventType.RESIZE, this.handleResize_, false);
      this.handleResize_ = undefined;
    }
  } else {
    targetElement.appendChild(this.viewport_);
    var keyboardEventTarget = !this.keyboardEventTarget_ ? targetElement : this.keyboardEventTarget_;
    this.keyHandlerKeys_ = [ol.events.listen(keyboardEventTarget, ol.events.EventType.KEYDOWN, this.handleBrowserEvent, this), ol.events.listen(keyboardEventTarget, ol.events.EventType.KEYPRESS, this.handleBrowserEvent, this)];
    if (!this.handleResize_) {
      this.handleResize_ = this.updateSize.bind(this);
      window.addEventListener(ol.events.EventType.RESIZE, this.handleResize_, false);
    }
  }
  this.updateSize();
};
ol.Map.prototype.handleTileChange_ = function() {
  this.render();
};
ol.Map.prototype.handleViewPropertyChanged_ = function() {
  this.render();
};
ol.Map.prototype.handleViewChanged_ = function() {
  if (this.viewPropertyListenerKey_) {
    ol.events.unlistenByKey(this.viewPropertyListenerKey_);
    this.viewPropertyListenerKey_ = null;
  }
  var view = this.getView();
  if (view) {
    this.viewPropertyListenerKey_ = ol.events.listen(view, ol.ObjectEventType.PROPERTYCHANGE, this.handleViewPropertyChanged_, this);
  }
  this.render();
};
ol.Map.prototype.handleLayerGroupChanged_ = function() {
  if (this.layerGroupPropertyListenerKeys_) {
    this.layerGroupPropertyListenerKeys_.forEach(ol.events.unlistenByKey);
    this.layerGroupPropertyListenerKeys_ = null;
  }
  var layerGroup = this.getLayerGroup();
  if (layerGroup) {
    this.layerGroupPropertyListenerKeys_ = [ol.events.listen(layerGroup, ol.ObjectEventType.PROPERTYCHANGE, this.render, this), ol.events.listen(layerGroup, ol.events.EventType.CHANGE, this.render, this)];
  }
  this.render();
};
ol.Map.prototype.isRendered = function() {
  return !!this.frameState_;
};
ol.Map.prototype.renderSync = function() {
  if (this.animationDelayKey_) {
    cancelAnimationFrame(this.animationDelayKey_);
  }
  this.animationDelay_();
};
ol.Map.prototype.render = function() {
  if (this.animationDelayKey_ === undefined) {
    this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_);
  }
};
ol.Map.prototype.removeControl = function(control) {
  return this.getControls().remove(control);
};
ol.Map.prototype.removeInteraction = function(interaction) {
  return this.getInteractions().remove(interaction);
};
ol.Map.prototype.removeLayer = function(layer) {
  var layers = this.getLayerGroup().getLayers();
  return layers.remove(layer);
};
ol.Map.prototype.removeOverlay = function(overlay) {
  return this.getOverlays().remove(overlay);
};
ol.Map.prototype.renderFrame_ = function(time) {
  var i, ii, viewState;
  var size = this.getSize();
  var view = this.getView();
  var extent = ol.extent.createEmpty();
  var frameState = null;
  if (size !== undefined && ol.size.hasArea(size) && view && view.isDef()) {
    var viewHints = view.getHints(this.frameState_ ? this.frameState_.viewHints : undefined);
    var layerStatesArray = this.getLayerGroup().getLayerStatesArray();
    var layerStates = {};
    for (i = 0, ii = layerStatesArray.length;i < ii;++i) {
      layerStates[ol.getUid(layerStatesArray[i].layer)] = layerStatesArray[i];
    }
    viewState = view.getState();
    frameState = ({animate:false, attributions:{}, coordinateToPixelTransform:this.coordinateToPixelTransform_, extent:extent, focus:!this.focus_ ? viewState.center : this.focus_, index:this.frameIndex_++, layerStates:layerStates, layerStatesArray:layerStatesArray, logos:ol.obj.assign({}, this.logos_), pixelRatio:this.pixelRatio_, pixelToCoordinateTransform:this.pixelToCoordinateTransform_, postRenderFunctions:[], size:size, skippedFeatureUids:this.skippedFeatureUids_, tileQueue:this.tileQueue_, 
    time:time, usedTiles:{}, viewState:viewState, viewHints:viewHints, wantedTiles:{}});
  }
  if (frameState) {
    var preRenderFunctions = this.preRenderFunctions_;
    var n = 0, preRenderFunction;
    for (i = 0, ii = preRenderFunctions.length;i < ii;++i) {
      preRenderFunction = preRenderFunctions[i];
      if (preRenderFunction(this, frameState)) {
        preRenderFunctions[n++] = preRenderFunction;
      }
    }
    preRenderFunctions.length = n;
    frameState.extent = ol.extent.getForViewAndSize(viewState.center, viewState.resolution, viewState.rotation, frameState.size, extent);
  }
  this.frameState_ = frameState;
  this.renderer_.renderFrame(frameState);
  if (frameState) {
    if (frameState.animate) {
      this.render();
    }
    Array.prototype.push.apply(this.postRenderFunctions_, frameState.postRenderFunctions);
    var idle = this.preRenderFunctions_.length === 0 && !frameState.viewHints[ol.View.Hint.ANIMATING] && !frameState.viewHints[ol.View.Hint.INTERACTING] && !ol.extent.equals(frameState.extent, this.previousExtent_);
    if (idle) {
      this.dispatchEvent(new ol.MapEvent(ol.MapEvent.Type.MOVEEND, this, frameState));
      ol.extent.clone(frameState.extent, this.previousExtent_);
    }
  }
  this.dispatchEvent(new ol.MapEvent(ol.MapEvent.Type.POSTRENDER, this, frameState));
  setTimeout(this.handlePostRender.bind(this), 0);
};
ol.Map.prototype.setLayerGroup = function(layerGroup) {
  this.set(ol.Map.Property.LAYERGROUP, layerGroup);
};
ol.Map.prototype.setSize = function(size) {
  this.set(ol.Map.Property.SIZE, size);
};
ol.Map.prototype.setTarget = function(target) {
  this.set(ol.Map.Property.TARGET, target);
};
ol.Map.prototype.setView = function(view) {
  this.set(ol.Map.Property.VIEW, view);
};
ol.Map.prototype.skipFeature = function(feature) {
  var featureUid = ol.getUid(feature).toString();
  this.skippedFeatureUids_[featureUid] = true;
  this.render();
};
ol.Map.prototype.updateSize = function() {
  var targetElement = this.getTargetElement();
  if (!targetElement) {
    this.setSize(undefined);
  } else {
    var computedStyle = getComputedStyle(targetElement);
    this.setSize([targetElement.offsetWidth - parseFloat(computedStyle["borderLeftWidth"]) - parseFloat(computedStyle["paddingLeft"]) - parseFloat(computedStyle["paddingRight"]) - parseFloat(computedStyle["borderRightWidth"]), targetElement.offsetHeight - parseFloat(computedStyle["borderTopWidth"]) - parseFloat(computedStyle["paddingTop"]) - parseFloat(computedStyle["paddingBottom"]) - parseFloat(computedStyle["borderBottomWidth"])]);
  }
};
ol.Map.prototype.unskipFeature = function(feature) {
  var featureUid = ol.getUid(feature).toString();
  delete this.skippedFeatureUids_[featureUid];
  this.render();
};
ol.Map.createOptionsInternal = function(options) {
  var keyboardEventTarget = null;
  if (options.keyboardEventTarget !== undefined) {
    keyboardEventTarget = typeof options.keyboardEventTarget === "string" ? document.getElementById(options.keyboardEventTarget) : options.keyboardEventTarget;
  }
  var values = {};
  var logos = {};
  if (options.logo === undefined || typeof options.logo === "boolean" && options.logo) {
    logos[ol.OL3_LOGO_URL] = ol.OL3_URL;
  } else {
    var logo = options.logo;
    if (typeof logo === "string") {
      logos[logo] = "";
    } else {
      if (logo instanceof HTMLElement) {
        logos[ol.getUid(logo).toString()] = logo;
      } else {
        if (logo) {
          ol.asserts.assert(typeof logo.href == "string", 44);
          ol.asserts.assert(typeof logo.src == "string", 45);
          logos[logo.src] = logo.href;
        }
      }
    }
  }
  var layerGroup = options.layers instanceof ol.layer.Group ? options.layers : new ol.layer.Group({layers:options.layers});
  values[ol.Map.Property.LAYERGROUP] = layerGroup;
  values[ol.Map.Property.TARGET] = options.target;
  values[ol.Map.Property.VIEW] = options.view !== undefined ? options.view : new ol.View;
  var rendererConstructor = ol.renderer.Map;
  var rendererTypes;
  if (options.renderer !== undefined) {
    if (Array.isArray(options.renderer)) {
      rendererTypes = options.renderer;
    } else {
      if (typeof options.renderer === "string") {
        rendererTypes = [options.renderer];
      } else {
        ol.asserts.assert(false, 46);
      }
    }
    if (rendererTypes.indexOf(("dom")) >= 0) {
      ol.DEBUG && console.assert(false, "The DOM render has been removed");
      rendererTypes = rendererTypes.concat(ol.DEFAULT_RENDERER_TYPES);
    }
  } else {
    rendererTypes = ol.DEFAULT_RENDERER_TYPES;
  }
  var i, ii;
  for (i = 0, ii = rendererTypes.length;i < ii;++i) {
    var rendererType = rendererTypes[i];
    if (ol.ENABLE_CANVAS && rendererType == ol.renderer.Type.CANVAS) {
      if (ol.has.CANVAS) {
        rendererConstructor = ol.renderer.canvas.Map;
        break;
      }
    } else {
      if (ol.ENABLE_WEBGL && rendererType == ol.renderer.Type.WEBGL) {
        if (ol.has.WEBGL) {
          rendererConstructor = ol.renderer.webgl.Map;
          break;
        }
      }
    }
  }
  var controls;
  if (options.controls !== undefined) {
    if (Array.isArray(options.controls)) {
      controls = new ol.Collection(options.controls.slice());
    } else {
      ol.asserts.assert(options.controls instanceof ol.Collection, 47);
      controls = options.controls;
    }
  } else {
    controls = ol.control.defaults();
  }
  var interactions;
  if (options.interactions !== undefined) {
    if (Array.isArray(options.interactions)) {
      interactions = new ol.Collection(options.interactions.slice());
    } else {
      ol.asserts.assert(options.interactions instanceof ol.Collection, 48);
      interactions = options.interactions;
    }
  } else {
    interactions = ol.interaction.defaults();
  }
  var overlays;
  if (options.overlays !== undefined) {
    if (Array.isArray(options.overlays)) {
      overlays = new ol.Collection(options.overlays.slice());
    } else {
      ol.asserts.assert(options.overlays instanceof ol.Collection, 49);
      overlays = options.overlays;
    }
  } else {
    overlays = new ol.Collection;
  }
  return {controls:controls, interactions:interactions, keyboardEventTarget:keyboardEventTarget, logos:logos, overlays:overlays, rendererConstructor:rendererConstructor, values:values};
};
ol.Map.Property = {LAYERGROUP:"layergroup", SIZE:"size", TARGET:"target", VIEW:"view"};
ol.proj.common.add();
goog.provide("ngeo.search.searchDirective");
ngeo.search.searchDirective = function() {
  return {restrict:"A", link:function(scope, element, attrs) {
    var typeaheadOptionsExpr = attrs["ngeoSearch"];
    var typeaheadOptions = (scope.$eval(typeaheadOptionsExpr));
    var typeaheadDatasetsExpr = attrs["ngeoSearchDatasets"];
    var typeaheadDatasets = (scope.$eval(typeaheadDatasetsExpr));
    var args = typeaheadDatasets.slice();
    args.unshift(typeaheadOptions);
    element.typeahead.apply(element, args);
    var typeaheadListenersExpr = attrs["ngeoSearchListeners"];
    var typeaheadListeners_ = (scope.$eval(typeaheadListenersExpr));
    var typeaheadListeners = ngeo.search.searchDirective.adaptListeners_(typeaheadListeners_);
    element.on("typeahead:open", function() {
      scope.$apply(function() {
        typeaheadListeners.open();
      });
    });
    element.on("typeahead:close", function() {
      scope.$apply(function() {
        typeaheadListeners.close();
      });
    });
    element.on("typeahead:cursorchange", function(event, suggestion, dataset) {
      scope.$apply(function() {
        typeaheadListeners.cursorchange(event, suggestion, dataset);
      });
    });
    element.on("typeahead:select", function(event, suggestion, dataset) {
      scope.$apply(function() {
        typeaheadListeners.select(event, suggestion, dataset);
      });
    });
    element.on("typeahead:autocomplete", function(event, suggestion, dataset) {
      scope.$apply(function() {
        typeaheadListeners.autocomplete(event, suggestion, dataset);
      });
    });
  }};
};
ngeo.search.searchDirective.adaptListeners_ = function(object) {
  var typeaheadListeners;
  if (object === undefined) {
    typeaheadListeners = {open:ol.nullFunction, close:ol.nullFunction, cursorchange:ol.nullFunction, select:ol.nullFunction, autocomplete:ol.nullFunction};
  } else {
    typeaheadListeners = {open:object.open !== undefined ? object.open : ol.nullFunction, close:object.close !== undefined ? object.close : ol.nullFunction, cursorchange:object.cursorchange !== undefined ? object.cursorchange : ol.nullFunction, select:object.select !== undefined ? object.select : ol.nullFunction, autocomplete:object.autocomplete !== undefined ? object.autocomplete : ol.nullFunction};
  }
  return typeaheadListeners;
};
ngeo.search.searchDirective.module = angular.module("ngeoSearchDirective", []);
ngeo.search.searchDirective.module.directive("ngeoSearch", ngeo.search.searchDirective);
goog.provide("ol.format.JSONFeature");
goog.require("ol");
goog.require("ol.format.Feature");
goog.require("ol.format.FormatType");
ol.format.JSONFeature = function() {
  ol.format.Feature.call(this);
};
ol.inherits(ol.format.JSONFeature, ol.format.Feature);
ol.format.JSONFeature.prototype.getObject_ = function(source) {
  if (typeof source === "string") {
    var object = JSON.parse(source);
    return object ? (object) : null;
  } else {
    if (source !== null) {
      return source;
    } else {
      return null;
    }
  }
};
ol.format.JSONFeature.prototype.getType = function() {
  return ol.format.FormatType.JSON;
};
ol.format.JSONFeature.prototype.readFeature = function(source, opt_options) {
  return this.readFeatureFromObject(this.getObject_(source), this.getReadOptions(source, opt_options));
};
ol.format.JSONFeature.prototype.readFeatures = function(source, opt_options) {
  return this.readFeaturesFromObject(this.getObject_(source), this.getReadOptions(source, opt_options));
};
ol.format.JSONFeature.prototype.readFeatureFromObject = function(object, opt_options) {
};
ol.format.JSONFeature.prototype.readFeaturesFromObject = function(object, opt_options) {
};
ol.format.JSONFeature.prototype.readGeometry = function(source, opt_options) {
  return this.readGeometryFromObject(this.getObject_(source), this.getReadOptions(source, opt_options));
};
ol.format.JSONFeature.prototype.readGeometryFromObject = function(object, opt_options) {
};
ol.format.JSONFeature.prototype.readProjection = function(source) {
  return this.readProjectionFromObject(this.getObject_(source));
};
ol.format.JSONFeature.prototype.readProjectionFromObject = function(object) {
};
ol.format.JSONFeature.prototype.writeFeature = function(feature, opt_options) {
  return JSON.stringify(this.writeFeatureObject(feature, opt_options));
};
ol.format.JSONFeature.prototype.writeFeatureObject = function(feature, opt_options) {
};
ol.format.JSONFeature.prototype.writeFeatures = function(features, opt_options) {
  return JSON.stringify(this.writeFeaturesObject(features, opt_options));
};
ol.format.JSONFeature.prototype.writeFeaturesObject = function(features, opt_options) {
};
ol.format.JSONFeature.prototype.writeGeometry = function(geometry, opt_options) {
  return JSON.stringify(this.writeGeometryObject(geometry, opt_options));
};
ol.format.JSONFeature.prototype.writeGeometryObject = function(geometry, opt_options) {
};
goog.provide("ol.geom.GeometryCollection");
goog.require("ol");
goog.require("ol.events");
goog.require("ol.events.EventType");
goog.require("ol.extent");
goog.require("ol.geom.Geometry");
goog.require("ol.geom.GeometryType");
goog.require("ol.obj");
ol.geom.GeometryCollection = function(opt_geometries) {
  ol.geom.Geometry.call(this);
  this.geometries_ = opt_geometries ? opt_geometries : null;
  this.listenGeometriesChange_();
};
ol.inherits(ol.geom.GeometryCollection, ol.geom.Geometry);
ol.geom.GeometryCollection.cloneGeometries_ = function(geometries) {
  var clonedGeometries = [];
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    clonedGeometries.push(geometries[i].clone());
  }
  return clonedGeometries;
};
ol.geom.GeometryCollection.prototype.unlistenGeometriesChange_ = function() {
  var i, ii;
  if (!this.geometries_) {
    return;
  }
  for (i = 0, ii = this.geometries_.length;i < ii;++i) {
    ol.events.unlisten(this.geometries_[i], ol.events.EventType.CHANGE, this.changed, this);
  }
};
ol.geom.GeometryCollection.prototype.listenGeometriesChange_ = function() {
  var i, ii;
  if (!this.geometries_) {
    return;
  }
  for (i = 0, ii = this.geometries_.length;i < ii;++i) {
    ol.events.listen(this.geometries_[i], ol.events.EventType.CHANGE, this.changed, this);
  }
};
ol.geom.GeometryCollection.prototype.clone = function() {
  var geometryCollection = new ol.geom.GeometryCollection(null);
  geometryCollection.setGeometries(this.geometries_);
  return geometryCollection;
};
ol.geom.GeometryCollection.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  var geometries = this.geometries_;
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    minSquaredDistance = geometries[i].closestPointXY(x, y, closestPoint, minSquaredDistance);
  }
  return minSquaredDistance;
};
ol.geom.GeometryCollection.prototype.containsXY = function(x, y) {
  var geometries = this.geometries_;
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    if (geometries[i].containsXY(x, y)) {
      return true;
    }
  }
  return false;
};
ol.geom.GeometryCollection.prototype.computeExtent = function(extent) {
  ol.extent.createOrUpdateEmpty(extent);
  var geometries = this.geometries_;
  for (var i = 0, ii = geometries.length;i < ii;++i) {
    ol.extent.extend(extent, geometries[i].getExtent());
  }
  return extent;
};
ol.geom.GeometryCollection.prototype.getGeometries = function() {
  return ol.geom.GeometryCollection.cloneGeometries_(this.geometries_);
};
ol.geom.GeometryCollection.prototype.getGeometriesArray = function() {
  return this.geometries_;
};
ol.geom.GeometryCollection.prototype.getSimplifiedGeometry = function(squaredTolerance) {
  if (this.simplifiedGeometryRevision != this.getRevision()) {
    ol.obj.clear(this.simplifiedGeometryCache);
    this.simplifiedGeometryMaxMinSquaredTolerance = 0;
    this.simplifiedGeometryRevision = this.getRevision();
  }
  if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) {
    return this;
  }
  var key = squaredTolerance.toString();
  if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
    return this.simplifiedGeometryCache[key];
  } else {
    var simplifiedGeometries = [];
    var geometries = this.geometries_;
    var simplified = false;
    var i, ii;
    for (i = 0, ii = geometries.length;i < ii;++i) {
      var geometry = geometries[i];
      var simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
      simplifiedGeometries.push(simplifiedGeometry);
      if (simplifiedGeometry !== geometry) {
        simplified = true;
      }
    }
    if (simplified) {
      var simplifiedGeometryCollection = new ol.geom.GeometryCollection(null);
      simplifiedGeometryCollection.setGeometriesArray(simplifiedGeometries);
      this.simplifiedGeometryCache[key] = simplifiedGeometryCollection;
      return simplifiedGeometryCollection;
    } else {
      this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
      return this;
    }
  }
};
ol.geom.GeometryCollection.prototype.getType = function() {
  return ol.geom.GeometryType.GEOMETRY_COLLECTION;
};
ol.geom.GeometryCollection.prototype.intersectsExtent = function(extent) {
  var geometries = this.geometries_;
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    if (geometries[i].intersectsExtent(extent)) {
      return true;
    }
  }
  return false;
};
ol.geom.GeometryCollection.prototype.isEmpty = function() {
  return this.geometries_.length === 0;
};
ol.geom.GeometryCollection.prototype.rotate = function(angle, anchor) {
  var geometries = this.geometries_;
  for (var i = 0, ii = geometries.length;i < ii;++i) {
    geometries[i].rotate(angle, anchor);
  }
  this.changed();
};
ol.geom.GeometryCollection.prototype.scale = function(sx, opt_sy, opt_anchor) {
  var anchor = opt_anchor;
  if (!anchor) {
    anchor = ol.extent.getCenter(this.getExtent());
  }
  var geometries = this.geometries_;
  for (var i = 0, ii = geometries.length;i < ii;++i) {
    geometries[i].scale(sx, opt_sy, anchor);
  }
  this.changed();
};
ol.geom.GeometryCollection.prototype.setGeometries = function(geometries) {
  this.setGeometriesArray(ol.geom.GeometryCollection.cloneGeometries_(geometries));
};
ol.geom.GeometryCollection.prototype.setGeometriesArray = function(geometries) {
  this.unlistenGeometriesChange_();
  this.geometries_ = geometries;
  this.listenGeometriesChange_();
  this.changed();
};
ol.geom.GeometryCollection.prototype.applyTransform = function(transformFn) {
  var geometries = this.geometries_;
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    geometries[i].applyTransform(transformFn);
  }
  this.changed();
};
ol.geom.GeometryCollection.prototype.translate = function(deltaX, deltaY) {
  var geometries = this.geometries_;
  var i, ii;
  for (i = 0, ii = geometries.length;i < ii;++i) {
    geometries[i].translate(deltaX, deltaY);
  }
  this.changed();
};
ol.geom.GeometryCollection.prototype.disposeInternal = function() {
  this.unlistenGeometriesChange_();
  ol.geom.Geometry.prototype.disposeInternal.call(this);
};
goog.provide("ol.geom.MultiLineString");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.LineString");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.closest");
goog.require("ol.geom.flat.deflate");
goog.require("ol.geom.flat.inflate");
goog.require("ol.geom.flat.interpolate");
goog.require("ol.geom.flat.intersectsextent");
goog.require("ol.geom.flat.simplify");
ol.geom.MultiLineString = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.ends_ = [];
  this.maxDelta_ = -1;
  this.maxDeltaRevision_ = -1;
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.MultiLineString, ol.geom.SimpleGeometry);
ol.geom.MultiLineString.prototype.appendLineString = function(lineString) {
  ol.DEBUG && console.assert(lineString.getLayout() == this.layout, "layout of lineString should match the layout");
  if (!this.flatCoordinates) {
    this.flatCoordinates = lineString.getFlatCoordinates().slice();
  } else {
    ol.array.extend(this.flatCoordinates, lineString.getFlatCoordinates().slice());
  }
  this.ends_.push(this.flatCoordinates.length);
  this.changed();
};
ol.geom.MultiLineString.prototype.clone = function() {
  var multiLineString = new ol.geom.MultiLineString(null);
  multiLineString.setFlatCoordinates(this.layout, this.flatCoordinates.slice(), this.ends_.slice());
  return multiLineString;
};
ol.geom.MultiLineString.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getsMaxSquaredDelta(this.flatCoordinates, 0, this.ends_, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getsClosestPoint(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
};
ol.geom.MultiLineString.prototype.getCoordinateAtM = function(m, opt_extrapolate, opt_interpolate) {
  if (this.layout != ol.geom.GeometryLayout.XYM && this.layout != ol.geom.GeometryLayout.XYZM || this.flatCoordinates.length === 0) {
    return null;
  }
  var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
  var interpolate = opt_interpolate !== undefined ? opt_interpolate : false;
  return ol.geom.flat.lineStringsCoordinateAtM(this.flatCoordinates, 0, this.ends_, this.stride, m, extrapolate, interpolate);
};
ol.geom.MultiLineString.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinatess(this.flatCoordinates, 0, this.ends_, this.stride);
};
ol.geom.MultiLineString.prototype.getEnds = function() {
  return this.ends_;
};
ol.geom.MultiLineString.prototype.getLineString = function(index) {
  ol.DEBUG && console.assert(0 <= index && index < this.ends_.length, "index should be in between 0 and length of the this.ends_ array");
  if (index < 0 || this.ends_.length <= index) {
    return null;
  }
  var lineString = new ol.geom.LineString(null);
  lineString.setFlatCoordinates(this.layout, this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]));
  return lineString;
};
ol.geom.MultiLineString.prototype.getLineStrings = function() {
  var flatCoordinates = this.flatCoordinates;
  var ends = this.ends_;
  var layout = this.layout;
  var lineStrings = [];
  var offset = 0;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    var lineString = new ol.geom.LineString(null);
    lineString.setFlatCoordinates(layout, flatCoordinates.slice(offset, end));
    lineStrings.push(lineString);
    offset = end;
  }
  return lineStrings;
};
ol.geom.MultiLineString.prototype.getFlatMidpoints = function() {
  var midpoints = [];
  var flatCoordinates = this.flatCoordinates;
  var offset = 0;
  var ends = this.ends_;
  var stride = this.stride;
  var i, ii;
  for (i = 0, ii = ends.length;i < ii;++i) {
    var end = ends[i];
    var midpoint = ol.geom.flat.interpolate.lineString(flatCoordinates, offset, end, stride, .5);
    ol.array.extend(midpoints, midpoint);
    offset = end;
  }
  return midpoints;
};
ol.geom.MultiLineString.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  var simplifiedEnds = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.douglasPeuckers(this.flatCoordinates, 0, this.ends_, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0, simplifiedEnds);
  var simplifiedMultiLineString = new ol.geom.MultiLineString(null);
  simplifiedMultiLineString.setFlatCoordinates(ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEnds);
  return simplifiedMultiLineString;
};
ol.geom.MultiLineString.prototype.getType = function() {
  return ol.geom.GeometryType.MULTI_LINE_STRING;
};
ol.geom.MultiLineString.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.lineStrings(this.flatCoordinates, 0, this.ends_, this.stride, extent);
};
ol.geom.MultiLineString.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ends_);
  } else {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = ol.geom.flat.deflate.coordinatess(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
};
ol.geom.MultiLineString.prototype.setFlatCoordinates = function(layout, flatCoordinates, ends) {
  if (!flatCoordinates) {
    ol.DEBUG && console.assert(ends && ends.length === 0, "ends must be truthy and ends.length should be 0");
  } else {
    if (ends.length === 0) {
      ol.DEBUG && console.assert(flatCoordinates.length === 0, "flatCoordinates should be an empty array");
    } else {
      ol.DEBUG && console.assert(flatCoordinates.length == ends[ends.length - 1], "length of flatCoordinates array should match the last value of ends");
    }
  }
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.ends_ = ends;
  this.changed();
};
ol.geom.MultiLineString.prototype.setLineStrings = function(lineStrings) {
  var layout = this.getLayout();
  var flatCoordinates = [];
  var ends = [];
  var i, ii;
  for (i = 0, ii = lineStrings.length;i < ii;++i) {
    var lineString = lineStrings[i];
    if (i === 0) {
      layout = lineString.getLayout();
    } else {
      ol.DEBUG && console.assert(lineString.getLayout() == layout, "layout of lineString should match layout");
    }
    ol.array.extend(flatCoordinates, lineString.getFlatCoordinates());
    ends.push(flatCoordinates.length);
  }
  this.setFlatCoordinates(layout, flatCoordinates, ends);
};
goog.provide("ol.geom.MultiPoint");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.Point");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.deflate");
goog.require("ol.geom.flat.inflate");
goog.require("ol.math");
ol.geom.MultiPoint = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.MultiPoint, ol.geom.SimpleGeometry);
ol.geom.MultiPoint.prototype.appendPoint = function(point) {
  ol.DEBUG && console.assert(point.getLayout() == this.layout, "the layout of point should match layout");
  if (!this.flatCoordinates) {
    this.flatCoordinates = point.getFlatCoordinates().slice();
  } else {
    ol.array.extend(this.flatCoordinates, point.getFlatCoordinates());
  }
  this.changed();
};
ol.geom.MultiPoint.prototype.clone = function() {
  var multiPoint = new ol.geom.MultiPoint(null);
  multiPoint.setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return multiPoint;
};
ol.geom.MultiPoint.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  var flatCoordinates = this.flatCoordinates;
  var stride = this.stride;
  var i, ii, j;
  for (i = 0, ii = flatCoordinates.length;i < ii;i += stride) {
    var squaredDistance = ol.math.squaredDistance(x, y, flatCoordinates[i], flatCoordinates[i + 1]);
    if (squaredDistance < minSquaredDistance) {
      minSquaredDistance = squaredDistance;
      for (j = 0;j < stride;++j) {
        closestPoint[j] = flatCoordinates[i + j];
      }
      closestPoint.length = stride;
    }
  }
  return minSquaredDistance;
};
ol.geom.MultiPoint.prototype.getCoordinates = function() {
  return ol.geom.flat.inflate.coordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
};
ol.geom.MultiPoint.prototype.getPoint = function(index) {
  var n = !this.flatCoordinates ? 0 : this.flatCoordinates.length / this.stride;
  ol.DEBUG && console.assert(0 <= index && index < n, "index should be in between 0 and n");
  if (index < 0 || n <= index) {
    return null;
  }
  var point = new ol.geom.Point(null);
  point.setFlatCoordinates(this.layout, this.flatCoordinates.slice(index * this.stride, (index + 1) * this.stride));
  return point;
};
ol.geom.MultiPoint.prototype.getPoints = function() {
  var flatCoordinates = this.flatCoordinates;
  var layout = this.layout;
  var stride = this.stride;
  var points = [];
  var i, ii;
  for (i = 0, ii = flatCoordinates.length;i < ii;i += stride) {
    var point = new ol.geom.Point(null);
    point.setFlatCoordinates(layout, flatCoordinates.slice(i, i + stride));
    points.push(point);
  }
  return points;
};
ol.geom.MultiPoint.prototype.getType = function() {
  return ol.geom.GeometryType.MULTI_POINT;
};
ol.geom.MultiPoint.prototype.intersectsExtent = function(extent) {
  var flatCoordinates = this.flatCoordinates;
  var stride = this.stride;
  var i, ii, x, y;
  for (i = 0, ii = flatCoordinates.length;i < ii;i += stride) {
    x = flatCoordinates[i];
    y = flatCoordinates[i + 1];
    if (ol.extent.containsXY(extent, x, y)) {
      return true;
    }
  }
  return false;
};
ol.geom.MultiPoint.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null);
  } else {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = ol.geom.flat.deflate.coordinates(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  }
};
ol.geom.MultiPoint.prototype.setFlatCoordinates = function(layout, flatCoordinates) {
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.changed();
};
goog.provide("ol.geom.flat.center");
goog.require("ol.extent");
ol.geom.flat.center.linearRingss = function(flatCoordinates, offset, endss, stride) {
  var flatCenters = [];
  var i, ii;
  var extent = ol.extent.createEmpty();
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i];
    extent = ol.extent.createOrUpdateFromFlatCoordinates(flatCoordinates, offset, ends[0], stride);
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
    offset = ends[ends.length - 1];
  }
  return flatCenters;
};
goog.provide("ol.geom.MultiPolygon");
goog.require("ol");
goog.require("ol.array");
goog.require("ol.extent");
goog.require("ol.geom.GeometryLayout");
goog.require("ol.geom.GeometryType");
goog.require("ol.geom.MultiPoint");
goog.require("ol.geom.Polygon");
goog.require("ol.geom.SimpleGeometry");
goog.require("ol.geom.flat.area");
goog.require("ol.geom.flat.center");
goog.require("ol.geom.flat.closest");
goog.require("ol.geom.flat.contains");
goog.require("ol.geom.flat.deflate");
goog.require("ol.geom.flat.inflate");
goog.require("ol.geom.flat.interiorpoint");
goog.require("ol.geom.flat.intersectsextent");
goog.require("ol.geom.flat.orient");
goog.require("ol.geom.flat.simplify");
ol.geom.MultiPolygon = function(coordinates, opt_layout) {
  ol.geom.SimpleGeometry.call(this);
  this.endss_ = [];
  this.flatInteriorPointsRevision_ = -1;
  this.flatInteriorPoints_ = null;
  this.maxDelta_ = -1;
  this.maxDeltaRevision_ = -1;
  this.orientedRevision_ = -1;
  this.orientedFlatCoordinates_ = null;
  this.setCoordinates(coordinates, opt_layout);
};
ol.inherits(ol.geom.MultiPolygon, ol.geom.SimpleGeometry);
ol.geom.MultiPolygon.prototype.appendPolygon = function(polygon) {
  ol.DEBUG && console.assert(polygon.getLayout() == this.layout, "layout of polygon should match layout");
  var ends;
  if (!this.flatCoordinates) {
    this.flatCoordinates = polygon.getFlatCoordinates().slice();
    ends = polygon.getEnds().slice();
    this.endss_.push();
  } else {
    var offset = this.flatCoordinates.length;
    ol.array.extend(this.flatCoordinates, polygon.getFlatCoordinates());
    ends = polygon.getEnds().slice();
    var i, ii;
    for (i = 0, ii = ends.length;i < ii;++i) {
      ends[i] += offset;
    }
  }
  this.endss_.push(ends);
  this.changed();
};
ol.geom.MultiPolygon.prototype.clone = function() {
  var multiPolygon = new ol.geom.MultiPolygon(null);
  var len = this.endss_.length;
  var newEndss = new Array(len);
  for (var i = 0;i < len;++i) {
    newEndss[i] = this.endss_[i].slice();
  }
  multiPolygon.setFlatCoordinates(this.layout, this.flatCoordinates.slice(), newEndss);
  return multiPolygon;
};
ol.geom.MultiPolygon.prototype.closestPointXY = function(x, y, closestPoint, minSquaredDistance) {
  if (minSquaredDistance < ol.extent.closestSquaredDistanceXY(this.getExtent(), x, y)) {
    return minSquaredDistance;
  }
  if (this.maxDeltaRevision_ != this.getRevision()) {
    this.maxDelta_ = Math.sqrt(ol.geom.flat.closest.getssMaxSquaredDelta(this.flatCoordinates, 0, this.endss_, this.stride, 0));
    this.maxDeltaRevision_ = this.getRevision();
  }
  return ol.geom.flat.closest.getssClosestPoint(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
};
ol.geom.MultiPolygon.prototype.containsXY = function(x, y) {
  return ol.geom.flat.contains.linearRingssContainsXY(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, x, y);
};
ol.geom.MultiPolygon.prototype.getArea = function() {
  return ol.geom.flat.area.linearRingss(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride);
};
ol.geom.MultiPolygon.prototype.getCoordinates = function(opt_right) {
  var flatCoordinates;
  if (opt_right !== undefined) {
    flatCoordinates = this.getOrientedFlatCoordinates().slice();
    ol.geom.flat.orient.orientLinearRingss(flatCoordinates, 0, this.endss_, this.stride, opt_right);
  } else {
    flatCoordinates = this.flatCoordinates;
  }
  return ol.geom.flat.inflate.coordinatesss(flatCoordinates, 0, this.endss_, this.stride);
};
ol.geom.MultiPolygon.prototype.getEndss = function() {
  return this.endss_;
};
ol.geom.MultiPolygon.prototype.getFlatInteriorPoints = function() {
  if (this.flatInteriorPointsRevision_ != this.getRevision()) {
    var flatCenters = ol.geom.flat.center.linearRingss(this.flatCoordinates, 0, this.endss_, this.stride);
    this.flatInteriorPoints_ = ol.geom.flat.interiorpoint.linearRingss(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, flatCenters);
    this.flatInteriorPointsRevision_ = this.getRevision();
  }
  return this.flatInteriorPoints_;
};
ol.geom.MultiPolygon.prototype.getInteriorPoints = function() {
  var interiorPoints = new ol.geom.MultiPoint(null);
  interiorPoints.setFlatCoordinates(ol.geom.GeometryLayout.XY, this.getFlatInteriorPoints().slice());
  return interiorPoints;
};
ol.geom.MultiPolygon.prototype.getOrientedFlatCoordinates = function() {
  if (this.orientedRevision_ != this.getRevision()) {
    var flatCoordinates = this.flatCoordinates;
    if (ol.geom.flat.orient.linearRingssAreOriented(flatCoordinates, 0, this.endss_, this.stride)) {
      this.orientedFlatCoordinates_ = flatCoordinates;
    } else {
      this.orientedFlatCoordinates_ = flatCoordinates.slice();
      this.orientedFlatCoordinates_.length = ol.geom.flat.orient.orientLinearRingss(this.orientedFlatCoordinates_, 0, this.endss_, this.stride);
    }
    this.orientedRevision_ = this.getRevision();
  }
  return this.orientedFlatCoordinates_;
};
ol.geom.MultiPolygon.prototype.getSimplifiedGeometryInternal = function(squaredTolerance) {
  var simplifiedFlatCoordinates = [];
  var simplifiedEndss = [];
  simplifiedFlatCoordinates.length = ol.geom.flat.simplify.quantizess(this.flatCoordinates, 0, this.endss_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEndss);
  var simplifiedMultiPolygon = new ol.geom.MultiPolygon(null);
  simplifiedMultiPolygon.setFlatCoordinates(ol.geom.GeometryLayout.XY, simplifiedFlatCoordinates, simplifiedEndss);
  return simplifiedMultiPolygon;
};
ol.geom.MultiPolygon.prototype.getPolygon = function(index) {
  ol.DEBUG && console.assert(0 <= index && index < this.endss_.length, "index should be in between 0 and the length of this.endss_");
  if (index < 0 || this.endss_.length <= index) {
    return null;
  }
  var offset;
  if (index === 0) {
    offset = 0;
  } else {
    var prevEnds = this.endss_[index - 1];
    offset = prevEnds[prevEnds.length - 1];
  }
  var ends = this.endss_[index].slice();
  var end = ends[ends.length - 1];
  if (offset !== 0) {
    var i, ii;
    for (i = 0, ii = ends.length;i < ii;++i) {
      ends[i] -= offset;
    }
  }
  var polygon = new ol.geom.Polygon(null);
  polygon.setFlatCoordinates(this.layout, this.flatCoordinates.slice(offset, end), ends);
  return polygon;
};
ol.geom.MultiPolygon.prototype.getPolygons = function() {
  var layout = this.layout;
  var flatCoordinates = this.flatCoordinates;
  var endss = this.endss_;
  var polygons = [];
  var offset = 0;
  var i, ii, j, jj;
  for (i = 0, ii = endss.length;i < ii;++i) {
    var ends = endss[i].slice();
    var end = ends[ends.length - 1];
    if (offset !== 0) {
      for (j = 0, jj = ends.length;j < jj;++j) {
        ends[j] -= offset;
      }
    }
    var polygon = new ol.geom.Polygon(null);
    polygon.setFlatCoordinates(layout, flatCoordinates.slice(offset, end), ends);
    polygons.push(polygon);
    offset = end;
  }
  return polygons;
};
ol.geom.MultiPolygon.prototype.getType = function() {
  return ol.geom.GeometryType.MULTI_POLYGON;
};
ol.geom.MultiPolygon.prototype.intersectsExtent = function(extent) {
  return ol.geom.flat.intersectsextent.linearRingss(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, extent);
};
ol.geom.MultiPolygon.prototype.setCoordinates = function(coordinates, opt_layout) {
  if (!coordinates) {
    this.setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.endss_);
  } else {
    this.setLayout(opt_layout, coordinates, 3);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var endss = ol.geom.flat.deflate.coordinatesss(this.flatCoordinates, 0, coordinates, this.stride, this.endss_);
    if (endss.length === 0) {
      this.flatCoordinates.length = 0;
    } else {
      var lastEnds = endss[endss.length - 1];
      this.flatCoordinates.length = lastEnds.length === 0 ? 0 : lastEnds[lastEnds.length - 1];
    }
    this.changed();
  }
};
ol.geom.MultiPolygon.prototype.setFlatCoordinates = function(layout, flatCoordinates, endss) {
  ol.DEBUG && console.assert(endss, "endss must be truthy");
  if (!flatCoordinates || flatCoordinates.length === 0) {
    ol.DEBUG && console.assert(endss.length === 0, "the length of endss should be 0");
  } else {
    ol.DEBUG && console.assert(endss.length > 0, "endss cannot be an empty array");
    var ends = endss[endss.length - 1];
    ol.DEBUG && console.assert(flatCoordinates.length == ends[ends.length - 1], "the length of flatCoordinates should be the last value of ends");
  }
  this.setFlatCoordinatesInternal(layout, flatCoordinates);
  this.endss_ = endss;
  this.changed();
};
ol.geom.MultiPolygon.prototype.setPolygons = function(polygons) {
  var layout = this.getLayout();
  var flatCoordinates = [];
  var endss = [];
  var i, ii, ends;
  for (i = 0, ii = polygons.length;i < ii;++i) {
    var polygon = polygons[i];
    if (i === 0) {
      layout = polygon.getLayout();
    } else {
      ol.DEBUG && console.assert(polygon.getLayout() == layout, "layout of polygon should be layout");
    }
    var offset = flatCoordinates.length;
    ends = polygon.getEnds();
    var j, jj;
    for (j = 0, jj = ends.length;j < jj;++j) {
      ends[j] += offset;
    }
    ol.array.extend(flatCoordinates, polygon.getFlatCoordinates());
    endss.push(ends);
  }
  this.setFlatCoordinates(layout, flatCoordinates, endss);
};
goog.provide("ol.format.GeoJSON");
goog.require("ol");
goog.require("ol.asserts");
goog.require("ol.Feature");
goog.require("ol.format.Feature");
goog.require("ol.format.JSONFeature");
goog.require("ol.geom.GeometryCollection");
goog.require("ol.geom.LineString");
goog.require("ol.geom.MultiLineString");
goog.require("ol.geom.MultiPoint");
goog.require("ol.geom.MultiPolygon");
goog.require("ol.geom.Point");
goog.require("ol.geom.Polygon");
goog.require("ol.obj");
goog.require("ol.proj");
ol.format.GeoJSON = function(opt_options) {
  var options = opt_options ? opt_options : {};
  ol.format.JSONFeature.call(this);
  this.defaultDataProjection = ol.proj.get(options.defaultDataProjection ? options.defaultDataProjection : "EPSG:4326");
  if (options.featureProjection) {
    this.defaultFeatureProjection = ol.proj.get(options.featureProjection);
  }
  this.geometryName_ = options.geometryName;
};
ol.inherits(ol.format.GeoJSON, ol.format.JSONFeature);
ol.format.GeoJSON.EXTENSIONS_ = [".geojson"];
ol.format.GeoJSON.readGeometry_ = function(object, opt_options) {
  if (!object) {
    return null;
  }
  var geometryReader = ol.format.GeoJSON.GEOMETRY_READERS_[object.type];
  return (ol.format.Feature.transformWithOptions(geometryReader(object), false, opt_options));
};
ol.format.GeoJSON.readGeometryCollectionGeometry_ = function(object, opt_options) {
  ol.DEBUG && console.assert(object.type == "GeometryCollection", "object.type should be GeometryCollection");
  var geometries = object.geometries.map(function(geometry) {
    return ol.format.GeoJSON.readGeometry_(geometry, opt_options);
  });
  return new ol.geom.GeometryCollection(geometries);
};
ol.format.GeoJSON.readPointGeometry_ = function(object) {
  ol.DEBUG && console.assert(object.type == "Point", "object.type should be Point");
  return new ol.geom.Point(object.coordinates);
};
ol.format.GeoJSON.readLineStringGeometry_ = function(object) {
  ol.DEBUG && console.assert(object.type == "LineString", "object.type should be LineString");
  return new ol.geom.LineString(object.coordinates);
};
ol.format.GeoJSON.readMultiLineStringGeometry_ = function(object) {
  ol.DEBUG && console.assert(object.type == "MultiLineString", "object.type should be MultiLineString");
  return new ol.geom.MultiLineString(object.coordinates);
};
ol.format.GeoJSON.readMultiPointGeometry_ = function(object) {
  ol.DEBUG && console.assert(object.type == "MultiPoint", "object.type should be MultiPoint");
  return new ol.geom.MultiPoint(object.coordinates);
};
ol.format.GeoJSON.readMultiPolygonGeometry_ = function(object) {
  ol.DEBUG && console.assert(object.type == "MultiPolygon", "object.type should be MultiPolygon");
  return new ol.geom.MultiPolygon(object.coordinates);
};
ol.format.GeoJSON.readPolygonGeometry_ = function(object) {
  ol.DEBUG && console.assert(object.type == "Polygon", "object.type should be Polygon");
  return new ol.geom.Polygon(object.coordinates);
};
ol.format.GeoJSON.writeGeometry_ = function(geometry, opt_options) {
  var geometryWriter = ol.format.GeoJSON.GEOMETRY_WRITERS_[geometry.getType()];
  return geometryWriter((ol.format.Feature.transformWithOptions(geometry, true, opt_options)), opt_options);
};
ol.format.GeoJSON.writeEmptyGeometryCollectionGeometry_ = function(geometry) {
  return ({type:"GeometryCollection", geometries:[]});
};
ol.format.GeoJSON.writeGeometryCollectionGeometry_ = function(geometry, opt_options) {
  var geometries = geometry.getGeometriesArray().map(function(geometry) {
    var options = ol.obj.assign({}, opt_options);
    delete options.featureProjection;
    return ol.format.GeoJSON.writeGeometry_(geometry, options);
  });
  return ({type:"GeometryCollection", geometries:geometries});
};
ol.format.GeoJSON.writeLineStringGeometry_ = function(geometry, opt_options) {
  return ({type:"LineString", coordinates:geometry.getCoordinates()});
};
ol.format.GeoJSON.writeMultiLineStringGeometry_ = function(geometry, opt_options) {
  return ({type:"MultiLineString", coordinates:geometry.getCoordinates()});
};
ol.format.GeoJSON.writeMultiPointGeometry_ = function(geometry, opt_options) {
  return ({type:"MultiPoint", coordinates:geometry.getCoordinates()});
};
ol.format.GeoJSON.writeMultiPolygonGeometry_ = function(geometry, opt_options) {
  var right;
  if (opt_options) {
    right = opt_options.rightHanded;
  }
  return ({type:"MultiPolygon", coordinates:geometry.getCoordinates(right)});
};
ol.format.GeoJSON.writePointGeometry_ = function(geometry, opt_options) {
  return ({type:"Point", coordinates:geometry.getCoordinates()});
};
ol.format.GeoJSON.writePolygonGeometry_ = function(geometry, opt_options) {
  var right;
  if (opt_options) {
    right = opt_options.rightHanded;
  }
  return ({type:"Polygon", coordinates:geometry.getCoordinates(right)});
};
ol.format.GeoJSON.GEOMETRY_READERS_ = {"Point":ol.format.GeoJSON.readPointGeometry_, "LineString":ol.format.GeoJSON.readLineStringGeometry_, "Polygon":ol.format.GeoJSON.readPolygonGeometry_, "MultiPoint":ol.format.GeoJSON.readMultiPointGeometry_, "MultiLineString":ol.format.GeoJSON.readMultiLineStringGeometry_, "MultiPolygon":ol.format.GeoJSON.readMultiPolygonGeometry_, "GeometryCollection":ol.format.GeoJSON.readGeometryCollectionGeometry_};
ol.format.GeoJSON.GEOMETRY_WRITERS_ = {"Point":ol.format.GeoJSON.writePointGeometry_, "LineString":ol.format.GeoJSON.writeLineStringGeometry_, "Polygon":ol.format.GeoJSON.writePolygonGeometry_, "MultiPoint":ol.format.GeoJSON.writeMultiPointGeometry_, "MultiLineString":ol.format.GeoJSON.writeMultiLineStringGeometry_, "MultiPolygon":ol.format.GeoJSON.writeMultiPolygonGeometry_, "GeometryCollection":ol.format.GeoJSON.writeGeometryCollectionGeometry_, "Circle":ol.format.GeoJSON.writeEmptyGeometryCollectionGeometry_};
ol.format.GeoJSON.prototype.getExtensions = function() {
  return ol.format.GeoJSON.EXTENSIONS_;
};
ol.format.GeoJSON.prototype.readFeature;
ol.format.GeoJSON.prototype.readFeatures;
ol.format.GeoJSON.prototype.readFeatureFromObject = function(object, opt_options) {
  ol.DEBUG && console.assert(object.type !== "FeatureCollection", "Expected a Feature or geometry");
  var geoJSONFeature = null;
  if (object.type === "Feature") {
    geoJSONFeature = (object);
  } else {
    geoJSONFeature = ({type:"Feature", geometry:(object)});
  }
  var geometry = ol.format.GeoJSON.readGeometry_(geoJSONFeature.geometry, opt_options);
  var feature = new ol.Feature;
  if (this.geometryName_) {
    feature.setGeometryName(this.geometryName_);
  }
  feature.setGeometry(geometry);
  if (geoJSONFeature.id !== undefined) {
    feature.setId(geoJSONFeature.id);
  }
  if (geoJSONFeature.properties) {
    feature.setProperties(geoJSONFeature.properties);
  }
  return feature;
};
ol.format.GeoJSON.prototype.readFeaturesFromObject = function(object, opt_options) {
  var geoJSONObject = (object);
  var features = null;
  if (geoJSONObject.type === "FeatureCollection") {
    var geoJSONFeatureCollection = (object);
    features = [];
    var geoJSONFeatures = geoJSONFeatureCollection.features;
    var i, ii;
    for (i = 0, ii = geoJSONFeatures.length;i < ii;++i) {
      features.push(this.readFeatureFromObject(geoJSONFeatures[i], opt_options));
    }
  } else {
    features = [this.readFeatureFromObject(object, opt_options)];
  }
  return features;
};
ol.format.GeoJSON.prototype.readGeometry;
ol.format.GeoJSON.prototype.readGeometryFromObject = function(object, opt_options) {
  return ol.format.GeoJSON.readGeometry_((object), opt_options);
};
ol.format.GeoJSON.prototype.readProjection;
ol.format.GeoJSON.prototype.readProjectionFromObject = function(object) {
  var geoJSONObject = (object);
  var crs = geoJSONObject.crs;
  var projection;
  if (crs) {
    if (crs.type == "name") {
      projection = ol.proj.get(crs.properties.name);
    } else {
      if (crs.type == "EPSG") {
        projection = ol.proj.get("EPSG:" + crs.properties.code);
      } else {
        ol.asserts.assert(false, 36);
      }
    }
  } else {
    projection = this.defaultDataProjection;
  }
  return (projection);
};
ol.format.GeoJSON.prototype.writeFeature;
ol.format.GeoJSON.prototype.writeFeatureObject = function(feature, opt_options) {
  opt_options = this.adaptOptions(opt_options);
  var object = ({"type":"Feature"});
  var id = feature.getId();
  if (id !== undefined) {
    object.id = id;
  }
  var geometry = feature.getGeometry();
  if (geometry) {
    object.geometry = ol.format.GeoJSON.writeGeometry_(geometry, opt_options);
  } else {
    object.geometry = null;
  }
  var properties = feature.getProperties();
  delete properties[feature.getGeometryName()];
  if (!ol.obj.isEmpty(properties)) {
    object.properties = properties;
  } else {
    object.properties = null;
  }
  return object;
};
ol.format.GeoJSON.prototype.writeFeatures;
ol.format.GeoJSON.prototype.writeFeaturesObject = function(features, opt_options) {
  opt_options = this.adaptOptions(opt_options);
  var objects = [];
  var i, ii;
  for (i = 0, ii = features.length;i < ii;++i) {
    objects.push(this.writeFeatureObject(features[i], opt_options));
  }
  return ({type:"FeatureCollection", features:objects});
};
ol.format.GeoJSON.prototype.writeGeometry;
ol.format.GeoJSON.prototype.writeGeometryObject = function(geometry, opt_options) {
  return ol.format.GeoJSON.writeGeometry_(geometry, this.adaptOptions(opt_options));
};
goog.provide("ngeo.search.createGeoJSONBloodhound");
goog.require("ol.format.GeoJSON");
goog.require("ol.obj");
ngeo.search.CreateGeoJSONBloodhound;
ngeo.search.createGeoJSONBloodhound = function(url, opt_filter, opt_featureProjection, opt_dataProjection, opt_options, opt_remoteOptions) {
  var geojsonFormat = new ol.format.GeoJSON;
  var bloodhoundOptions = ({remote:{url:url, prepare:function(query, settings) {
    settings.url = settings.url.replace("%QUERY", query);
    return settings;
  }, transform:function(parsedResponse) {
    var featureCollection = (parsedResponse);
    if (opt_filter !== undefined) {
      featureCollection = ({type:"FeatureCollection", features:featureCollection.features.filter(opt_filter)});
    }
    return geojsonFormat.readFeatures(featureCollection, {featureProjection:opt_featureProjection, dataProjection:opt_dataProjection});
  }}, datumTokenizer:ol.nullFunction, queryTokenizer:Bloodhound.tokenizers.whitespace});
  var options = ol.obj.assign({}, opt_options || {});
  var remoteOptions = ol.obj.assign({}, opt_remoteOptions || {});
  if (options.remote) {
    ol.obj.assign(remoteOptions, options.remote);
    delete options.remote;
  }
  ol.obj.assign(bloodhoundOptions, options);
  ol.obj.assign(bloodhoundOptions.remote, remoteOptions);
  return new Bloodhound(bloodhoundOptions);
};
ngeo.search.createGeoJSONBloodhound.module = angular.module("ngeoSearchCreategeojsonbloodhound", []);
ngeo.search.createGeoJSONBloodhound.module.value("ngeoSearchCreateGeoJSONBloodhound", ngeo.search.createGeoJSONBloodhound);
goog.provide("ngeo.search.searchModule");
goog.require("ngeo.search.searchDirective");
goog.require("ngeo.search.createGeoJSONBloodhound");
ngeo.search.searchModule.module = angular.module("ngeoSearchModule", [ngeo.search.searchDirective.module.name, ngeo.search.createGeoJSONBloodhound.module.name]);
goog.provide("ngeo");
goog.require("ol.format.IGC");
goog.require("ol.Overlay");
goog.require("ol.control.ScaleLine");
goog.require("ol.source.WMTS");
goog.require("ol.style.Icon");
goog.require("ol.layer.VectorTile");
goog.require("ol.Map");
goog.require("ngeo.search.searchModule");
ngeo.module = angular.module("ngeo", [ngeo.search.searchModule.module.name, "gettext", "ui.date", "floatThead"]);
ngeo.baseTemplateUrl = "ngeo";
ngeo.FeatureProperties = {ANGLE:"a", COLOR:"c", IS_CIRCLE:"l", IS_RECTANGLE:"r", IS_TEXT:"t", NAME:"n", OPACITY:"o", AZIMUT:"z", SHOW_MEASURE:"m", SIZE:"s", STROKE:"k"};
ngeo.GeometryType = {CIRCLE:"Circle", LINE_STRING:"LineString", MULTI_LINE_STRING:"MultiLineString", MULTI_POINT:"MultiPoint", MULTI_POLYGON:"MultiPolygon", POINT:"Point", POLYGON:"Polygon", RECTANGLE:"Rectangle", TEXT:"Text"};
goog.provide("ngeo.popoverDirective");
goog.provide("ngeo.popoverAnchorDirective");
goog.provide("ngeo.popoverContentDirective");
goog.provide("ngeo.PopoverController");
goog.require("ngeo");
ngeo.popoverDirective = function() {
  return {restrict:"A", scope:true, controller:"NgeoPopoverController", controllerAs:"popoverCtrl", link:function(scope, elem, attrs, ngeoPopoverCtrl) {
    ngeoPopoverCtrl.anchorElm.on("hidden.bs.popover", function() {
      var popover = ngeoPopoverCtrl.anchorElm.data("bs.popover");
      popover["inState"].click = false;
    });
    ngeoPopoverCtrl.anchorElm.on("inserted.bs.popover", function() {
      ngeoPopoverCtrl.bodyElm.show();
      ngeoPopoverCtrl.shown = true;
    });
    ngeoPopoverCtrl.anchorElm.popover({container:"body", html:true, content:ngeoPopoverCtrl.bodyElm, placement:attrs["ngeoPopoverPlacement"] || "right"});
    if (attrs["ngeoPopoverDismiss"]) {
      $(attrs["ngeoPopoverDismiss"]).on("scroll", function() {
        ngeoPopoverCtrl.dismissPopover();
      });
    }
    scope.$on("$destroy", function() {
      ngeoPopoverCtrl.anchorElm.popover("destroy");
      ngeoPopoverCtrl.anchorElm.unbind("inserted.bs.popover");
      ngeoPopoverCtrl.anchorElm.unbind("hidden.bs.popover");
    });
  }};
};
ngeo.popoverAnchorDirective = function() {
  return {restrict:"A", require:"^^ngeoPopover", link:function(scope, elem, attrs, ngeoPopoverCtrl) {
    ngeoPopoverCtrl.anchorElm = elem;
  }};
};
ngeo.popoverContentDirective = function() {
  return {restrict:"A", require:"^^ngeoPopover", link:function(scope, elem, attrs, ngeoPopoverCtrl) {
    ngeoPopoverCtrl.bodyElm = elem;
    elem.hide();
  }};
};
ngeo.PopoverController = function($scope) {
  this.shown = false;
  this.anchorElm = undefined;
  this.bodyElm = undefined;
  function onMouseDown(clickEvent) {
    if (this.anchorElm[0] !== clickEvent.target && this.bodyElm.parent()[0] !== clickEvent.target & this.bodyElm.parent().find(clickEvent.target).length === 0 && this.shown) {
      this.dismissPopover();
    }
  }
  angular.element("body").on("mousedown", onMouseDown.bind(this));
  $scope.$on("$destroy", function() {
    angular.element("body").off("mousedown", onMouseDown);
  });
};
ngeo.PopoverController.prototype.dismissPopover = function() {
  this.shown = false;
  this.anchorElm.popover("hide");
};
ngeo.module.controller("NgeoPopoverController", ngeo.PopoverController);
ngeo.module.directive("ngeoPopover", ngeo.popoverDirective);
ngeo.module.directive("ngeoPopoverAnchor", ngeo.popoverAnchorDirective);
ngeo.module.directive("ngeoPopoverContent", ngeo.popoverContentDirective);
goog.provide("app.popover");
goog.require("ngeo.popoverDirective");
goog.require("ngeo.popoverAnchorDirective");
goog.require("ngeo.popoverContentDirective");
app.module = angular.module("app", ["ngeo"]);
goog.require("ngeo");
(function() {
  var runner = function($templateCache) {
    $templateCache.put("ngeo/attributes.html", '<fieldset ng-disabled=attrCtrl.disabled> <div class=form-group ng-repeat="attribute in ::attrCtrl.attributes"> <div ng-if="attribute.type !== \'geometry\'"> <label class=control-label>{{ ::attribute.name | translate }} <span class=text-muted>{{::attribute.required ? "*" : ""}}</span></label> <div ng-switch=attribute.type> <select name={{::attribute.name}} ng-required=attribute.required ng-switch-when=select ng-model=attrCtrl.properties[attribute.name] ng-change=attrCtrl.handleInputChange(attribute.name); class=form-control type=text> <option ng-repeat="attribute in ::attribute.choices" value="{{ ::attribute }}"> {{ ::attribute }} </option> </select> <input name={{::attribute.name}} ng-required=attribute.required ng-switch-when=date ui-date=attrCtrl.dateOptions ng-model=attrCtrl.properties[attribute.name] ng-change=attrCtrl.handleInputChange(attribute.name); class=form-control type=text> <input name={{::attribute.name}} ng-required=attribute.required ng-switch-when=datetime ui-date=attrCtrl.dateOptions ng-model=attrCtrl.properties[attribute.name] ng-change=attrCtrl.handleInputChange(attribute.name); class=form-control type=text> <input name={{::attribute.name}} ng-required=attribute.required ng-switch-default ng-model=attrCtrl.properties[attribute.name] ng-change=attrCtrl.handleInputChange(attribute.name); class=form-control type=text> <div ng-show="form.$submitted || form[attribute.name].$touched"> <p class=text-danger ng-show=form[attribute.name].$error.required> {{\'This field is required\' | translate}} </p> </div> </div> </div> </div> </fieldset> ');
    $templateCache.put("ngeo/popup.html", '<h4 class="popover-title ngeo-popup-title"> <span ng-bind-html=title></span> <button type=button class=close ng-click="open = false"> &times;</button> </h4> <div class=popover-content ng-bind-html=content></div> ');
    $templateCache.put("ngeo/grid.html", '<div class=ngeo-grid-table-container> <table float-thead=ctrl.floatTheadConfig ng-model=ctrl.configuration.data class="table table-bordered table-striped table-hover"> <thead class=table-header> <tr> <th ng-repeat="columnDefs in ctrl.configuration.columnDefs" ng-click=ctrl.sort(columnDefs.name)>{{columnDefs.name | translate}} <i ng-show="ctrl.sortedBy !== columnDefs.name" class="fa fa-fw"></i> <i ng-show="ctrl.sortedBy === columnDefs.name && ctrl.sortAscending === true" class="fa fa-caret-up"></i> <i ng-show="ctrl.sortedBy === columnDefs.name && ctrl.sortAscending === false" class="fa fa-caret-down"></i> </th> </tr> </thead> <tbody> <tr ng-repeat="attributes in ctrl.configuration.data" ng-class="[\'row-\' + ctrl.configuration.getRowUid(attributes), ctrl.configuration.isRowSelected(attributes) ? \'ngeo-grid-active\': \'\']" ng-click="ctrl.clickRow(attributes, $event)" ng-mousedown=ctrl.preventTextSelection($event)> <td ng-repeat="columnDefs in ctrl.configuration.columnDefs" ng-bind-html="attributes[columnDefs.name] | ngeoTrustHtml"></td> </tr> </tbody> </table> </div> ');
    $templateCache.put("ngeo/scaleselector.html", '<div class="btn-group btn-block" ng-class="::{\'dropup\': scaleselectorCtrl.options.dropup}"> <button type=button class="btn btn-default dropdown-toggle" data-toggle=dropdown aria-expanded=false> <span ng-bind-html=scaleselectorCtrl.currentScale|ngeoScalify></span>&nbsp;<i class=caret></i> </button> <ul class="dropdown-menu btn-block" role=menu> <li ng-repeat="zoomLevel in ::scaleselectorCtrl.zoomLevels"> <a href ng-click=scaleselectorCtrl.changeZoom(zoomLevel) ng-bind-html=::scaleselectorCtrl.getScale(zoomLevel)|ngeoScalify> </a> </li> </ul> </div> ');
    $templateCache.put("ngeo/datepicker.html", "<div class=ngeo-datepicker> <form name=dateForm class=ngeo-datepicker-form novalidate> <div ng-if=\"::datepickerCtrl.time.widget === 'datepicker'\"> <div class=ngeo-datepicker-start-date> <span ng-if=\"::datepickerCtrl.time.mode === 'range'\" translate>From:</span> <span ng-if=\"::datepickerCtrl.time.mode !== 'range'\" translate>Date:</span> <input name=sdate ui-date=datepickerCtrl.sdateOptions ng-model=datepickerCtrl.sdate required> </div> <div class=ngeo-datepicker-end-date ng-if=\"::datepickerCtrl.time.mode === 'range'\"> <span translate>To:</span> <input name=edate ui-date=datepickerCtrl.edateOptions ng-model=datepickerCtrl.edate required> </div> </div> </form> </div> ");
    $templateCache.put("ngeo/layertree.html", '<span ng-if=::!layertreeCtrl.isRoot>{{::layertreeCtrl.node.name}}</span> <input type=checkbox ng-if="::layertreeCtrl.node && !layertreeCtrl.node.children" ng-model=layertreeCtrl.getSetActive ng-model-options="{getterSetter: true}"> <ul ng-if=::layertreeCtrl.node.children> <li ng-repeat="node in ::layertreeCtrl.node.children" ngeo-layertree=::node ngeo-layertree-notroot ngeo-layertree-map=layertreeCtrl.map ngeo-layertree-nodelayerexpr=layertreeCtrl.nodelayerExpr ngeo-layertree-listenersexpr=layertreeCtrl.listenersExpr> </li> </ul> ');
    $templateCache.put("ngeo/colorpicker.html", '<table class=ngeo-colorpicker-palette> <tr ng-repeat="colors in ::ctrl.colors"> <td ng-repeat="color in ::colors" ng-click=ctrl.setColor(color) ng-class="{\'ngeo-colorpicker-selected\': color == ctrl.color}"> <div ng-style="::{\'background-color\': color}"></div> </td> </tr> </table> ');
  };
  ngeo.module.run(runner);
})();
goog.addDependency("demos/editor/equationeditor.js", ["goog.demos.editor.EquationEditor"], ["goog.ui.equation.EquationEditorDialog"]);
goog.addDependency("demos/editor/helloworld.js", ["goog.demos.editor.HelloWorld"], ["goog.dom", "goog.dom.TagName", "goog.editor.Plugin"]);
goog.addDependency("demos/editor/helloworlddialog.js", ["goog.demos.editor.HelloWorldDialog", "goog.demos.editor.HelloWorldDialog.OkEvent"], ["goog.dom.TagName", "goog.events.Event", "goog.string", "goog.ui.editor.AbstractDialog", "goog.ui.editor.AbstractDialog.Builder", "goog.ui.editor.AbstractDialog.EventType"]);
goog.addDependency("demos/editor/helloworlddialogplugin.js", ["goog.demos.editor.HelloWorldDialogPlugin", "goog.demos.editor.HelloWorldDialogPlugin.Command"], ["goog.demos.editor.HelloWorldDialog", "goog.dom.TagName", "goog.editor.plugins.AbstractDialogPlugin", "goog.editor.range", "goog.functions", "goog.ui.editor.AbstractDialog.EventType"]);

//# sourceMappingURL=popover.js.map
