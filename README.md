# cloak.js
**A small AOP/Proxy/Wrapper library with a fluent interface**

[![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

# Basic examples
```js
function myAlertFn(msg){
    console.warn('don\'t use alerts please!');
    console.log(msg);
}

cloak(window, 'alert').cloakWith(myAlertFn);

window.alert('test'); //The result will be in the console (warn): "don't use alerts please!"
                      //Then in the console (log): "test"

//you can also conditionally cloak things
//This example would use a custom logger when 'myIETest' is true
//Otherwise it would just use console.log
cloak(console, 'log').when(myIETest).cloakWith(myLoggerFn)
                     .when(!myIETest).callOriginal;
```

# Installation
    npm install --save-dev cloakjs 
or

    bower install cloakjs

# Documentation
To learn more checkout the [documentation page] (docs/README.md)

# License
MIT - [view the full license here] (LICENSE)

[travis-url]: https://travis-ci.org/mdvorscak/cloakjs
[travis-image]: https://travis-ci.org/mdvorscak/cloakjs.svg?branch=master

[coveralls-url]: https://coveralls.io/r/mdvorscak/cloakjs?branch=master
[coveralls-image]: https://coveralls.io/repos/mdvorscak/cloakjs/badge.svg?branch=master