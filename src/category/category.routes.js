import { Router } from "express";
import {createCategory, getAllCategories,updateCategory, deleteCategory, getCategoryId} from "../category/category.controller.js"
import { validateCategory } from "../../middlewares/validators.js"
import {isAdmin, validateJwt} from "../../middlewares/validate.jwt.js"

const api = Router()
api.get('/:id', validateJwt,getCategoryId)
api.get('/',validateJwt,getAllCategories)
api.post('/', validateCategory, [validateJwt, isAdmin], createCategory)
api.put('/:id', validateCategory,[validateJwt, isAdmin], updateCategory)
api.delete('/:id', [validateJwt, isAdmin], deleteCategory)

export default api