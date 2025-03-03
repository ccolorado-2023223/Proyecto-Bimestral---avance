import { Router } from "express"
import { addToCart, getCart } from "./cart.controller.js"
import { validateJwt, isClient } from "../../middlewares/validate.jwt.js"
const api = Router()

api.post('/', validateJwt, addToCart)
api.get('/',validateJwt, getCart)

export default api