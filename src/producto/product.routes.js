import { Router } from "express";
import { createProduct, getAllProducts, getOutOfStockProducts,getBestSellingProducts, updateProduct, deleteProduct,searchProductsByName, searchProductsByCategory} from "./product.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js";
import { productValidator, updateProductValidator } from "../../middlewares/validators.js";
const api = Router()

api.post('/', [validateJwt, isAdmin, productValidator],createProduct)
api.get('/bestProducts',validateJwt, getBestSellingProducts)
api.get('/', validateJwt, getAllProducts)
api.delete('/:id',validateJwt, isAdmin, deleteProduct)
api.get('/byName',validateJwt,searchProductsByName)
api.get('/byCategory',validateJwt, searchProductsByCategory)
api.get('/out-of-stock',[validateJwt],getOutOfStockProducts)
api.put('/:id', [validateJwt, isAdmin, updateProductValidator], updateProduct)

export default api