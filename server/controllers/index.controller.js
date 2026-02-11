import { Logo, Cards, Testimonies, Location, reservetion, User } from '../config/index.model.js';
import { sendCRM } from '../config/sendConfirmMessage.js';

export const globalMiddleware = async (req, res, next) => {
    try {
        if (!req.session.viewCount) req.session.viewCount = 1;
        req.session.viewCount++;
        const user = req.user || null;
        const response = await Logo.findAll({ raw: true });
        if (!response || response.length === 0) {
            return next();
        }
        res.locals.consestantDAta = {
            response,
            user
        };
        return next();
    } catch (error) {
        next(error.message);
    }
};
export const homePage = async (req, res) => {
    try {

        const cards = await Cards.findAll({ raw: true });
        const TestimoniesData = await Testimonies.findAll({ raw: true });
        const LocationS = await Location.findAll({ raw: true });

        if (!cards || cards.length === 0) return console.log('items not found !');
        if (!TestimoniesData || TestimoniesData.length === 0) return console.log('items not found !')
        if (!LocationS || LocationS.length === 0) return console.log('items not found !')

        const data = { cards, TestimoniesData, LocationS };
        return res.render('index', {
            data
        })
    } catch (error) {
        console.error(error);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/home');
        });
    }
};
export const reserveTabale = async (req, res) => {
    try {
        const errorMessages = req.flash('error-messages');
        const successMessage = req.flash('success-messages');
        return res.render('reserve-table', { errorMessages, successMessage })
    } catch (error) {
        console.error(error);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/reservation');
        });
    };
};
export const receiveTableReservtionInfo = async (req, res) => {
    try {
        if (!req.body) {
            req.flash('error-messages', 'Please fill out the form');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/reservation');
            });
        };
        if (req.body.pickTime === 'Choose time') {

            req.flash('error-messages', 'Please select time');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/reservation');
            });
        }
        if (req.body.occasion === 'pick an occasion') {
            req.flash('error-messages', 'Please choose an occasion');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/reservation');
            });
        }
        const { chooseDate, pickTime, numberOfGuest, occasion, seatingOption } = req.body;
        const email = req.user ? req.user.email : null;

        const response = await reservetion.create({
            email,
            choosenDate: chooseDate,
            time: pickTime,
            numberOfGuest: numberOfGuest,
            occasion: occasion,
            seats: seatingOption
        });

        if (!response) {
            req.flash('error-messages', 'Something went wrong. please try again');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/reservation');
            });
        };

        const userName = await User.findOne({ where: { email } , raw: true });

        if (!userName) {
            req.flash('error-messages', 'Something went wrong. please try again');
            return req.session.save((err) => {
                if (err) console.error(err);
                res.redirect('/reservation');
            });
        }
        await sendCRM(email, response.dataValues, userName.username);

        req.flash('success-messages', 'Your booking has been completed successfully.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/reservation');
        });
    } catch (error) {
        console.error(error);
        req.flash('error-messages', 'An unexpected error occurred. Please try again later.');
        return req.session.save((err) => {
            if (err) console.error(err);
            res.redirect('/reservation');
        });
    }
};
