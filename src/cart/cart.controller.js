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

        // Validar si se envió productId y quantity
        if (!productId || !quantity) {
            return res.status(400).send({ success: false, message: "Product ID and quantity are required" })
        }

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ success: false, message: "Product not found" })
        }

        // Verificar el stock
        if (quantity > product.stock) {
            return res.status(400).send({
                success: false,
                message: `Only ${product.stock} units available`,
            });
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: req.user._id })

        // Si no hay carrito, crear uno con un array vacío de items
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] })
        }

        // Asegurar que cart.items siempre es un array
        if (!Array.isArray(cart.items)) {
            cart.items = [];
        }

        // Buscar el producto en el carrito
        const itemIndex = cart.items.findIndex(item => item.product?.toString() === productId)

        if (itemIndex > -1) {
            // Verificar que la cantidad total no supere el stock
            const totalQuantity = cart.items[itemIndex].quantity + quantity;
            if (totalQuantity > product.stock) {
                return res.status(400).send({
                    success: false,
                    message: `You can only add ${product.stock - cart.items[itemIndex].quantity} more units`,
                })
            }
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Agregar el producto al carrito
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
        return res.send({ success: true, message: "Product added to cart", cart })

    } catch (error) {
        console.error("Error in addToCart:", error)
        return res.status(500).send({ success: false, message: "General error", error: error.message });
    }
}