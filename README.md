# iso-logger

An isomorphic logger that uses Winston on the server and console on the client.

[![Build Status](https://travis-ci.org/dylanaubrey/iso-logger.svg?branch=master)](https://travis-ci.org/dylanaubrey/iso-logger)
[![codecov](https://codecov.io/gh/dylanaubrey/iso-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/dylanaubrey/iso-logger)
[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=sonarqube:iso-logger)](https://sonarcloud.io/dashboard?id=sonarqube%3Aiso-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/iso-logger.svg)](https://badge.fury.io/js/iso-logger)
[![dependencies Status](https://david-dm.org/dylanaubrey/iso-logger/status.svg)](https://david-dm.org/dylanaubrey/iso-logger)
[![devDependencies Status](https://david-dm.org/dylanaubrey/iso-logger/dev-status.svg)](https://david-dm.org/dylanaubrey/iso-logger?type=dev)

## Installation

```bash
npm install iso-logger --save
```

## Compilation

The WEB_ENV environment variable must be set when you compile your browser bundle in order to exclude Winston from the build.

## Usage

```javascript
// logger.js

import Logger from 'iso-logger';

const level = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
export default new Logger({ consoleOptions: { level }, winstonOptions: { level } });
```

```javascript
// module.js

import logger from './logger';

logger.error('Oops, something went wrong...');
logger.warn('Beware the fury of a patient man.');
logger.info('It is a very sad thing that nowadays there is so little useless information.');

logger.verbose(
  `How doth the little crocodile improve his shining tail. And pour
  the waters of the Nile, on every golden scale. How cheerfully he seems to grin, how
  neatly spreads his claws. And welcomes little fishes in, with gently smiling jaws.`
);

logger.debug('There are only two hard problems in Computer Science: cache invalidation and naming things.');
```

## Documentation

Please read the documentation on the iso-logger [github pages](https://dylanaubrey.github.io/iso-logger).

## License

IsoLogger is MIT Licensed.