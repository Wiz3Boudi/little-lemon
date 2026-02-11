import { Sequelize, Op } from 'sequelize';

import initLogo from '../models/logo.model.js';
import initCardsModel from '../models/cards.model.js';
import initTestimony from '../models/Testimony.model.js';
import initLocationModel from '../models/address-image.js';
import initReservetion  from '../models/reserve-table.model.js';
import initUserModel from '../models/users.model.js';

import dotenv from 'dotenv';
dotenv.config();
const connection = new Sequelize(process.env.DATABASE_CONNECTION, { dialect: 'mysql', logging: false });
connection.authenticate()
  .then(() => console.log('connected to database server!'))
  .catch(err => console.log(err.message));

const Logo = initLogo(connection);
const Cards = initCardsModel(connection);
const Testimonies = initTestimony(connection);
const Location = initLocationModel(connection);
const reservetion = initReservetion(connection);
const User = initUserModel(connection)
// connection.sync({alter:true})

export default connection;
export { connection , Cards, Logo, Testimonies, Location, reservetion, User, Op}