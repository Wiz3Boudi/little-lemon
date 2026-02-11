import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from '../config/index.model.js';

export default () => {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ where: { email } });
                    if (!user) {
                        return done(null, false, { message: 'Account dose not exist register instead' });
                    }
                    if (user.isVerified === false) {
                        return done(null, false, { message: 'This account need to be verified !' })
                    }
                    const isMatched = await bcrypt.compare(password, user.password);

                    if (!isMatched) {
                        return done(null, false, { message: 'Incorrect password' })
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, null)
        }
    })
}