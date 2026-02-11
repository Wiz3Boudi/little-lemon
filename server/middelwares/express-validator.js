import { body } from 'express-validator';

export default [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username required'),
    body('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Please provide valied email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .escape(),

];