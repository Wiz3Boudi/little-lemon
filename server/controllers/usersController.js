import { User } from '../config/index.model.js';
import { sendOTP } from '../config/verifyEmail.js';
import { validationResult } from 'express-validator';

export const login = async (req, res) => {
    try {
        const errorFlash = req.flash('error-messages');
        res.render('login', { errorFlash: errorFlash[0] || '' })
    } catch (error) {
        console.error(error.message);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/login');
        })
    }
};
export const registration = async (req, res) => {
    try {
        const errorFlash = req.flash('error-messages');
        const successFlash = req.flash('success-messages');

        return res.render('register', { successFlash: successFlash[0] || '', errorFlash: errorFlash[0] || '' });
    } catch (error) {
        console.error(error.message);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/register');
        });
    };
};
export const registrationOnPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMsg = errors.errors[0].msg;
            req.flash('error-messages', errorMsg);
            return req.session.save((err) => {
                if (err) console.log('Session save error:', err);
                res.redirect('/register')
            })
        }
        const { username, email, password } = req.body;
        const existedUser = await User.findOne({ where: { email } });
        if (existedUser?.isVerified) {
            req.flash('error-messages', 'Email is already registered. Please log in.');
            return req.session.save((err) => {
                if (err) console.log('Session save error:', err);
                res.redirect('/login')
            });
        }

        if (req.session.otp?.lastSend > Date.now()) {
            req.flash('error-messages', 'Check you email box we have send verifcation code')
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/register');
            })
        }
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (!existedUser) {
            await User.create({ username, email, password });
        }
        req.session.otp = {
            email,
            code: randomCode,
            expireAt: Date.now() + 10 * 60 * 1000,
            lastSend: Date.now() + 3 * 60 * 1000
        };
        await sendOTP(email, randomCode);
        req.session.save((err) => {
            if (err) console.error(err);
            return res.redirect('/verify-email');
        });
    } catch (error) {
        console.error(error.message);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/register');
        });
    };
};
export const verify = async (req, res) => {
    try {
        const email = req.session.otp?.email;
        const successFlash = req.flash('success-messages');
        const errorFlash = req.flash('error-messages')
        return res.render('verify', { successFlash, errorFlash: errorFlash[0] || '', email });
    } catch (error) {
        console.error(error);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/verify-email');
        });
    };
};
export const verifyOnPost = async (req, res) => {
    try {
        const code = req.body.code;
        const otpData = req.session.otp;

        if (!otpData) {
            req.flash('error-messages', 'No session data. please register ');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/register');
            })
        };

        if (!code) {
            req.flash('error-messages', 'Please enter the 6 digit');
            return req.session.save((err) => {
                if (err) console.log(err);
                res.redirect('/verify-email')
            })
        };

        if (Date.now() > otpData.expireAt) {
            req.flash('error-messages', 'OTP has expired. Please request another one.');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/verify-email');
            })
        };

        if (code.toString() !== otpData.code) {
            req.flash('error-messages', 'Invalid OTP code. Please try again.');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/verify-email')
            })
        }
        const user = await User.findOne({ where: { email: otpData.email } });
        if (!user) {
            req.flash('error-messages', 'User is found. try register');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/register');
            });
        };
        await user.update({ isVerified: true });

        req.login(user, (err) => {
            if (err) {
                console.error(err);
            };
            delete req.session.otp;
            return res.redirect('/home');
        })
    } catch (error) {
        console.error(error);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/verify-email')
        });
    };
};
export const resendOnPost = async (req, res) => {
    try {
        const otpData = req.session.otp;

        if (!otpData || !otpData.email) {
            req.flash('error-messages', 'Session expired or missing! Try signing up again.');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/verify-email');
            });
        };

        const currentTime = Date.now();
        if (Number(otpData.lastSend) > currentTime) {
            const timeLeftMs = Number(otpData.lastSend) - currentTime;
            const minutesLeft = Math.ceil(timeLeftMs / (60 * 1000));
            req.flash('error-messages', `Please wait ${minutesLeft} more minute before resending. Retry in second is ${Math.floor(timeLeftMs / 1000)} left.`);
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/verify-email');
            });
        }

        const email = otpData.email;
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newExpireAt = Date.now() + 10 * 60 * 1000;
        const newLimit = Date.now() + 3 * 60 * 1000;

        req.session.otp = {
            email: email,
            code: newCode,
            expireAt: newExpireAt,
            lastSend: newLimit
        };

        req.session.save(async (err) => {
            if (err) console.error(err);
            await sendOTP(email, newCode);
            return res.redirect('/verify-email')
        });

    } catch (error) {
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/verify-email');
        });
    }
};
export const dashboard = async (req, res) => {
    try {
        const user = req.user || null;
        delete user.dataValues.password;

        return res.render('dashboard', { user })
    } catch (error) {
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/home');
        });
    }
};
export const deleteAccount = async (req, res) => {
    try {
        const idParam = req.params.id;
        const currentUser = req.user;

        if (!currentUser) {
            req.flash('error-messages', 'You must be logged in to delete an account.');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/login');
            }
            );
        }

        const targetId = Number(idParam || currentUser.id);
        if (Number(currentUser.id) !== targetId) {
            req.flash('error-messages', 'Unauthorized action.');
            return req.session.save((err) => {
                if (err) console.error(err);
                return res.redirect('/home');
            });
        }

        const found = await User.findByPk(targetId);
        if (!found) {
            req.flash('error-messages', 'User not found.');
            return req.session.save((err) => {
                if (err) console.error(err);
                return res.redirect('/home');
            });
        }

        await found.destroy();

        req.logout((err) => {
            if (err) {
                console.error('Logout after delete error:', err);
                req.flash('error-messages', 'Account deleted but there was an error logging out.');
                return req.session.save((sErr) => {
                    if (sErr) console.error(sErr);
                    res.redirect('/login');
                });
            }
            req.session.destroy((sErr) => {
                if (sErr) console.error(sErr);
                res.clearCookie('connect.sid');
                return res.redirect('/register');
            });
        });
    } catch (error) {
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/home');
        });
    }
};