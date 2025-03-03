import Product from './product.model.js'
import Category from '../category/category.model.js'
// Obtener todos los productos
export const getAllProducts = async (req, res)=>{
    try {
        let { limit = 20, skip = 0 } = req.query;
        limit = Math.max(parseInt(limit, 10), 1);
        skip = Math.max(parseInt(skip, 10), 0);

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
}

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

export const getBestSellingProducts = async (req, res) => {
    try {
        let { limit = 20, skip = 0 } = req.query
        limit = Math.max(parseInt(limit, 10), 1)
        skip = Math.max(parseInt(skip, 10), 0)

        const products = await Product.find()
            .populate("category", "name description")
            .sort({ soldCount: -1 })
            .skip(skip)
            .limit(limit);

        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No products found" })
        }

        return res.send({ success: true, message: "Best-selling products retrieved", products })

    } catch (error) {
        console.error("Error fetching best-selling products:", error)
        return res.status(500).send({ message: "General error", error })
    }
}

export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).send({ success: false, message: "Product name is required" })
        }

        const products = await Product.find({ name: { $regex: name, $options: "i" } }).populate("category", "name description")
        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No products found" })
        }
        return res.send({ success: true, message: "Products found", products })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: "General error", error })
    }
}

export const searchProductsByCategory = async (req, res) => {
    try {
        const {category} = req.body
        if(!category){
            return res.status(400).send({ success: false, message: "Category is required"})
        }
        let categoryFilter = {};
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
            categoryFilter = { _id: category }
        }else{
            categoryFilter = { name: { $regex: category, $options: "i" } }
        }

        const categoryData = await Category.findOne(categoryFilter)
        if (!categoryData) {
            return res.status(404).send({ success: false, message: "Category not found"})
        }
        const products = await Product.find({ category: categoryData._id }).populate("category", "name description")
        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No products found in this category"})
        }
        return res.send({ success: true, message: "Products retrieved by category", products})
    }catch (error){
        console.error(error)
        return res.status(500).send({ success: false, message: "General error", error})
    }
}

export const getOutOfStockProducts = async (req, res) => {
    try {
        const outOfStockProducts = await Product.find({ stock: 0 });

        if (outOfStockProducts.length === 0) {
            return res.status(200).send({ success: true, message: "No out-of-stock products found", products: [] });
        }

        return res.status(200).send({ success: true, products: outOfStockProducts });

    } catch (error) {
        console.error("Error fetching out-of-stock products:", error);
        return res.status(500).send({ success: false, message: "General error", error });
    }
};
