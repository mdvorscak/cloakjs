/**
 * Created by Mike Dvorscak on 3/23/15.
 */

(function(exportName){
    'use strict';

    var self = {};
    var internal = {};

    function cloak(object, method){
        var fn = object[method];
        if(typeof fn !== 'function'){
            throw new Error('Cannot cloak property: ' + method + ', it is not a function');
        }

        return {
          withFunction: function(fn){
              object[method] = function cloakWrapper(){
                  fn.apply(this, Array.prototype.slice.call(arguments));
              };
          }
        };
    }

    //namespace
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cloak;
    } else {
        window[exportName] = cloak;
    }
})('cloak');