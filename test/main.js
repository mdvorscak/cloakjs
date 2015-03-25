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
              cloak(foo, 'setBar').withFunction(otherObj.otherFunction);
              foo.setBar(5);
              expect(console.log).toHaveBeenCalledWith('I have been switched!');
          });

           //TODO:Should it?
           xit('should be passed the original function', function(){

           });

           it('should be passed the original arguments', function(){
               cloak(foo, 'setBar').withFunction(otherObj.otherFunction);
               foo.setBar(5);
               expect(otherValue).toBe(5);
           });
       });

        describe('when', function(){
            it('should allow the next with call to be applied when the condition passed is true', function(){

            });

            it('should not allow the next with call to be applied when the condition passed is false', function(){

            });
        });
    });

    describe('uncloak', function(){
       it('should return the function to it\'s original state', function(){

       });
    });
});