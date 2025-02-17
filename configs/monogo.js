// Conexion 
import mongoose from "mongoose"
import Category from "../src/category/category.model.js"
import User from "../src/user/user.model.js"
import { encrypt } from "../utils/encryp.js"


//Funcion de conexion
export const connect = async()=>{
    try{
        //Ciclo de vida
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connect to mongodb')
        })
        mongoose.connection.on('connection', ()=>{
            console.log('MongoDB | try connecting')
        })
        mongoose.connection.on('connected', ()=>{
            console.log("MongoDB | connected on mongodb")
        })
        mongoose.connection.once('open', ()=>{
            console.log('MongoDB | connected to database')
        })
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('Mongo | disconnected')
        })

        //Conectarse a la DB
        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50, //Maximo de conexiónes
                serverSelectionTimeoutMS: 5000 //Tiempo máximo que espera la conexión
            }
        ).then(async () =>{
            await initializeData()
        })

   
    .catch((err) => console.error("Error de conexión a la base de datos:", err))
    }catch(err){
        console.error('Datbase connection failed',err)
    }
}

const initializeData = async () =>{
    try {
        // Crear la categoría "default" si no existe
        const defaultCategory = await Category.findOne({ name: "default" })
        if (!defaultCategory) {
            await Category.create({ name: "default", description: "Categoría por defecto", isDefault: true })
            console.log("Categoría 'default' creada.")
        } else {
            console.log("Categoría 'default' ya existe.")
        }

        // Crear un usuario administrador si no existe
        const adminUser = await User.findOne({ username: "admintotal" })
        if (adminUser) {
            console.log(`Usuario administrador '${adminUser.username}' ya existe.`)
        } else {
            const hashedPassword = await encrypt("Admin123")
            await User.create({
                name: "Administrador",
                surname: "admin",
                username: "admintotal",
                email: "admin@example.com",
                password: hashedPassword,
                phone: 36060508,
                role: "ADMIN",
                isProtected: true, //Indica que el usuario no debe eliminarse
            })
            console.log("Usuario administrador creado.")
        }
    } catch (error) {
        console.error("Error inicializando datos:", error)
    }
}
