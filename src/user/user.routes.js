import { Router } from "express";
import { login, register, getAll, get, updateUser, deleteUserAdmin,updateUserPassword, updateUserClient, registerClient, deleteUserClient } from "./user.controller.js"
import {validateJwt, isAdmin, isClient} from "../../middlewares/validate.jwt.js"
import { registerValidator,updateUserVAlidatorClient, updateUserVAlidatorAdmin} from "../../middlewares/validators.js"

const api = Router()


// Ruta protegida para ADMINISTRADORES
api.post('/',registerValidator, [validateJwt, isAdmin], register)
api.get('/',[validateJwt, isAdmin], getAll)
api.put('/:id',updateUserVAlidatorAdmin,[validateJwt, isAdmin],updateUser)
api.delete('/:id', [validateJwt, isAdmin], deleteUserAdmin)

// Ruta protegida para CLIENTES
api.get('/client-data', [validateJwt, isClient],getAll)
api.put('/update-cliente/:id',updateUserVAlidatorClient, [validateJwt, isClient], updateUserClient)
api.post('/register-client', registerValidator ,registerClient)
api.delete('/delete-client/:id',[validateJwt, isClient],deleteUserClient)

// Ruta accesible para cualquier usuario
api.post('/login', login)
api.get('/:id',validateJwt, get)
api.put('/updatePassword/:id', validateJwt, updateUserPassword)

export default api