import { body } from 'express-validator';

export default () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email address')
            .normalizeEmail(),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password required')
    ];
};