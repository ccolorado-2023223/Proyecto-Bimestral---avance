import { body } from "express-validator"
import { validateError, validateErrorsWithoutFiles} from "./validate.error.js"
import { existUsername, notRequiredField, existCategory, existProduct } from "../utils/db.validators.js"
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
        validateErrorsWithoutFiles
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
        validateErrorsWithoutFiles
]

export const cartValidator = [
    body('items.*.product')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    validateErrorsWithoutFiles
]

export const productValidator = [
    body('name')
        .notEmpty()
        .withMessage('Product name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name must be between 3 and 100 characters')
        .custom(existProduct),
    body('description')
        .notEmpty()
        .isLength({ max: 500 })
        .withMessage(`Description can't exceed 500 characters`),
    body('price')
        .notEmpty()
        .withMessage('Price cannot be empty')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('stock')
        .notEmpty()
        .withMessage('Stock cannot be empty')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('imageUrl')
        .optional()
        .isURL().withMessage('Invalid image URL'),
    validateErrorsWithoutFiles
]

export const updateProductValidator = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Product name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name must be between 3 and 100 characters')
        .custom(existProduct),
    body('description')
        .optional()
        .notEmpty()
        .isLength({ max: 500 })
        .withMessage(`Description can't exceed 500 characters`),
    body('price')
        .optional()
        .notEmpty()
        .withMessage('Price cannot be empty')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('stock')
        .optional()
        .notEmpty()
        .withMessage('Stock cannot be empty')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('category')
        .optional()
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('imageUrl')
        .optional()
        .isURL().withMessage('Invalid image URL'),
    validateErrorsWithoutFiles
]