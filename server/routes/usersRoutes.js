import { Router } from 'express';
import * as userControllers from '../controllers/usersController.js';
import logout from '../middelwares/logout.js';
import expressValidator from '../middelwares/express-validator.js';
import loginMiddleware from '../middelwares/login.js';
import loginValidation from '../middelwares/loginValidation.js';
import isAuthenticated from '../middelwares/isAuthenticated.js';

const router = Router();

router.route('/login')
    .get(userControllers.login)
    .post(loginValidation(), loginMiddleware);

router.route('/register')
    .get(userControllers.registration)
    .post(expressValidator, userControllers.registrationOnPost);

router.route('/verify-email')
    .get(userControllers.verify)
    .post(userControllers.verifyOnPost);

router.route('/resend')
    .post(userControllers.resendOnPost);

router.post('/logout', logout);

router.route('/dashboard/users/:id')
    .get(isAuthenticated, userControllers.dashboard);

router.delete('/account/:id', isAuthenticated, userControllers.deleteAccount);

export default router;