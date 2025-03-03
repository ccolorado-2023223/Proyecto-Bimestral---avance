import Order from "./order.model.js"
import Cart from "../cart/cart.model.js"
import Product from "../producto/product.model.js"
import Invoice from '../invoice/invoice.model.js'
import User from '../user/user.model.js'

export const checkout = async (req, res) => { 
    try {
        const userId = req.user._id;
        const { NIT, cardNumber } = req.body;

        if (!NIT || !cardNumber) {
            return res.status(400).send({ success: false, message: "NIT and card number are required" });
        }

        // Obtener carrito
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).send({ success: false, message: "Cart is empty" });
        }

        let total = 0;
        let insufficientStock = [];

        // Verificar stock y calcular total
        for (let item of cart.items) {
            if (item.product.stock < item.quantity) {
                insufficientStock.push({
                    product: item.product.name,
                    available: item.product.stock
                });
            }
            total += item.product.price * item.quantity;
        }

        if (insufficientStock.length > 0) {
            return res.status(400).send({
                success: false,
                message: "Insufficient stock for some products",
                insufficientStock
            });
        }

        // Reducir stock
        for (let item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, soldCount: item.quantity }
            });
        }

        // Crear orden
        const order = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            })),
            total,
            status: "completed"
        });
        await order.save();

        const user = await User.findById(userId);

        // Crear factura
        const invoice = new Invoice({
            user: userId,
            userName: user.name,
            NIT,
            cardNumber,
            date: new Date(),
            items: cart.items.map(item => ({
                product: item.product._id, // Asegúrate de usar `product` aquí
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            })),
            total
        });
        await invoice.save();

        await Cart.findOneAndUpdate({ user: userId }, { items: [] });

        return res.status(201).send({ 
            success: true, 
            message: "Purchase completed. Invoice generated", 
            order, 
            invoice 
        });
    } catch (error) {
        console.error("Error in checkout:", error);
        return res.status(500).send({ success: false, message: "General error", error });
    }
};



export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user._id

        const orders = await Order.find({ user: userId }).populate("items.product")

        if (!orders.length){
            return res.status(404).send({ success: false, message: "No purchase history found" })
        }

        return res.status(200).send({ success: true, message: "Purchase history retrieved", orders })

    }catch (error){
        console.error("Error in getPurchaseHistory:", error);
        return res.status(500).send({ success: false, message: "General error", error })
    }
}
