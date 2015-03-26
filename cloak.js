/**
 * Created by Mike Dvorscak on 3/23/15.
 */

//cloak(window, 'alert').when(alertIsNotSupported).cloakWith(popupFn)
//    .when(logShouldBeUsed).cloakWith(logFn)
//    .before(runPreActions)
//    .after(runPostActions)
(function(exportName){
    'use strict';

    function IllegalArgumentError(message) {
        this.name = 'IllegalArgumentError';
        this.message = message || '';
    }
    IllegalArgumentError.prototype = new Error();

    //Checks to see if a parameters type is the expected type
    //If it is not, throw an error
    function parameterCheck(obj){
        if(typeof obj.param !== obj.type){
            var errorMsg = obj.errorMsg || 'Argument ' + obj.argName + ' must be a ' + obj.type;
            throw new IllegalArgumentError(errorMsg);
        }
    }

    function trueWrapper() { return true; }

    function cloak(object, method){
        var fn = object[method];
        parameterCheck({param: fn,
                        type : 'function',
                        errorMsg: 'Cannot cloak property: ' + method + ', it is not a function'
                        });
        var self  = {};
        var state = {};
        var cases = [];

        //the default condition is true if no other conditions are met
        // in case when is not called before cloakWith
        state.lastWhenCondition = trueWrapper;
        //TODO:Figure out default when no cloakWith is used, throw an error (but how?)

        object[method] = function cloakWrapper(){
            var currentCase;
            for(var i = 0, len = cases.length; i < len; i++){
                currentCase = cases[i];
                if(currentCase.condition()){
                    currentCase.replacementFn.apply(this, Array.prototype.slice.call(arguments));
                }
            }
        };

        self.cloakWith = function cloakWith(fn){
            parameterCheck({param: fn, type: 'function', argName: 'fn'});
            cases.push({condition: state.lastWhenCondition, replacementFn: fn });
            return self;
        };

        self.when = function when(fn){
            parameterCheck({param: fn, type: 'function', argName: 'fn'});
            state.lastWhenCondition = fn;
            return self;
        };

        return self;
    }

    //namespace
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cloak;
    } else {
        window[exportName] = cloak;
    }
})('cloak');