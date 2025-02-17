import { body } from "express-validator"
import { validateError, validateErrorsWithoutFiles} from "./validate.error.js"
import { existUsername, notRequiredField, existCategory } from "../utils/db.validators.js"
import { existEmail } from "../utils/db.validators.js"
import express from "express"

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname connot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('username')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannor be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('Password must be strong')
        .isLength({min:8})
        .withMessage('Password need min characters'),
    body('phone', 'Phone cannot be empty')
        .notEmpty()
        .isMobilePhone(),
        validateError
]

export const updateUserVAlidatorAdmin =[
    body('username')
    .optional()
    .notEmpty()
    .toLowerCase()
    .custom((username, {req})=>existUsername(username, req.user)),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom((email, {req})=>existEmail(email, req.user)),
    validateErrorsWithoutFiles
]

export const updateUserVAlidatorClient = [
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom((username, {req})=>existUsername(username, req.user)),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .custom((email, {req})=>existEmail(email, req.user)),
    body('password')
        .optional()
        .custom(notRequiredField)
        .isLength({min:8})
        .withMessage('New Password need min 8 characters'),
    body('profilePicture')
        .optional()
        .custom(notRequiredField),
    body('role')
        .optional()
        .custom(notRequiredField),
    validateErrorsWithoutFiles

]

export const validateCategory =[
    body('name')
        .notEmpty()
        .custom(existCategory),
    body('description')
        .notEmpty()
        .isLength({min:10 , max: 200})
        .withMessage('Description need min 10 characters'),
        validateError
]