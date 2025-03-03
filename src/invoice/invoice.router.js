import { Router } from "express"
import { editInvoice, getInvoicesByUser, getInvoiceProducts, getInvoicesByUserForAdmin} from "./invoice.controller.js"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js"

const api = Router()

api.put('/:invoiceId', [validateJwt, isAdmin],editInvoice)
api.get('/', [validateJwt],getInvoicesByUser)
api.get('/invoice-for-admin/:userId',[validateJwt, isAdmin], getInvoicesByUserForAdmin )
api.get('/products/:invoiceId',[validateJwt, isAdmin], getInvoiceProducts)

export default api