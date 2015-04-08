/**
 * Created by Mike Dvorscak on 3/23/15.
 */

describe('cloak.js suite', function () {
    var nop = function(){};
    describe('cloak', function () {

        it('should call the original function if it was never cloaked', function () {
            var bar;
            var foo = {
                setBar: function (value) {
                    bar = value;
                }
            };

            cloak(foo, 'setBar');
            foo.setBar(5);
            expect(bar).toBe(5);
        });

        it('should throw an error when the property provided is not a function', function () {
            var test = {num: 5};
            expect(function () {
                cloak(test, 'num');
            }).toThrow();
        });

        it('should be able to be called on a multiple methods(each independently cloaked)', function () {
            var foo, bar;
            var obj1 = {
                setFoo   : function (val) {
                    foo = val;
                },
                setFooToo: function (val) {
                    foo = val + ' too';
                }
            };

            var obj2 = {
                setBar   : function (val) {
                    bar = val;
                },
                setBarToo: function (val) {
                    bar = val + ' too';
                }
            };
            cloak(obj1, 'setFoo').cloakWith(obj1.setFooToo);
            cloak(obj2, 'setBar').cloakWith(obj2.setBarToo);
            obj1.setFoo(1);
            obj2.setBar(2);
            expect(foo).toBe('1 too');
            expect(bar).toBe('2 too');
        });
    });

    describe('cloaking functions', function(){
        it('should receive the original function as a final parameter', function(){
            var bar;
            var foo = {
                setBar: function(val){
                    bar = val;
                }
            };

            cloak(foo, 'setBar').cloakWith(function(val, originalFn){
                originalFn(val + 5);
            });
            foo.setBar(5);
            expect(bar).toBe(10);
        });
    });

    describe('modifier functions', function () {
        describe('with', function () {
            var foo, bar;
            var otherObj, otherValue;
            beforeEach(function () {
                foo = {
                    setBar: function (value) {
                        bar = value;
                    }
                };

                otherObj = {
                    otherFunction: function (value) {
                        otherValue = value;
                        console.log('I have been switched!');
                    }
                };

                spyOn(console, 'log');
            });

            it('should prevent the original function from being called', function(){
                cloak(foo, 'setBar').cloakWith(otherObj.otherFunction);
                foo.setBar(5);
                expect(bar).toBeUndefined();
            });

            it('should replace the currently cloaked function with the function provided', function () {
                cloak(foo, 'setBar').cloakWith(otherObj.otherFunction);
                foo.setBar(5);
                expect(console.log).toHaveBeenCalledWith('I have been switched!');
            });

            it('should be passed the original arguments', function () {
                cloak(foo, 'setBar').cloakWith(otherObj.otherFunction);
                foo.setBar(5);
                expect(otherValue).toBe(5);
                expect(bar).not.toBe(5)
            });

            it('should throw an error when it is not passed a function', function () {
                expect(function () {
                    cloak(console, 'log').cloakWith(5);
                }).toThrow();
            });
        });

        describe('when', function () {

            it('should be evaluated when the cloaked function is called', function (done) {
                var testRunAt;

                function deferredTest() {
                    testRunAt = Date.now();
                }

                cloak(console, 'log').when(deferredTest).cloakWith(nop);
                var timeBeforeTheTest = Date.now();
                setTimeout(function () {
                    console.log('deference test');
                    expect(testRunAt).toBeGreaterThan(timeBeforeTheTest);
                    done();
                }, 1);
            });

            describe('static booleans', function(){
               it('should accept a boolean value', function(){
                   expect(function(){
                       cloak(console, 'log').when(false);
                   }).not.toThrow();
               });

                it('should not allow the next with call to be applied when the condition passed is false', function () {
                    var foo = {betterLogger: function () { alert('lol jk'); }};
                    cloak(console, 'log').when(false).cloakWith(foo.betterLogger);
                    spyOn(console, 'log');

                    console.log('yolo');
                    expect(console.log).toHaveBeenCalled();
                });

                it('should allow the next cloakWith call to be applied when the condition passed is true', function () {
                    function logFn() {
                        console.log('No warnings allowed');
                    }

                    cloak(console, 'warn').when(true).cloakWith(logFn);
                    spyOn(console, 'log');

                    console.warn('Hi');
                    expect(console.log).toHaveBeenCalledWith('No warnings allowed');
                });
            });

            it('should throw an error when it is not passed a function or boolean', function () {
                expect(function () {
                    cloak(console, 'log').when(5);
                }).toThrow();
            });

            it('should be passed the cloaked functions arguments, when the condition is a function', function(){
                var argOne, argTwo;
                function whenTest(arg1, arg2){
                    argOne = arg1;
                    argTwo = arg2;
                }
                cloak(console, 'log').when(whenTest).cloakWith(nop);
                console.log('test', 1);
                expect(argOne).toBe('test');
                expect(argTwo).toBe(1);
            });

            it('should call the next cloaking function when the conditional function returns true', function(){
                var bar, baz;
                var foo = {
                    setBarAndBaz: function(barVal, bazVal){
                        bar = barVal;
                        baz = bazVal;
                    }
                };
                function whenTest(arg1, arg2){
                    return arg1 > arg2;
                }
                cloak(foo, 'setBarAndBaz').when(whenTest).callOriginal();
                foo.setBarAndBaz(2, 1);
                expect(bar).toBe(2);
                expect(baz).toBe(1);
            });

            it('should not call the next cloaking function when the conditional function returns false', function(){
                var bar, baz;
                var foo = {
                    setBarAndBaz: function(barVal, bazVal){
                        bar = barVal;
                        baz = bazVal;
                    }
                };
                function whenTest(arg1, arg2){
                    return arg1 > arg2;
                }
                cloak(foo, 'setBarAndBaz').when(whenTest).callOriginal();
                foo.setBarAndBaz(1, 2);
                expect(bar).toBeUndefined();
                expect(baz).toBeUndefined();
            });
        });

        describe('chaining', function () {
            it('should only use the last when if multiple whens are called in a row with now cloakWith calls between them', function () {
                var myLogEndpoint;

                function otherLog(val) {
                    myLogEndpoint = val;
                }

                cloak(console, 'log').when(false).when(true)
                    .cloakWith(otherLog);
                console.log('test');
                expect(myLogEndpoint).toBe('test');
            });

            it('should use both cloakWith functions when two when conditions are met', function () {
                var log1, log2;

                function otherLog1(val) {
                    log1 = val;
                }

                function otherLog2(val) {
                    log2 = val;
                }

                cloak(console, 'log').when(true).cloakWith(otherLog1)
                    .when(true).cloakWith(otherLog2);
                console.log('test');
                expect(log1).toBe('test');
                expect(log2).toBe('test');
            });
        });

        describe('before', function () {
            var foo, bar, baz;
            beforeEach(function () {
                foo = {
                    setBar: function (val) {
                        bar = val;
                    },
                    setBaz: function (val) {
                        baz = val;
                    }
                };
            });

            it('should call the original function and the before function if there was no cloakWith call', function(){
                cloak(foo, 'setBar').before(foo.setBaz);
                foo.setBar(5);
                expect(bar).toBe(5);
                expect(baz).toBe(5);
            });

            it('should throw an error when it is not given a function', function () {
                expect(function () {
                    cloak(console, 'log').before(5);
                }).toThrow();
            });

            it('should also adhere to precondition checks of the "when" function', function () {
                var preaction1Flag, preaction2Flag;
                function preactions1(){
                    preaction1Flag = true;
                }
                function preactions2(){
                    preaction2Flag = true;
                }

                cloak(console, 'log').when(false).before(preactions1).cloakWith(nop)
                                     .when(true).before(preactions2).cloakWith(nop);
                console.log('hello');
                expect(preaction1Flag).toBeUndefined();
                expect(preaction2Flag).toBe(true);
            });

            it('should run before any of the wrapped functions', function () {
                var test, test2;

                function setTest() {
                    test = baz + 5;
                }

                function setTest2() {
                    test2 = baz + 7;
                }

                cloak(foo, 'setBar').before(function () {
                    foo.setBaz(5);
                }).cloakWith(setTest).cloakWith(setTest2);
                foo.setBar(1);
                expect(test).toBe(10);
                expect(test2).toBe(12);
            });
        });

        describe('after', function () {
            it('should cloak the function immediately', function(){
                var bar;
                var foo = {
                    setBar: function(val){
                        bar = val;
                    }
                };
                cloak(console, 'log').after(foo.setBar);
                console.log(5);
                expect(bar).toBe(5);
            });

            it('should throw an error when it is not given a function', function () {
                expect(function () {
                    cloak(console, 'log').after(5);
                }).toThrow();
            });

            it('should run after all of the wrapped functions', function () {
                var bar, baz, ultimateAnswer;
                function setBarTo5(){
                    bar = 5;
                }
                function setBazTo37(){
                    baz = 37;
                }
                function calculateUltimateAnswer() {
                    ultimateAnswer = bar + baz;
                }

                //After is in the first position to illustrate the fact that it will really come after the other functions
                cloak(console, 'log').after(calculateUltimateAnswer).cloakWith(setBarTo5).cloakWith(setBazTo37);
                console.log('Sup?');
                expect(ultimateAnswer).toBe(42);
            });
        });

        describe('fluent no-op chains', function(){
            describe('and', function(){
               it('should chain together two functions with no effect', function(){
                   expect(function(){
                       cloak(console, 'warn').cloakWith(console.log).and.when(false).cloakWith(nop);
                   });
               });
            });
        });

        describe('callOriginal', function () {
            var foo, bar, baz;
            beforeEach(function(){
                bar = 0;
                baz = 0;
                foo = {
                    setBar: function(val) {
                        bar = val;
                    },
                    setBaz: function(val){
                        baz = val;
                    }
                };
            });

            it('should not call the original when the previous "when" condition is not satisfied but another "when" condition is', function(){
                cloak(foo, 'setBar').when(false).cloakWith(foo.setBaz).and.callOriginal();
                foo.setBar(5);
                expect(bar).toBe(0);
                expect(baz).toBe(0);
            });

            it('should cloak the function immediately', function(){
                cloak(foo, 'setBar').callOriginal();
                foo.setBar(5);
                expect(bar).toBe(5);
            });

            it('should call the original function when the previous "when" condition is satisfied', function () {
                cloak(foo, 'setBar').when(true).cloakWith(foo.setBaz).and.callOriginal();
                foo.setBar(5);
                expect(bar).toBe(5);
                expect(baz).toBe(5);
            });

            it('should call the original function when there is no previous "when" condition', function () {
                cloak(foo, 'setBar').cloakWith(foo.setBaz).and.callOriginal();
                foo.setBar(5);
                expect(bar).toBe(5);
                expect(baz).toBe(5);
            });
        });
    });

    describe('uncloak', function () {
        it('should not modify the function if it was never wrapped', function () {
            spyOn(console, 'log').and.callThrough();
            cloak(console, 'log').uncloak();
            console.log('test');
            expect(console.log).toHaveBeenCalledWith('test');
        });

        it('should return the function to it\'s original state', function () {
            var bar;
            var foo = {
                setBar: function (val) {
                    bar = val;
                }
            };
            cloak(foo, 'setBar').cloakWith(function () {}).uncloak();
            foo.setBar(5);
            expect(bar).toBe(5);
        });
    });
});