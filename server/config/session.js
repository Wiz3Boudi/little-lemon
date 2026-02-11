import sequelizeStore from 'connect-session-sequelize';
import { connection } from './index.model.js';
import {config} from 'dotenv';
config();

export default (session)=>{
    const STORE =  sequelizeStore(session.Store);
    const store = new STORE({
        db: connection,
        tableName: 'session',
        expiration: 24 * 60 * 60 * 1000,
        checkExpirationInterval: 15 * 60 * 1000
    });

    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie:{
            secure: true,
            // httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        }
    })
}