import Category from './category.model.js'
import Product from '../producto/product.model.js'


// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (categories.length === 0) return res.status(404).send({ success: false, message: 'No categories found' })
        return res.send({ success: true, message: 'Categories retrieved', categories })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

//obtener Categoria por id
export const getCategoryId = async(req, res)=>{
    try{
        const {id} = req.params
        const category = await Category.findById(id)
        if(!category) return res.status(404).send({success: false, message: 'Category not found'})
            return res.send({success: false, message: 'Categoria found', category})
    }catch(err){
        console.error(err)
        res.status(500).send({success: false, message: 'General error', err})
    }
}
 
// Crear una categoría
export const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body)
        await newCategory.save()
        return res.status(201).send({ success: true, message: 'Category created', newCategory })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error', error })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send({ success: false, message: "Category not found" });
        }
        if (category.name === "default") {
            return res.status(403).send({ success: false, message: "The 'default' category cannot be modified" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        return res.send({ success: true, message: "Category updated", updatedCategory });

    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).send({ success: false, message: "General error", error });
    }
};


const getDefaultCategoryId = async () => {
    const defaultCategory = await Category.findOne({ name: "default" })
    return defaultCategory ? defaultCategory._id : null
};


export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const DEFAULT_CATEGORY_ID = await getDefaultCategoryId();
        if (!DEFAULT_CATEGORY_ID) {
            return res.status(500).send({ success: false, message: "Default category not found. Cannot reassign products." })
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send({ success: false, message: "Category not found" })
        }

        if (category._id.equals(DEFAULT_CATEGORY_ID)) {
            return res.status(400).send({ success: false, message: "Cannot delete the default category" })
        }

        await Product.updateMany({ category: id }, { category: DEFAULT_CATEGORY_ID })

        await Category.findByIdAndDelete(id);

        return res.send({ success: true, message: "Category deleted and products reassigned" })

    }catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "General error", error })
    }
}

