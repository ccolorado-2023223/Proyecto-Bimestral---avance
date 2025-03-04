import { Router } from "express"
import { addToCart, getCart, updateCart } from "./cart.controller.js"
import { validateJwt, isClient } from "../../middlewares/validate.jwt.js"
import { cartValidator, cartValidatorUpdate} from "../../middlewares/validators.js"
const api = Router()

api.post('/', [validateJwt, cartValidator], addToCart)
api.get('/',validateJwt, getCart)
api.put('/', [validateJwt, cartValidatorUpdate], updateCart)

export default api