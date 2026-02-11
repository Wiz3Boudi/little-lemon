import { Sequelize, Op } from 'sequelize';
import mysql2 from 'mysql2';
import initLogo from '../models/logo.model.js';
import initCardsModel from '../models/cards.model.js';
import initTestimony from '../models/Testimony.model.js';
import initLocationModel from '../models/address-image.js';
import initReservetion from '../models/reserve-table.model.js';
import initUserModel from '../models/users.model.js';

import dotenv from 'dotenv';
dotenv.config();
const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectModule: mysql2,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
connection.authenticate()
  .then(() => console.error('connected to database server!'))
  .catch(err => console.log(err.message));

const Logo = initLogo(connection);
const Cards = initCardsModel(connection);
const Testimonies = initTestimony(connection);
const Location = initLocationModel(connection);
const reservetion = initReservetion(connection);
const User = initUserModel(connection)
// connection.sync({alter:true})

export default connection;
export { connection, Cards, Logo, Testimonies, Location, reservetion, User, Op }