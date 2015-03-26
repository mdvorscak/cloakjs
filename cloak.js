/**
 * Created by Mike Dvorscak on 3/23/15.
 */

//cloak(window, 'alert').when(alertIsNotSupported).cloakWith(popupFn)
//    .when(logShouldBeUsed).cloakWith(logFn)
//    .before(runPreActions)
//    .after(runPostActions)
(function(exportName){
    'use strict';

    var self = {};
    var state = {};
    var cases = [];
    function truth() { return true; }

    function cloak(object, method){
        var fn = object[method];
        if(typeof fn !== 'function'){
            state.cloakingAllowed = false;
            throw new Error('Cannot cloak property: ' + method + ', it is not a function');
        }
        state.lastObj = object;
        state.lastMethod = method;
        state.cloakingAllowed = true;
        //the default condition is true if no other conditions are met
        // in case when is not called before cloakWith
        state.lastWhenCondition = truth;
        //TODO:Figure out default when no cloakWith is used


        state.lastObj[state.lastMethod] = function cloakWrapper(){
            var currentCase;
            for(var i = 0, len = cases.length; i < len; i++){
                currentCase = cases[i];
                if(currentCase.condition()){
                    currentCase.replacementFn.apply(this, Array.prototype.slice.call(arguments));
                }
            }
        };

        return self;
    }

    self.cloakWith = function cloakWith(fn){
        if(typeof fn !== 'function'){
            throw new Error('argument fn must be a function');
        }
        if(state.cloakingAllowed){
            cases.push({condition: state.lastWhenCondition, replacementFn: fn });
        }
    };

    self.when = function when(fn){
        if(typeof fn !== 'function'){
            throw new Error('argument fn must be a function');
        }
        state.lastWhenCondition = fn;
    };

    //namespace
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = cloak;
    } else {
        window[exportName] = cloak;
    }
})('cloak');