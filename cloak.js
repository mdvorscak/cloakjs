/**
 * Created by Mike Dvorscak on 3/23/15.
 */

//var myCloak = cloak(window, 'alert').when(alertIsNotSupported).cloakWith(popupFn)
//    .when(logShouldBeUsed).cloakWith(logFn)
//    .before(runPreActions)
//    .after(runPostActions);
// later that day...
//myCloak.uncloak()
(function (exportName) {
    'use strict';

    function IllegalArgumentError(message) {
        this.name = 'IllegalArgumentError';
        this.message = message || '';
    }

    IllegalArgumentError.prototype = new Error();

    //Checks to see if a parameters type is the expected type
    //If it is not, throw an error
    function parameterCheck(obj) {
        if (typeof obj.param !== obj.type) {
            var errorMsg = obj.errorMsg || 'Argument ' + obj.argName + ' must be a ' + obj.type;
            throw new IllegalArgumentError(errorMsg);
        }
    }

    //Simple wrapper functions
    function trueWrapper() { return true; }
    function falseWrapper() { return false; }

    function cloak(object, method) {
        var fn = object[method];
        parameterCheck({
                           param   : fn,
                           type    : 'function',
                           errorMsg: 'Cannot cloak property: ' + method + ', it is not a function'
                       });
        //Private variables
        var self = {};
        var state = {};
        var cases = [];
        var wrappedMethod;
        //the default condition is true if no other conditions are met
        // in case when is not called before cloakWith
        state.lastWhenCondition = trueWrapper;

        function replaceMethodWithWrapper() {
            object[method] = function cloakWrapper() {
                //Store the original method for later
                wrappedMethod = object[method].bind(this);
                var currentCase;
                for (var i = 0, len = cases.length; i < len; i++) {
                    currentCase = cases[i];
                    if (currentCase.condition()) {
                        currentCase.replacementFn.apply(this, Array.prototype.slice.call(arguments));
                    }
                }
            };
        }

        self.cloakWith = function cloakWith(fn) {
            parameterCheck({param: fn, type: 'function', argName: 'fn'});
            cases.push({condition: state.lastWhenCondition, replacementFn: fn});
            //Only wrap for real when we're given something valid to wrap with
            if (!wrappedMethod) {
                replaceMethodWithWrapper();
            }
            return self;
        };

        self.when = function when(fn) {
            parameterCheck({param: fn, type: 'function', argName: 'fn'});
            state.lastWhenCondition = fn;
            return self;
        };

        return self;
    }

    //Static helpers
    cloak.TRUE = trueWrapper;
    cloak.FALSE = falseWrapper;

    //namespace
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cloak;
    } else {
        window[exportName] = cloak;
    }
})('cloak');