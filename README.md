# Walker

Walker is a file system walker, i.e. it lets you traverse a directory recursively listing its files and sub-directories.
It was inspired by Python's [os.walk()](https://docs.python.org/3.6/library/os.html#os.walk).

Run this to install:

```bash
npm i @eit6609/walker
```

## Examples

There are two functions in walker, one synchronous and one asynchronous. The first is the direct translation of Python's
`os.walk()`, while the latter is more in the Node mainstream. The choice is yours.

This is an example of `walk()`, the synchronous API:

```js
const { walk } = require('@eit6609/walker');

for (const [dirPath, dirNames, fileNames] of walk('/path/to/dir')) {
    console.log(`Members of ${dirPath}:`);
    console.log('- directories:', dirNames);
    console.log('- files:', fileNames);
}
```

Compare it with its Python's equivalent:

```python
from os import walk;

for dirPath, dirNames, fileNames in walk('/path/to/dir'):
    print('Members of {}:'.format(dirPath));
    print('- directories:', dirNames);
    print('- files:', fileNames);
```

This is an example of `walkAsync()`, the asynchronous API:

```js
const { walkAsync } = require('@eit6609/walker');

for (const promise of walkAsync('/path/to/dir')) {
    const [dirPath, dirNames, fileNames] = await promise;
    console.log(`Members of ${dirPath}:`);
    console.log('- directories:', dirNames);
    console.log('- files:', fileNames);
}
```

## API Reference

### `walk()`

```js
function walk(dirPath: string): iterator
```

It takes a string with the path (absolute or relative) of the directory to scan.

The result is a JavaScript [iterator](https://developer.mozilla.org/it/docs/Web/JavaScript/Guide/Iterators_and_generators)
which can be used in a `for...of` loop or "unrolled" to an array with `[...walk('/path/to/dir')]`.

At every step the iterator yields an array containing three items:

* a string with the path of the directory
* an array of strings with the names of the subdirectories
* an array of strings with the names of the files

The arrays contain *names*. If you need the path of a file or a directory, you can build it using `path.join()`:

```js
const
    { join } = require('path'),
    { walk } = require('@eit6609/walker');

for (const [dirPath, dirNames, fileNames] of walk('/path/to/dir')) {
    for (let i = 0; i < fileNames.length; i++) {
        console.log(join(dirPath, fileNames[i]));
    }
}
```

This is the behaviour of the traversal:

* it proceeds top down
* it follows the symbolic links representing directories

The second item of the result, i.e. the array with the names of the directories, can be used to change the traversal,
because it will be used in the next step of the iteration. This means that if you add or remove names to the array,
or rearrange the names, the next step will behave differently. Quoting the docs of Python's `os.walk()`:

>You can therefore prune the search, impose a specific order of visiting, or even inform walk() about directories the
>caller creates or renames before it resumes walk() again.

### `walkAsync()`

```js
function walkAsync(dirPath: string): promise of iterator
```

The only difference with `walk()` is that the iterator yields a *promise* of the result, that needs to be resolved with
`await` or `then()`.

Enjoy!
