## Glossary of terms

### AOP
[Aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming).

### Cloak
A synonym of [wrap](#wrap).

### Cloaked function
Also called the `original function`, this is the function you provide when calling [cloak][1].

[1]: docs/README.md#cloak(object,-method)

### Cloaking function
Any function which replaces the original function. These are the functions you provide (as parameters) when calling:
[cloakWith][1], [before][2], [after][3]

[1]: docs/README.md#cloak.cloakWith(fn)
[2]: docs/README.md#cloak.before(fn)
[3]: docs/README.md#cloak.after(fn)
### Fluent interface
Also called [method chaining](http://en.wikipedia.org/wiki/Fluent_interface).

### Wrap
The act of creating a [wrapper/proxy](http://en.wikipedia.org/wiki/Proxy_pattern) for a function