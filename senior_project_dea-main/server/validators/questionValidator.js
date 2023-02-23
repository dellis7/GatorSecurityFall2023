const { body, check, validationResult } = require('express-validator')

exports.validateQuestion = [
    body('question').notEmpty().withMessage("Question cannot be empty"),
    body('type').notEmpty().withMessage("Type cannot be empty"),
    body('topic').notEmpty().withMessage("Topic cannot be empty"),
    body('answer').notEmpty().withMessage("Answer cannot be empty"),
    body('displayType').notEmpty().withMessage("Display type cannot be empty"),
    body('options').custom((value, {req}) => {
        if ((value.length-1) !== 0 && !value.includes(req.body.answer))
        {
            throw new Error("The correct answer must be present in the answer options")
        } else {
            return value
        }
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
];

exports.validateCYOAQuestion = [
    body('parentQuestionId').notEmpty().withMessage("A parent question is required"),
    body('questionNumber').notEmpty().withMessage("A question number is required"),
    body('question').notEmpty().withMessage("A question is required"),
    body('type').notEmpty().withMessage("A type is required"),
    body('options').notEmpty().withMessage("Options are required"),
    body('answer').notEmpty().withMessage("An answer is required"),
    check('files').custom((value, {req}) => {
        if(value.length !== 1) {
            throw new Error("Exactly one image file must be uploaded.")
        }
        else {
            const dotIndex = value[0].indexOf(".")
            
            if(dotIndex === -1) {
                throw new Error("The image file must have an extension.")
            }

            const subs = value[0].substring(dotIndex + 1)
            if(subs !== "png" && subs !== "jpg" && subs !== "jpeg" && subs !== "apng" && subs !== "avif" && subs !== "gif" && subs !== "svg" && subs !== "webp") {
                throw new Error("The uploaded file must be an image file.")
            }

            return value
        }
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
];

exports.validateDNDQuestion = [
    body('parentQuestionId').notEmpty().withMessage("A parent question is required"),
    body('question').notEmpty().withMessage("A question is required"),
    body('anchoredMatrix').custom((value, {req}) => {
        if(value === null || value.length === 0) return value
        if(value.length !== req.body.answerMatrix.length) throw new Error("The anchored matrix must have the same number of rows as the answer matrix") 
        for(let x = 0; x < value.length; x++) {
            if(value[x].length !== req.body.answerMatrix[x].length) throw new Error("The anchored matrix must have the same number of columns as the answer matrix")
            for(let y = 0; y < value[x].length; y++) {
                if(typeof value[x][y] !== "string") {
                    throw new Error("All entries in the anchored matrix must be strings") 
                }
                if((req.body.answerMatrix[x][y]["text"] === undefined || req.body.answerMatrix[x][y]["text"] !== value[x][y]) && value[x][y] !== "") {
                    throw new Error("All non-null entries in the anchored matrix must match the answer matrix")
                }
            }
        }
        return value
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
    body('answerMatrix').custom((value, {req}) => {
        for(let x = 0; x < value.length; x++) {
            for(let y = 0; y < value[x].length; y++) {
                if((value[x][y]["text"] === null || value[x][y]["text"] === undefined) && (value[x][y]["image"] === null || value[x][y]["image"] === undefined)) {
                    throw new Error("All entries in the answer matrix must be marked as text or image")
                }
            }
        }
        return value
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    }
];