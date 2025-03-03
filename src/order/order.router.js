import { Router } from "express"
import { checkout, getPurchaseHistory } from "./order.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post('/', validateJwt, checkout)
api.get('/', validateJwt, getPurchaseHistory)

export default api