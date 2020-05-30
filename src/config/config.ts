import { readFileSync } from 'fs';
import { resolve } from 'path';
import express from 'express';
import merge from '../utils/merge';
import { Config } from 'sequelize/types';

export interface ConfigEnvironmentObject extends Object {
  [key: string]: any
};
export interface ConfigObject {
  base: ConfigEnvironmentObject,
  production: ConfigEnvironmentObject,
  test: ConfigEnvironmentObject,
  ci: ConfigEnvironmentObject,
  development: ConfigEnvironmentObject
}

export function getEnvironment(): string {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'production';
    case 'test':
    case 'ci':
      return 'test';
    default:
      return 'development';
  }
}

export function loadAppConfig(env: string): ConfigEnvironmentObject {
  const configFile = resolve(__dirname, '../../config/config.json');
  const configFileData = readFileSync(configFile);
  const config: ConfigObject = JSON.parse(
    configFileData.toString()
  );
  let configObj: ConfigEnvironmentObject;
  switch (process.env.NODE_ENV) {
    case 'production':
      configObj = config.production;
    case 'test':
      configObj = config.test;
    case 'ci':
      configObj = config.ci;
    default:
      configObj =  config.development;
  }
  const configToMerge: ConfigEnvironmentObject = configObj;
  const merged: ConfigEnvironmentObject = merge(
    config.base, configToMerge
  );
  return merged;
}

export interface API extends express.Application {
  customConfig: any
  apiEnvironment: string
}

export default function config(
  app: express.Application | API,
  env: string
): API {
  const api: API = app as API;
  if (!api.hasOwnProperty('customConfig') || env !== api.apiEnvironment) {
    api.customConfig = loadAppConfig(env);
    api.apiEnvironment = env;
  }
  return api;
};
