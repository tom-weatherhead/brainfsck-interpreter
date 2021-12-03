# brainfsck-interpreter
A Typescript implementation of a brainf*ck interpreter.

(Pardon my language.)

[![build status][build-status-badge-image]][build-status-url]
[![latest tag][latest-tag-badge-image]][latest-tag-url]
[![watchers][watchers-badge-image]][watchers-url]
[![stars][stars-badge-image]][stars-url]
[![issues][issues-badge-image]][issues-url]
[![forks][forks-badge-image]][forks-url]
[![contributors][contributors-badge-image]][contributors-url]
[![branches][branches-badge-image]][branches-url]
[![releases][releases-badge-image]][releases-url]
[![commits][commits-badge-image]][commits-url]
[![last commit][last-commit-badge-image]][last-commit-url]
[![code style: prettier][prettier-badge-image]][prettier-url]
[![license][license-badge-image]][license-url]

The brainf*ck language is a minimalistic imperative programming language, designed by Urban Müller around 1993.

From [the language's Wikipedia page](https://en.wikipedia.org/wiki/Brainfuck#Language_design):

The language consists of eight commands, listed below. A brainf*ck program is a sequence of these commands, possibly interspersed with other characters (which are ignored). The commands are executed sequentially, with some exceptions: an instruction pointer begins at the first command, and each command it points to is executed, after which it normally moves forward to the next command. The program terminates when the instruction pointer moves past the last command.

The brainf*ck language uses a simple machine model consisting of the program and instruction pointer, as well as a one-dimensional array of at least 30,000 byte cells initialized to zero; a movable data pointer (initialized to point to the leftmost byte of the array); and two streams of bytes for input and output (most often connected to a keyboard and a monitor respectively, and using the ASCII character encoding).

The eight language commands each consist of a single character:

| Character | Meaning |
|-----------|---------|
| > | Increment the data pointer (to point to the next cell to the right) |
| < | Decrement the data pointer (to point to the next cell to the left) |
| + | Increment (increase by one) the byte at the data pointer |
| - | Decrement (decrease by one) the byte at the data pointer |
| . | Output the byte at the data pointer |
| , | Accept one byte of input, storing its value in the byte at the data pointer |
| [ | If the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching ] command |
| ] | If the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching [ command |

In a syntactically correct brainf*ck program, each [ character is matched uniquely by a ] character later in the program. This matching is similar to the way ( and ) characters match up into pairs in an algebraic expression.

An example of a "Hello, World!" program:

```
++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>
---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.
```

## Installation and Invocation

After cloning this repo, cd into its directory and do this:

```sh
$ npm run f
$ npm link
```

Now the interpreter can be invoked from the command line via the 'bfi' command.

Example:

```sh
$ bfi examples/hello-world.bf
```

## About the Language

A brainf*ck language reference can be found [here](http://brainfuck.org/brainfuck.html).

For additional brainf*ck resources, please see:

- Wikipedia page: [here](https://en.wikipedia.org/wiki/Brainfuck)
- The language's page at esolangs.org (esoteric programming languages): [here](https://esolangs.org/wiki/Brainfuck)
- Example source code, and more: [here](http://brainfuck.org/)
- An online interpreter: [here](https://bf.doleczek.pl/)
- An interpreter plus visualizer: [here](https://github.com/fatiherikli/brainfuck-visualizer)
- An x86_64 compiler for Linux: [here](https://github.com/depsterr/bc)
- A brainf*ck 'torture test': [here](https://github.com/rdebath/Brainfuck)

## Notes to self

TODO: When tests are added, add these devDependencies:

```sh
$ npm i -D @babel/core @babel/preset-env @babel/preset-typescript @types/jest jest
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

[build-status-badge-image]: https://circleci.com/gh/tom-weatherhead/brainfsck-interpreter.svg?style=shield
[build-status-url]: https://circleci.com/gh/tom-weatherhead/brainfsck-interpreter
[latest-tag-badge-image]: https://badgen.net/github/tag/tom-weatherhead/brainfsck-interpreter
[latest-tag-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/tags
[watchers-badge-image]: https://badgen.net/github/watchers/tom-weatherhead/brainfsck-interpreter
[watchers-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/watchers
[stars-badge-image]: https://badgen.net/github/stars/tom-weatherhead/brainfsck-interpreter
[stars-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/stargazers
[issues-badge-image]: https://badgen.net/github/issues/tom-weatherhead/brainfsck-interpreter
[issues-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/issues
[forks-badge-image]: https://badgen.net/github/forks/tom-weatherhead/brainfsck-interpreter
[forks-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/network/members
[contributors-badge-image]: https://badgen.net/github/contributors/tom-weatherhead/brainfsck-interpreter
[contributors-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/graphs/contributors
[branches-badge-image]: https://badgen.net/github/branches/tom-weatherhead/brainfsck-interpreter
[branches-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/branches
[releases-badge-image]: https://badgen.net/github/releases/tom-weatherhead/brainfsck-interpreter
[releases-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/releases
[commits-badge-image]: https://badgen.net/github/commits/tom-weatherhead/brainfsck-interpreter
[commits-url]: https://github.com/tom-weatherhead/brainfsck-interpreter/commits/master
[last-commit-badge-image]: https://badgen.net/github/last-commit/tom-weatherhead/brainfsck-interpreter
[last-commit-url]: https://github.com/tom-weatherhead/brainfsck-interpreter
[prettier-badge-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-badge-image]: https://img.shields.io/github/license/mashape/apistatus.svg
[license-url]: https://github.com/tom-weatherhead/thaw-grammar/blob/master/LICENSE
