[![npm version](https://badge.fury.io/js/angular2-expandable-list.svg)](https://badge.fury.io/js/angular2-expandable-list)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Project Name

> A package to validate your React form.

## Prerequisites

This project requires NodeJS (version 8 or later), NPM, and React project.

## Getting Started

To install and set up the library, run:

```sh
$ npm install validate-your-react
```

## Usage

### basic validation

```js
import { object } from "validate-your-react";

    const userSchema = object({
      email: ["string", "required", "email"],
      password: ["string", "required", "min=6"],
    //...         
    });
    const result = userSchema.validate({email:"test@test.com", password:"testpass"});

    setErrors(result.errors);
    return result.valid;
/* 
 * result = {
 *     errors:{email:"email is required"} 
 *     valid:false
 * }
 * */
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request :sunglasses:
