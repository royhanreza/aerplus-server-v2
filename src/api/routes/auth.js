const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const AuthService = require('../../services/auth');
const Logger = require('../../loaders/logger');

const route = Router();
// const prisma = new PrismaClient();

const celebrateOptions = {
  abortEarly: false,
};

const AuthServiceInstance = AuthService;

module.exports = (app) => {
  app.use('/hrd-auth', route);

  /**
   * Auth: Sign In
   */
  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }).options(celebrateOptions),
    }),
    async (req, res, next) => {
      Logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        const { username, password } = req.body;
        const { employee } = await AuthServiceInstance.SignIn(
          username,
          password,
        );
        return res
          .json({
            message: 'sign in successfully',
            code: 200,
            error: false,
            data: employee,
          })
          .status(200);
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  /**
   * Auth: Mobile Sign In
   */
  route.post(
    '/mobile/regular/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }).options(celebrateOptions),
    }),
    async (req, res, next) => {
      Logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        const { username, password } = req.body;
        const { employee } = await AuthServiceInstance.mobileRegularSignIn(
          username,
          password,
        );
        return res
          .json({
            message: 'sign in successfully',
            code: 200,
            error: false,
            data: employee,
          })
          .status(200);
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
