import { Router } from "express"
import { addToCart, getCart } from "./cart.controller.js"
import { validateJwt, isClient } from "../../middlewares/validate.jwt.js"
import { cartValidator } from "../../middlewares/validators.js"
const api = Router()

api.post('/', [validateJwt, cartValidator], addToCart)
api.get('/',validateJwt, getCart)

export default api