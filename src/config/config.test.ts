import { mocked } from 'ts-jest/utils';

import config, {
  getEnvironment,
  loadAppConfig,
  ConfigObject,
  API
} from "./config";

import path from 'path';
import fs from 'fs';
import merge from '../utils/merge';
import express from 'express';

jest.mock('path');
jest.mock('fs');
jest.mock('../utils/merge', () => {
  return { default: jest.fn() };
});
const filePath: string = '/path/to/config.json',
  configObject: ConfigObject = {
    base: { base_key: 'all envs' },
    production: { prod_key: 'from prod' },
    test: { test_key: 'from test' },
    ci: { ci_key: 'from ci' },
    development: { dev_key: 'from dev' }
  },
  fileBuffer: Buffer = Buffer.from(JSON.stringify(configObject), 'utf-8');
mocked(path).resolve = jest.fn().mockReturnValue(filePath);
mocked(fs).readFileSync = jest.fn().mockReturnValue(fileBuffer);

describe('config', () => {
  describe('getEnvironment', () => {
    test('should return the expected environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      expect(getEnvironment()).toEqual('production');
      process.env.NODE_ENV = 'test';
      expect(getEnvironment()).toEqual('test');
      process.env.NODE_ENV = 'ci';
      expect(getEnvironment()).toEqual('test');
      process.env.NODE_ENV = 'development';
      expect(getEnvironment()).toEqual('development');
      process.env.NODE_ENV = originalEnv;
    });
    test('should default to development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = '';
      expect(getEnvironment()).toEqual('development');
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('loadAppConfig', () => {
    test('should call path.resolve', () => {
      loadAppConfig('test');
      expect(path.resolve).toHaveBeenCalledTimes(1);
    });
    test('should call fs.loadFileSync', () => {
      loadAppConfig('test');
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath)
    });
    test('should call merge', () => {
      loadAppConfig('test');
      expect(mocked(merge)).toHaveBeenCalledWith(
        configObject.base,
        configObject.test
      );
    });
    test('should return the expected config data', () => {
      const configData = loadAppConfig('test');
      for (const key in configObject.base) {
        expect(configData.hasOwnProperty(key));
        expect(configData[key] === configObject.base[key]);
      }
    });
  });

  describe('config', () => {
    test('it should return an API', () => {
      const app: express.Application = express();
      let api: API = config(app, 'test');
      expect(api).toHaveProperty('customConfig');
      expect(api).toHaveProperty('apiEnvironment');
      expect(api.apiEnvironment).toEqual('test');
    });
  });
});
