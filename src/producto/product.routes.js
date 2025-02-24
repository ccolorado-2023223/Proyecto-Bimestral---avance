import { Router } from "express";
import { createProduct, getAllProducts, getBestSellingProducts, deleteProduct,searchProductsByName, searchProductsByCategory} from "./product.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";

const api = Router()

api.post('/', [validateJwt, isAdmin],createProduct)
api.get('/bestProducts',validateJwt, getBestSellingProducts)
api.get('/', validateJwt, getAllProducts)
api.delete('/:id',validateJwt, isAdmin, deleteProduct)
api.get('/byName',validateJwt,searchProductsByName)
api.get('/byCategory',validateJwt, searchProductsByCategory)

export default api