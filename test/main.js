/**
 * Created by Mike Dvorscak on 3/23/15.
 */

describe('cloak.js suite', function(){
   describe('cloak', function(){

      it('should do nothing when called alone', function(){
          var bar;
          var foo = {
              setBar: function(value) {
                  bar = value;
              }
          };
          spyOn(foo, 'setBar').and.callThrough();

          cloak(foo, 'setBar');
          foo.setBar(5);
          expect(foo.setBar).toHaveBeenCalledWith(5);
          expect(bar).toBe(5);
      });

       it('should throw an error when the property provided is not a function', function(){
           var test = { num: 5 };
          expect(function(){
              cloak(test, 'num');
          }).toThrow();
       });
   });

    describe('modifier functions', function(){
       describe('with', function(){
           var foo, bar;
           var otherObj, otherValue;
           beforeEach(function(){
               foo = {
                   setBar: function(value) {
                       bar = value;
                   }
               };

               otherObj = {
                   otherFunction: function(value) {
                       otherValue = value;
                       console.log('I have been switched!');
                   }
               };

               spyOn(console, 'log');
           });
          it('should replace the currently cloaked function with the function provided', function(){
              cloak(foo, 'setBar').cloakWith(otherObj.otherFunction);
              foo.setBar(5);
              expect(console.log).toHaveBeenCalledWith('I have been switched!');
          });

           //TODO:Should it?
           xit('should be passed the original function', function(){

           });

           it('should be passed the original arguments', function(){
               cloak(foo, 'setBar').cloakWith(otherObj.otherFunction);
               foo.setBar(5);
               expect(otherValue).toBe(5);
               expect(bar).not.toBe(5)
           });
       });

        describe('when', function(){
            it('should allow the next cloakWith call to be applied when the condition passed is true', function(){
                function testIfAlertIsNotSupported(){
                    return true;
                }
                function logFn(){
                    console.log('No alerts allowed');
                }
                cloak(window, 'alert').when(testIfAlertIsNotSupported).cloakWith(logFn);
                spyOn(console, 'log');

                alert('Hi');
                expect(console.log).toHaveBeenCalledWith('No alerts allowed');
            });

            it('should not allow the next with call to be applied when the condition passed is false', function(){
                function testIfLoggingIsUnpopular(){
                    return false;
                }
                var foo = { betterLogger: function(){ alert('lol jk'); }};
                cloak(console, 'log').when(testIfLoggingIsUnpopular).cloakWith(foo, 'betterLogger');
                spyOn(console, 'log');

                console.log('yolo');
                expect(console.log).toHaveBeenCalled();
            });

            it('should be evaluated when the cloaked function is called', function(){
                var testRunAt;
                function deferredTest(){
                    testRunAt = Date.now();
                }

                cloak(console, 'log').when(deferredTest).cloakWith(window, 'alert');
                var timeBeforeTheTest = Date.now();
                console.log('deference test');
                expect(testRunAt).toBeGreaterThan(timeBeforeTheTest)
            });
        });
    });

    describe('uncloak', function(){
       it('should return the function to it\'s original state', function(){

       });
    });
});