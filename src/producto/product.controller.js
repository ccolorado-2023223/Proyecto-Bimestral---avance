import Product from './product.model.js'

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        let { limit = 20, skip = 0 } = req.query;

        // Convertir a número y validar que sean positivos
        limit = Math.max(parseInt(limit, 10), 1);
        skip = Math.max(parseInt(skip, 10), 0);

        // Obtener productos y poblar la categoría
        const products = await Product.find()
            .populate("category", "name description").skip(skip).limit(limit)

        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No products found" });
        }

        return res.send({ success: true, message: "Products retrieved", products });

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).send({ message: "General error", error });
    }
};


// Obtener un producto por ID
export const getProductById = async (req, res) =>{
    try{
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) return res.status(404).send({ success: false, message: 'Product not found' })
        return res.send({ success: true, message: 'Product found', product })
    }catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

// Crear un nuevo producto
export const createProduct = async (req, res) =>{
    try{
        const newProduct = new Product(req.body)
        await newProduct.save()
        return res.status(201).send({ success: true, message: 'Product created', newProduct })
    }catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

// Actualizar un producto
export const updateProduct = async (req, res) =>{
    try{
        const { id } = req.params
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedProduct) return res.status(404).send({ success: false, message: 'Product not found' })
        return res.send({ success: true, message: 'Product updated', updatedProduct })
    }catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

// Eliminar un producto
export const deleteProduct = async (req, res) =>{
    try{
        const { id } = req.params
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) return res.status(404).send({ message: 'Product not found' })
        return res.send({ message: 'Product deleted' })
    }catch (error){
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}
