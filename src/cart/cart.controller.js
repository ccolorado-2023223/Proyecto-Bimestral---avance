import Cart from './cart.model.js'

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

// Agregar un producto al carrito
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body
        let cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] })
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
        return res.send({ success: true, message: 'Product added to cart', cart })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}
