const express = require('express');
const config = require('./config');
const Logger = require('./loaders/logger');
const loaders = require('./loaders');

async function startServer() {
  const app = express();
  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   * */
  // eslint-disable-next-line global-require
  // await require('./loaders').default({ expressApp: app });
  await loaders({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
      `);
      // console.log(`Server listening on port: ${config.port}`);
    })
    .on('error', (err) => {
      Logger.error(err);
      // console.error(err);
      process.exit(1);
    });
}

startServer();
