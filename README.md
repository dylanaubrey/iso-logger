# iso-logger
An isomorphic logger that uses Winston on the server and console on the client.

[![Build Status](https://travis-ci.org/dylanaubrey/iso-logger.svg?branch=master)](https://travis-ci.org/dylanaubrey/iso-logger)
[![codecov](https://codecov.io/gh/dylanaubrey/iso-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/dylanaubrey/iso-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/iso-logger.svg)](https://badge.fury.io/js/iso-logger)
[![dependencies Status](https://david-dm.org/dylanaubrey/iso-logger/status.svg)](https://david-dm.org/dylanaubrey/iso-logger)
[![devDependencies Status](https://david-dm.org/dylanaubrey/iso-logger/dev-status.svg)](https://david-dm.org/dylanaubrey/iso-logger?type=dev)

[![NPM](https://nodei.co/npm/iso-logger.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/iso-logger/)
[![NPM](https://nodei.co/npm-dl/iso-logger.png?months=3&height=2)](https://nodei.co/npm/iso-logger/)

## Installation
```
npm install iso-logger --save
```

## Initialisation
```javascript
// package.json
"scripts": {
  "bundle:node": "cross-env NODE_ENV=development webpack"
  "bundle:web": "cross-env NODE_ENV=development WEB_ENV=true webpack"
}
```
```javascript
// webpack.config.js
plugins: [
  new webpack.EnvironmentPlugin(['NODE_ENV', 'WEB_ENV']),
]
```
```javascript
// logger/index.js
import Logger from 'iso-logger';

const level = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
export default new Logger({ consoleOptions: { level }, winstonOptions: { level } });
```

## Usage
```javascript
// server.js
import logger from './logger';

app.use(logger.requests(['cookies', 'headers', 'method']))
```
```javascript
// module/index.js
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

### More to follow...
