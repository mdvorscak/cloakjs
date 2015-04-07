## API
All cloak methods are chain-able.

### cloak(object, method)
Calling `cloak` wraps the original function. A cloak instance is returned when calling `cloak`.
`cloak` will throw an error if the type of `object[method]` is not a function.
This must be the first function you call before you can call any other function.

### cloak.cloakWith(fn)
Replaces the original function with the function provided with the `fn` parameter. 
Multiple calls to this function may be used in succession, all will be called when the cloaked function is called;
for example:

```js
cloak(foo, 'bar').cloakWith(foo.baz).cloakWith(foo.too);
foo.bar(); // foo.baz and foo.too will both be called
```

Note that all new functions will be called in order that they were given. However, if these functions are asynchronous
it is possible that the next function will begin before the first one ends.
In the previous example `foo.baz` would be called first then `foo.too`

### cloak.when(condition)
Adds a conditional check to each future [cloaking function](Glossary.md#cloaking-function). 
The `condition` parameter can either be a boolean or a function.
If it is a function, it will be evaluated when the cloaked function is called (each time). 
This is useful if you need to check certain things about the state before calling the cloaking function.
You can access the parameters of the cloaked function in your when callback. 
This callback is also run in the same context as the cloaked function. See example:

```js
function whenTest(arg1, arg2){
    //here this refers to console (the object that is being cloaked)
    this.warn('hi'); // the console will warn 'hi'
    return arg1 > arg2;
}
cloak(console, 'log').when(whenTest).callOriginal();
console.log(1, 2); //nothing will be logged
console.log(2, 1); //2 1 will be logged
```

If multiple when conditions are used together, the rule is always: 
**the cloaking function will be run ONLY if the previous when condition is true**

### cloak.before(fn)
Every function provided as the `fn` parameter will be run before any of the other cloaking functions. 
This has the same effect as ordering your cloakWith functions differently. The advantage here is that using before 
makes your code more readable. Below is a quick example to illustrate:

```js
cloak(foo, 'bar').when(theTimeIsRight).cloakWith(myNewBar).before(startFunctionTimer)
//Is equivalent to 
cloak(foo, 'bar').when(theTimeIsRight).cloakWith(startFunctionTimer).cloakWith(myNewBar)
```
### cloak.after(fn)
This is the same as the before function, except the function provided in the `fn` parameter is run *after* the rest of the cloaking functions.

### cloak.callOriginal()
Calls the original function, the same [conditional rules][1] apply to this function as they do to the other cloaking functions.

[1]: #cloak.when(condition)
### cloak.uncloak()
Unwraps the cloaked object, restoring it to it's original state. 
You must have a reference to the original cloak instance to use this function (see example).

```js
var myCloakReference = cloak(foo, 'bar').cloakWith(myNewBar);
myCloakReference.uncloak();
```

### No-op properties
Some no-op properties have been added to make the interface more fluent.
They do nothing other than make your code more readable.

#### and
Example usage:
```js
cloak(foo, 'bar').when(theTimeIsRight).cloakWith(startFunctionTimer).and.cloakWith(myNewBar)
```

### Accessing the original function
Inside of a cloaking function you may want to use the original function. 
The original function can be accessed as the final parameter of cloaking function. See example:

```js
var bar;
var foo = {
    setBar: function(val){
        bar = val;
    }
};

cloak(foo, 'setBar').cloakWith(function(val, originalFn){
    originalFn(val + 5);
});
foo.setBar(5); // bar is now 10
```