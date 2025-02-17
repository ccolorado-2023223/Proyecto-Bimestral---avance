import { Router } from "express";
import { createProduct, getAllProducts } from "./product.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";

const api = Router()

api.post('/', [validateJwt, isAdmin],createProduct)

api.get('/', validateJwt, getAllProducts)

export default api