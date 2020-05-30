import express from 'express';
import api from './api';
import db from './models';

export function getPort(): number {
  const portString: string = process.env.PORT || "";
  let port: number;
  try {
    port = parseInt(portString, 10);
  } catch (err) {
    port = 3000;
  }
  return port;  
}

export function startAPI(api: express.Application, port: number): void {
  db.sequelize.sync().then(function () {
    api.listen(getPort(), () => {
      console.log(`Ready and listening on port ${port}`);
    }).on('error', (err: Error) => {
      console.log('ERROR!!!', err);
      throw err;
    });
  });
}

if (module.parent === undefined) {
  // Started from command line
  const port = getPort();
  startAPI(api, port);
}
