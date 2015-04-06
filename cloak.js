/**
 * Created by Mike Dvorscak on 3/23/15.
 */

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
        var paramType = typeof obj.param;
        if (obj.types.indexOf(paramType) === -1) {
            var errorMsg = obj.errorMsg ||
                'Argument ' + obj.argName + ' must be one of the following types: ' + obj.types.join(', ');
            throw new IllegalArgumentError(errorMsg);
        }
    }

    function cloak(object, method) {
        var fn = object[method];
        parameterCheck({
            param   : fn,
            types   : ['function'],
            errorMsg: 'Cannot cloak property: ' + method + ', it is not a function'
        });
        //Private variables
        var self = {};
        var state = {};
        var cases = [];
        var afterCases = [];
        var wrappedMethod;
        //the default condition is true if no other conditions are met
        // in case when is not called before cloakWith
        state.lastWhenCondition = true;

        function runCases(cases, context, args) {
            var currentCase, currentCondition;
            for (var i = 0, len = cases.length; i < len; i++) {
                currentCase = cases[i];
                currentCondition = currentCase.condition;
                if ((typeof currentCondition === 'function' && currentCondition()) || currentCondition) {
                    currentCase.replacementFn.apply(context, args);
                }
            }
        }

        //Store the original method for later
        wrappedMethod = object[method];
        object[method] = function cloakWrapper() {
            //bind the original methods context
            wrappedMethod = wrappedMethod.bind(this);
            var args = Array.prototype.slice.call(arguments);
            if(!state.cloaked){
                wrappedMethod.apply(this, args);
            }
            runCases(cases, this, args);
            runCases(afterCases, this, args);
        };

        //Returns true if the case was added, false otherwise
        //wrapper for adding to cases, so additional logic can easily be added
        function addCase(opts, caseObj) {
            if (caseObj.condition) {
                //Normally push, but if for cases like 'before' unshift is used
                var addFn = opts.atStart ? 'unshift' : 'push';
                Array.prototype[addFn].call(opts.caseArr, caseObj);
            }
            return caseObj.condition;
        }

        self.cloakWith = function cloakWith(fn) {
            parameterCheck({param: fn, types: ['function'], argName: 'fn'});
            //The cloaked state just indicates that the original function will no longer be called
            state.cloaked = true;
            addCase({caseArr: cases}, {condition: state.lastWhenCondition, replacementFn: fn});
            return self;
        };

        self.when = function when(condition) {
            parameterCheck({param: condition, types: ['function', 'boolean'], argName: 'condition'});
            state.lastWhenCondition = condition;
            return self;
        };

        self.uncloak = function uncloak() {
            if (wrappedMethod) {
                object[method] = wrappedMethod;
            }
        };

        self.before = function before(fn) {
            parameterCheck({param: fn, types: ['function'], argName: 'fn'});
            addCase({caseArr: cases, atStart: true},
                    {condition: state.lastWhenCondition, replacementFn: fn});
            return self;
        };

        self.after = function after(fn) {
            parameterCheck({param: fn, types: ['function'], argName: 'fn'});
            addCase({caseArr: afterCases},
                    {condition: state.lastWhenCondition, replacementFn: fn});
            return self;
        };

        self.callOriginal = function callOriginal() {
            addCase({caseArr: cases},
                    {condition: state.lastWhenCondition, replacementFn: wrappedMethod});
            return self;
        };

        //fluent attributes, just chainable no-ops
        self.and = self;

        return self;
    }

    //namespace
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cloak;
    } else {
        window[exportName] = cloak;
    }
})('cloak');