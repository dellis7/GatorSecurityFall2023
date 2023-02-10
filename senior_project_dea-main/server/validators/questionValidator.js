const { body, validationResult } = require('express-validator')

exports.validateQuestion = [
    body('question').notEmpty().withMessage("Question cannot be empty"),
    body('type').notEmpty().withMessage("Type cannot be empty"),
    body('topic').notEmpty().withMessage("Topic cannot be empty"),
    body('topic').isFloat({ min:0, max:6 }).withMessage("The topic must be a numeric identifier between 0 and 6"),
    body('options').notEmpty().withMessage("Options cannot be empty"),
    body('answer').notEmpty().withMessage("Answer cannot be empty"),
    body('options').custom((value, {req}) => {
        if (!value.includes(req.body.answer))
        {
            throw new Error("The correct answer must be present in the answer options")
        } else {
            return value
        }
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
];