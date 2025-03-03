import Cart from './cart.model.js'
import Product from '../producto/product.model.js'

// Obtener el carrito de un usuario
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
        if (!cart) return res.status(404).send({ success: false, message: 'Cart not found' })
        return res.send({ success: true, message: 'Cart retrieved', cart })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

// Agregar un producto al carrito con verificación de stock
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body

        if (!productId || !quantity) {
            return res.status(400).send({ success: false, message: "Product ID and quantity are required" })
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ success: false, message: "Product not found" })
        }

        if (quantity > product.stock) {
            return res.status(400).send({
                success: false,
                message: `Only ${product.stock} units available`,
            })
        }

        let cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] })
        }

        if (!Array.isArray(cart.items)) {
            cart.items = []
        }
        const itemIndex = cart.items.findIndex(item => item.product?.toString() === productId)

        if (itemIndex > -1) {
            const totalQuantity = cart.items[itemIndex].quantity + quantity;
            if (totalQuantity > product.stock) {
                return res.status(400).send({
                    success: false,
                    message: `You can only add ${product.stock - cart.items[itemIndex].quantity} more units`,
                })
            }
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
        return res.send({ success: true, message: "Product added to cart", cart })

    } catch (error) {
        console.error("Error in addToCart:", error)
        return res.status(500).send({ success: false, message: "General error", error: error.message })
    }
}