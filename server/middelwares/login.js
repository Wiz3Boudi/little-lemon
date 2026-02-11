import passport from "passport";
import { validationResult } from 'express-validator';

const saveAndRedirect = (req, res, flashType, message, redirectUrl) => {
    return new Promise((resolve) => {
        req.flash(flashType, message);
        req.session.save((err) => {
            if (err) console.error('Session save error:', err);
            res.redirect(redirectUrl);
            resolve();
        });
    });
};

export default async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.errors[0].msg;
            req.flash('error-messages', errorMessages);
            req.session.oldInput = {
                email: req.body.email || ''
            };
            return req.session.save((err) => {
                if (err) console.error('Error saving session:', err);
                res.redirect('/login');
            });
        }

        return passport.authenticate('local', async (err, user, info) => {
            try {
                if (err) {
                    console.error('Auth error:', err);
                    return await saveAndRedirect(req, res, 'error-messages', 'Something went wrong. Please try again.', '/login');
                }
                if (!user) {
                    const message = info?.message || 'Invalid credentials';
                    return await saveAndRedirect(req, res, 'error-messages', message, '/login');
                }
                req.logIn(user, async (loginErr) => {
                    try {
                        if (loginErr) {
                            console.error('Login error:', loginErr);
                            return await saveAndRedirect(req, res, 'error-messages', 'Login error. Please try again.', '/login');
                        }
                        if (req.session.oldInput) {
                            delete req.session.oldInput;
                        }
                        return await saveAndRedirect(req, res, 'success-messages', `Welcome back, ${user.name || user.email}!`, '/home');

                    } catch (innerError) {
                        console.error('Error in login callback:', innerError);
                        return await saveAndRedirect(req, res, 'error-messages', 'An unexpected error occurred', '/login');
                    }
                });

            } catch (callbackError) {
                console.error('Error in auth callback:', callbackError);
                return await saveAndRedirect(req, res, 'error-messages', 'Authentication process failed', '/login');
            }
        })(req, res, next);

    } catch (outerError) {
        console.error('Outer auth middleware error:', outerError);
        return await saveAndRedirect(req, res, 'error-messages', 'Authentication system error', '/login');
    }
};