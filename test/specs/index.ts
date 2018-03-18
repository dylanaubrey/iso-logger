import { expect, use } from "chai";
import { SinonStub, stub } from "sinon";
import * as sinonChai from "sinon-chai";
import { LoggerInstance } from "winston";
import { Logger } from "../../src";
import ConsoleProxy from "../../src/console-proxy";

use(sinonChai);

if (!process.env.WEB_ENV) {
  describe('when WEB_ENV variable is not set to "true"', () => {
    describe("when no winstonOptions are passed in", () => {
      it("should create an instance of the winston logger with the default options", () => {
        const logger = new Logger();
        const client = logger.client as LoggerInstance;
        const winston = require("winston");
        expect(client).instanceof(winston.Logger);
        expect(client.level).to.eql("info");
        expect(Object.keys(client.transports)).to.eql(["console"]);
      });
    });

    describe("when winstonOptions are passed in", () => {
      it("should create an instance of the winston logger with the merged options", () => {
        const winstonOptions = {
          level: "error",
          transports: {
            File: { filename: "file.log", json: true },
            Test: { json: true },
          },
        };

        const logger = new Logger({ newInstance: true, winstonOptions });
        const client = logger.client as LoggerInstance;
        expect(client.level).to.eql("error");
        expect(Object.keys(client.transports)).to.eql(["file"]);
      });
    });
  });
} else {
  describe('when WEB_ENV variable is set to "true"', () => {
    it("should create an instance of the console logger with the default options", () => {
      const logger = new Logger({ newInstance: true });
      const client = logger.client as ConsoleProxy;
      expect(client.console).to.equal(console);
    });
  });
}

describe('when "newInstance" is not passed in as an argument', () => {
  it("should return the same instance of the Logger class", () => {
    const logger = new Logger();
    const instance = new Logger();
    expect(logger).to.equal(instance);
  });
});

describe('when "true" is passed in as the "newInstance" argument', () => {
  it("should return the same instance of the Logger class", () => {
    const logger = new Logger();
    const instance = new Logger({ newInstance: true });
    expect(logger).not.to.equal(instance);
  });
});

describe("when the logger logs information", () => {
  let logger: Logger;
  let logStub: SinonStub;

  before(() => {
    logger = new Logger({ newInstance: true });
  });

  beforeEach(() => {
    logStub = stub(logger.client, "log");
  });

  afterEach(() => {
    logStub.restore();
  });

  describe("when it logs an error", () => {
    it("should call call the .log() method with the correct arguments", () => {
      const message = "This is an error message";
      logger.error(message);
      expect(logStub).to.have.been.calledWith("error", message, undefined);
    });
  });

  describe("when it logs a warning", () => {
    it("should call call the .log() method with the correct arguments", () => {
      const message = "This is an warning message";
      logger.warn(message);
      expect(logStub).to.have.been.calledWith("warn", message, undefined);
    });
  });

  describe("when it logs information with .info()", () => {
    it("should call call the .log() method with the correct arguments", () => {
      const message = "This is informationn";
      logger.info(message);
      expect(logStub).to.have.been.calledWith("info", message, undefined);
    });
  });

  describe("when it logs information with .verbose()", () => {
    it("should call call the .log() method with the correct arguments", () => {
      const message = "This is verbose information";
      logger.verbose(message);
      expect(logStub).to.have.been.calledWith("verbose", message, undefined);
    });
  });

  describe("when it logs information with .debug()", () => {
    it("should call call the .log() method with the correct arguments", () => {
      const message = "This is debug information";
      logger.debug(message);
      expect(logStub).to.have.been.calledWith("debug", message, undefined);
    });
  });
});
