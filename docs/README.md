# cloak documentation

* [Glossary] (Glossary.md)
* [API] (API.md)

## FAQs/Pitfalls

### What happens if I never called cloak.when?
The default condition for all cloaking functions is true.

### Why am I getting an error about the callstack being exceeded?
This happens when you reference the cloaked function in your cloaking function, causing a circular reference.
Example of this error:

```js
function myLogFn(){
    console.log('Hi');
}

cloak(console, 'log').cloakWith(myLogFn);

console.log('test');
```

