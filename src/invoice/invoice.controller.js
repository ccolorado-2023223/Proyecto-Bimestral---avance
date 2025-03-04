import Invoice from './invoice.model.js'
import Product from '../producto/product.model.js'
import mongoose from 'mongoose';

export const editInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params
        console.log("Request body:", req.body)

        // Buscar la factura
        const invoice = await Invoice.findById(invoiceId)
        if (!invoice) {
            return res.status(404).send({ success: false, message: "Invoice not found" })
        }

        const { items, nit, cardNumber } = req.body

        if (!items || !Array.isArray(items)) {
            return res.status(400).send({ success: false, message: "Items array is required" })
        }

        let total = 0;
        let insufficientStock = []

        // Verificar stock y actualizar productos
        for (let item of items) {
            const productId = new mongoose.Types.ObjectId(item.productId)
            const product = await Product.findById(productId)

            if (!product) {
                return res.status(404).send({ success: false, message: `Product ${item.productId} not found` })
            }

            // Buscar el producto en la factura actual para comparar cantidades
            const existingItem = invoice.items.find(i => i.product.toString() === item.productId)
            const previousQuantity = existingItem ? existingItem.quantity : 0;
            const quantityDifference = item.quantity - previousQuantity; // Diferencia en cantidad

            if (quantityDifference > 0 && product.stock < quantityDifference) {
                insufficientStock.push({ product: product.name, available: product.stock })
            }
        }

        if (insufficientStock.length > 0){
            return res.status(400).send({
                success: false,
                message: "Insufficient stock for some products",
                insufficientStock
            })
        }

        // Actualizar stock y construir los nuevos items con precios
        const updatedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.productId)
            if (!product) {
                throw new Error(`Product ${item.productId} not found`)
            }

            // Comparar la cantidad nueva con la anterior y ajustar el stock
            const existingItem = invoice.items.find(i => i.product.toString() === item.productId)
            const previousQuantity = existingItem ? existingItem.quantity : 0
            const quantityDifference = item.quantity - previousQuantity

            if (quantityDifference !== 0){
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -quantityDifference }
                })
            }

            return {
                product: product._id,
                price: product.price,
                quantity: item.quantity
            }
        }))

        // Asignar los items actualizados a la factura
        invoice.items = updatedItems
        invoice.total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        invoice.NIT = nit
        invoice.cardNumber = cardNumber

        await invoice.save()

        return res.status(200).send({ success: true, message: "Invoice updated successfully", invoice })

    }catch (error){
        console.error("Error editing invoice:", error);
        return res.status(500).send({ success: false, message: "General error", error })
    }
}


export const getInvoicesByUser = async(req, res)=>{
    try{
        const userId = req.user._id
        const invoices = await Invoice.find({ user: userId })

        if (invoices.length === 0){
            return res.status(404).send({success: false, message: "No invoices found"})
        }
        return res.status(200).send({success: true, invoices})
    }catch(error){
        console.error("Error fetching invoices by user:", error)
        return res.status(500).send({ success: false, message: "General error",error})
    }
}


export const getInvoicesByUserForAdmin = async(req, res)=>{
    try{
        const {userId} = req.params
        const invoices = await Invoice.find({ user: userId })

        if (invoices.length === 0){
            return res.status(404).send({success: false, message: "No invoices found"})
        }
        return res.status(200).send({success: true, invoices})
    }catch(error){
        console.error("Error fetching invoices by user:", error)
        return res.status(500).send({ success: false, message: "General error",error})
    }
}

export const getInvoiceProducts = async(req, res)=>{
    try{
        const { invoiceId } = req.params
        const invoice = await Invoice.findById(invoiceId)
        if (!invoice) {
            return res.status(404).send({success: false, message: "Invoice not found"})
        }
        return res.status(200).send({success: true, products: invoice.items})

    }catch(error){
        console.error("Error fetching invoice products:", error);
        return res.status(500).send({success: false, message: "General error", error})
    }
}
