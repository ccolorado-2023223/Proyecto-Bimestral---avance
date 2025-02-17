import Invoice from './invoice.model.js'

// Obtener todas las facturas
export const getAllInvoices = async (req, res) =>{
    try{
        const invoices = await Invoice.find().populate('user').populate('items.product')
        return res.send({ success: true, message: 'Invoices retrieved', invoices })
    }catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

// Obtener una factura por ID
export const getInvoiceById = async (req, res) =>{
    try{
        const { id } = req.params
        const invoice = await Invoice.findById(id).populate('user').populate('items.product')
        if (!invoice) return res.status(404).send({ success: false, message: 'Invoice not found' })
        return res.send({ success: true, message: 'Invoice found', invoice })
    }catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

// Crear una factura
export const createInvoice = async (req, res) =>{
    try{
        const newInvoice = new Invoice(req.body)
        await newInvoice.save()
        return res.status(201).send({ success: true, message: 'Invoice created', newInvoice })
    }catch (error){
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}
