# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.0.0"></a>
# [5.0.0](https://github.com/micromata/http-fake-backend/compare/4.1.0...5.0.0) (2023-10-20)


### Bug Fixes

* Update dependencies ([48f013a](https://github.com/micromata/http-fake-backend/commit/48f013a))


### BREAKING CHANGES

* This project now needs Node 18 or greater.



<a name="4.1.0"></a>
# [4.1.0](https://github.com/micromata/http-fake-backend/compare/4.0.3...4.1.0) (2018-02-21)


### Features

* Add possibility to define custom response header ([ef26157](https://github.com/micromata/http-fake-backend/commit/ef26157)), closes [#10](https://github.com/micromata/http-fake-backend/issues/10)



<a name="4.0.3"></a>
## [4.0.3](https://github.com/micromata/http-fake-backend/compare/4.0.2...4.0.3) (2018-02-19)


### Bug Fixes

* Update dependencies ([89ebc52](https://github.com/micromata/http-fake-backend/commit/89ebc52))



<a name="4.0.2"></a>
## [4.0.2](https://github.com/micromata/http-fake-backend/compare/4.0.1...4.0.2) (2017-12-06)


### Bug Fixes

* update minimum node version in package.json ([131d0ab](https://github.com/micromata/http-fake-backend/commit/131d0ab))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/micromata/http-fake-backend/compare/4.0.0...4.0.1) (2017-12-04)


### Bug Fixes

* encoding of binary files send via endpoints ([677b572](https://github.com/micromata/http-fake-backend/commit/677b572))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/micromata/http-fake-backend/compare/v3.2.4...v4.0.0) (2017-12-04)


### Bug Fixes

* **dependencies:** Apply changes of boom update ([a17f805](https://github.com/micromata/http-fake-backend/commit/a17f805))
* **dependencies:** Update dependencies ([ab5974a](https://github.com/micromata/http-fake-backend/commit/ab5974a))
* **dependencies:** Update dependencies ([f362c9c](https://github.com/micromata/http-fake-backend/commit/f362c9c))
* update dependencies ([bbd445b](https://github.com/micromata/http-fake-backend/commit/bbd445b))


### Code Refactoring

* Refactor existing codebase ([3751899](https://github.com/micromata/http-fake-backend/commit/3751899))


### Documentation

* Update required minimum Node version in readme ([e1c549b](https://github.com/micromata/http-fake-backend/commit/e1c549b))


### Features

* Add support for other response content-types ([c9a7d12](https://github.com/micromata/http-fake-backend/commit/c9a7d12)), closes [#7](https://github.com/micromata/http-fake-backend/issues/7)
* Add support for sending files as response ([70d535f](https://github.com/micromata/http-fake-backend/commit/70d535f)), closes [#11](https://github.com/micromata/http-fake-backend/issues/11)


### BREAKING CHANGES

* The transitive dependency punycode@2.1.0 needs Node version ">=6".
* The setup.js is divided to multiple files.
Therefore you need to change the import of the setup in your endpoint files
like the following:

    ```
  // before
  const SetupEndpoint = require('./setup/setup.js');

  // now
  const SetupEndpoint = require('./setup/index.js');

  // or:
  const SetupEndpoint = require('./setup/');
  ```
