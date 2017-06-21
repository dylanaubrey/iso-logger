import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import express from 'express';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import request from 'supertest';
import winston from 'winston';
import Logger from '../../src';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when "server" is passed in as the "env" argument', () => {
  describe('when no winstonOptions are passed in', () => {
    it('should create an instance of the winston logger with the default options', () => {
      const logger = new Logger({ env: 'server' });
      expect(logger._client instanceof winston.Logger).to.be.true();
      expect(logger._client.exitOnError).to.eql(false);
      expect(logger._client.level).to.eql('info');
      expect(Object.keys(logger._client.transports)).to.eql(['console']);
    });
  });

  describe('when winstonOptions are passed in', () => {
    const winstonOptions = {
      level: 'error',
      transports: {
        File: { filename: 'file.log', json: true },
        Test: { json: true },
      },
    };

    it('should create an instance of the winston logger with the merged options', () => {
      const logger = new Logger({ env: 'server', winstonOptions });
      expect(logger._client.exitOnError).to.eql(false);
      expect(logger._client.level).to.eql('error');
      expect(Object.keys(logger._client.transports)).to.eql(['file']);
    });
  });
});

describe('when "browser" is passed in as the "env" argument', () => {
  it('should create an instance of the console logger with the default options', () => {
    const logger = new Logger({ env: 'browser' });
    expect(logger._client._console).to.eql(console);
  });
});

describe('when neither "server" nor "browser" is passed in as the "env" argument', () => {
  it('should throw an error', () => {
    expect(() => new Logger()).to.throw(
      'iso-logger: expecting "env" argument to be set to "server" or "browser"',
    );
  });
});

describe('when the winston logger logs information', () => {
  let logger, logStub;

  before(() => {
    logger = new Logger({ env: 'server' });
  });

  beforeEach(() => {
    logStub = stub(logger._client, 'log');
  });

  afterEach(() => {
    logStub.restore();
  });

  describe('when it logs an error', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const message = 'This is an error message';
      logger.error(message);
      expect(logStub).to.have.been.calledWith('error', message, undefined);
    });
  });

  describe('when it logs a warning', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const message = 'This is an warning message';
      logger.warn(message);
      expect(logStub).to.have.been.calledWith('warn', message, undefined);
    });
  });

  describe('when it logs information with .info()', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const message = 'This is informationn';
      logger.info(message);
      expect(logStub).to.have.been.calledWith('info', message, undefined);
    });
  });

  describe('when it logs information with .verbose()', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const message = 'This is verbose information';
      logger.verbose(message);
      expect(logStub).to.have.been.calledWith('verbose', message, undefined);
    });
  });

  describe('when it logs information with .debug()', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const message = 'This is debug information';
      logger.debug(message);
      expect(logStub).to.have.been.calledWith('debug', message, undefined);
    });
  });

  describe('when it logs a request', () => {
    it('should call call the .log() method with the correct arguments', (done) => {
      const app = express();
      app.use(logger.requests(['method', 'path', 'readable']));

      app.get('/', (res) => {
        res.status(200).json({ test: 'successful' });
      });

      const requestMeta = { method: 'GET', path: '/', readable: true };

      request(app)
        .get('/')
        .then(() => {
          expect(logStub).to.have.been.calledWith('info', '/', requestMeta);
          done();
        });
    });
  });
});

describe('when the console logger logs information', () => {
  let logger, logSpy;

  before(() => {
    logger = new Logger({ env: 'browser' });
  });

  beforeEach(() => {
    logSpy = spy(logger._client, 'log');
  });

  afterEach(() => {
    logSpy.restore();
  });

  describe('when it logs an error', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const consoleStub = stub(logger._client._console, 'error');
      const message = 'This is an error message';
      logger.error(message);
      expect(logSpy).to.have.been.calledWith('error', message, undefined);
      expect(consoleStub).to.have.been.called();
      consoleStub.restore();
    });
  });

  describe('when it logs a warning', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const consoleStub = stub(logger._client._console, 'warn');
      const message = 'This is an warning message';
      logger.warn(message);
      expect(logSpy).to.have.been.calledWith('warn', message, undefined);
      expect(consoleStub).to.have.been.called();
      consoleStub.restore();
    });
  });

  describe('when it logs information with .info()', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const consoleStub = stub(logger._client._console, 'info');
      const message = 'This is informationn';
      logger.info(message);
      expect(logSpy).to.have.been.calledWith('info', message, undefined);
      expect(consoleStub).to.have.been.called();
      consoleStub.restore();
    });
  });

  describe('when it logs information with .verbose()', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const consoleStub = stub(logger._client._console, 'log');
      const message = 'This is verbose information';
      logger.verbose(message);
      expect(logSpy).to.have.been.calledWith('verbose', message, undefined);
      expect(consoleStub).not.to.have.been.called();
      consoleStub.restore();
    });
  });

  describe('when it logs information with .debug()', () => {
    it('should call call the .log() method with the correct arguments', () => {
      const consoleStub = stub(logger._client._console, 'log');
      const message = 'This is debug information';
      logger.debug(message);
      expect(logSpy).to.have.been.calledWith('debug', message, undefined);
      expect(consoleStub).not.to.have.been.called();
      consoleStub.restore();
    });
  });
});
