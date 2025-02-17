'use strict'

import express from  'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import userRouter from '../src/user/user.routes.js'
import categoryRouter from '../src/category/category.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import productRoutes from '../src/producto/product.routes.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app)=>{
    app.use('/v1/user', userRouter)
    app.use('/v1/category', categoryRouter)
    app.use('/v1/product', productRoutes)
}

//Ejecutar SErver
//Ejecutarmos el servidor
export const initServer = ()=>{
    const app = express() //Instancia de express
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}