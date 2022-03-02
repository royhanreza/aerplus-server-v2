const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const config = require('../config');
const routes = require('../api');
// const Logger = require('./logger');

module.exports = async ({ app }) => {
  app.get('/', (req, res) => {
    res.send('<h1>Protected Site</h1>');
  });

  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  // var corsOptions = {
  //   origin: "http://localhost:3000",
  //   optionsSuccessStatus: 200, // some legacy browsers IE11, various SmartTVs) choke on 204
  // };
  app.use(cors());

  // Transforms the raw string of req.body into json
  app.use(express.json());
  // Receive application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // Load API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /// error handlers
  // app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //   /**
  //    * Handle 401 thrown by express-jwt library
  //    */
  //   if (isCelebrateError(err)) {
  //     const errorBody = err.details.get("body"); // 'details' is a Map()
  //     const {
  //       details: [errorDetails],
  //     } = errorBody;
  //     return res.status(400).send({
  //       // status_code: 400,
  //       message: "validation errors",
  //       errors: errorDetails,
  //     });
  //   }
  //   return next(err);
  // });
  // Use Errors from celebrate
  app.use(errors());

  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    // Logger.info('pass unauthorized error');
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }
    // Logger.info('passing to next route');
    return next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // Logger.info('pass last error');
    res.status(err.status || 500);
    res.json({
      message: err?.message || err,
      error: true,
      code: err.status || 500,
      errors: err,
      // err: err.message,
    });
  });
};
