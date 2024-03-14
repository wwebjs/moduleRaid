/*
* moduleRaid v6
 * https://github.com/wwebjs/moduleRaid
 *
 * Copyright pixeldesu, pedroslopez, purpshell and other contributors
 * Licensed under the MIT License
 * https://github.com/wwebjs/moduleRaid/blob/master/LICENSE
 */

const moduleRaid = function () {
  moduleRaid.mID  = Math.random().toString(36).substring(7);
  moduleRaid.mObj = {};

  const isComet = parseInt(window.Debug?.VERSION?.split(".")?.[1]) >= 3000;

  fillModuleArray = function() {
    if (isComet) {
      const moduleKeys = Object.keys(require("__debug").modulesMap);
      for (const moduleKey of moduleKeys) {
        const module = require(moduleKey);
        if (module) {
          moduleRaid.mObj[moduleKey] = module;
        } 
      };
      return;
    };

    (window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client).push([
      [moduleRaid.mID], {}, function(e) {
        Object.keys(e.m).forEach(function(mod) {
          moduleRaid.mObj[mod] = e(mod);
        })
      }
    ]);
  }
  
  fillModuleArray();

  get = function get (id) {
    return moduleRaid.mObj[id]
  }

  findModule = function findModule (query) {
    results = [];
    modules = Object.keys(moduleRaid.mObj);

    modules.forEach(function(mKey) {
      mod = moduleRaid.mObj[mKey];

      if (typeof mod !== 'undefined') {
        if (typeof query === 'string') {
          if (typeof mod.default === 'object') {
            for (key in mod.default) {
              if (key == query) results.push(mod);
            }
          }

          for (key in mod) {
            if (key == query) results.push(mod);
          }
        } else if (typeof query === 'function') { 
          if (query(mod)) {
            results.push(mod);
          }
        } else {
          throw new TypeError('findModule can only find via string and function, ' + (typeof query) + ' was passed');
        }
      }
    })

    return results;
  }

  return {
    modules: moduleRaid.mObj,
    constructors: moduleRaid.cArr,
    findModule: findModule,
    get: get
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = moduleRaid;
} else {
  window.mR = moduleRaid();
}
