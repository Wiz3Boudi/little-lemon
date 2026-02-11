import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import methodOverride from 'method-override';
import sessionConfiguration from './server/config/session.js';
import passportConfiguration from './server/config/passport.js';

const app = express()
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout/main');

app.use(sessionConfiguration(session));
app.use(flash());
passportConfiguration();
app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1);
import router from './server/routes/index.route.js';
import userRouter from './server/routes/usersRoutes.js';
import * as controllers from './server/controllers/index.controller.js';

// ensure global data (logo, user, flash messages) is available for all views
app.use(controllers.globalMiddleware);

app.use('/', userRouter);
app.use('/', router);

app.listen(port, () => console.log('Server running on port:', port));