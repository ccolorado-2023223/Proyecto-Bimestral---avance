import User from '../src/user/user.model.js'
import Category from '../src/category/category.model.js'
import Product from '../src/producto/product.model.js'

export const existUsername = async(username, user)=>{
    const alreadyUsername = await User.findOne({username})
    if(alreadyUsername && alreadyUsername._id !=user._id){
        console.error(`Username ${username} is already taken`)
        throw new Error(`Username ${username} is already taken`)
    }
}

export const existEmail = async(email, user)=>{
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id != user._id){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const notRequiredField =(field)=>{
    if(field){
        throw new Error(`${field} is not required`)
    }
}

export const existCategory = async(name, category)=>{
    const alreadyCategory = await Category.findOne({name})
    if(alreadyCategory && alreadyCategory._id != category._id){
        console.error(`Category ${category} already exists`)
        throw new Error(`Category ${category} already exists`)
    }
}

export const existProduct = async(name, product)=>{
    const alreadyProduct = await Product.findOne({name})
    if(alreadyProduct && alreadyProduct._id !=product._id){
        console.error(`Product ${product} already exists`)
        throw new Error(`Product ${product} already exists`)
    }
}