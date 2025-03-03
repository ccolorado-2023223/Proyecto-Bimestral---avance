import User from './user.model.js'
import { checkPassword, encrypt } from "../../utils/encryp.js"
import { generateJwt } from "../../utils/jwt.js"

// -------------------------------------- ADMIN -----------------------------------\\
//register
export const register = async(req, res)=>{
    try{
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)

        
        await user.save()
        return res.send({message: 'Register successfully, can be login with username'})
    }catch(err){
        console.error(err)
        return res.status(500).send({messege: 'General error with user register'})
    }
}

//Obtener todo
export const getAll = async(req,res)=>{
    try{
        //Configuraciones de pagina
        const {limit = 20, skip = 0} = req.query

        //Consultar
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if(users.length===0){
            return res.send(
                {
                    sucess: false,
                    message: 'Users empty:'
                }
            )
        }
            return res.send(
                {
                    sucess: true,
                    message: 'Users found',
                    users
                }
            )
    }catch(e){
        console.error(e)
        return res.status(500).send({message: 'General error',e})
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        let data = req.body;

        if (data.password) {
            return res.status(400).send({ message: "You cannot update password" })
        }

        if (data.username || data.email) {
            const existingUser = await User.findOne({
                $or: [{ email: data.email }, { username: data.username }],
                _id: { $ne: id },
            });
            if (existingUser) {
                return res.status(400).send({ message: "Username or email already exists" })
            }
        }

        const currentUser = await User.findById(req.user.id)
        const userToUpdate = await User.findById(id)

        if (!userToUpdate) {
            return res.status(404).send({ message: "User not found" })
        }

        if (userToUpdate.role === "ADMIN" && data.role === "CLIENT") {
            if (req.user.username !== "admintotal") {
                return res.status(403).send({ message: "Only AdminTotal can downgrade an admin to client" })
            }
        }

        if (userToUpdate.username === "admintotal") {
            return res.status(403).send({ message: "You cannot update the admintotal user" })
        }

        let updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
        return res.send({ message: "User updated successfully", updatedUser })

    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).send({ message: "General error updating user", error: err.message })
    }
}



export const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body

        // Verificar si la contraseña fue proporcionada
        if (!password) {
            return res.status(400).send({ message: "Admin password is required" })
        }

        const adminUser = await User.findById(req.user.id);
        if (!adminUser) return res.status(404).send({ message: "Admin not found" })

        const isPasswordCorrect = await checkPassword(password, adminUser.password)
        if (!isPasswordCorrect) {
            return res.status(400).send({ message: "Incorrect admin password" })
        }

        const userToDelete = await User.findById(id);
        if (!userToDelete) return res.status(404).send({ message: "User not found" })
      
        if (userToDelete.username === "admintotal") {
            return res.status(403).send({ message: "You cannot delete the totalAdmin user" })
        }

        await User.findByIdAndDelete(id);
        res.send({ message: "User deleted successfully" })

    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send({ message: "Error deleting user", error: err.message })
    }
}




// ----------------------------------------- Neutros ---------------------------------\\

//login
export const login = async(req,res)=>{
    try{
        let {userLoggin, password} =req.body
        let user = await User.findOne({
            $or: [{email: userLoggin},
                {username: userLoggin}]
        })
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {message: `Welcome ${user.name}`, loggedUser,token}
            )
        }
        return res.status(400).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with login function',err})
    }
}


//Obtener id
export const get = async( req, res)=>{
    try{
        let {id} = req.params
        let user = await User.findById(id)
        if(!user) return res.status(404).send({sucess: false, message: 'User not found', user})
        return res.send({sucess: true, message: 'User found', user})

    }catch(err){
        console.error(err)
        return res.status(500).send(
            {sucess: false, message:'General Error', err}
        )
    }  
}




//Update password
export const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).send({ message: "Current password and new password are required" })
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).send({ message: "User not found" })

        const isPasswordCorrect = await checkPassword(user.password, currentPassword)
        if (!isPasswordCorrect) {
            return res.status(400).send({ message: "Current password is incorrect" })
        }

        user.password = await encrypt(newPassword);
        await user.save();

        return res.send({ message: "Password updated successfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "General error updating password", err })
    }
}


// --------------------------------------- Clientes --------------------------------------------\\

//Registrar cliente
export const registerClient = async(req, res)=>{
    try{
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = 'CLIENT'
        //user.profilePicture = req.file.filename ?? null//NUll si es 
        
        await user.save()
        return res.send({message: 'Register successfully, can be login with username'})
    }catch(err){
        console.error(err)
        return res.status(500).send({messege: 'General error with user register'})
    }
}


//Update como cliente
export const updateUserClient = async(req,res)=>{
    try{
        const {id} = req.params;
        let data = req.body

        if(data.password || data.role){
            return res.status(400).send({message: "You cannot update password or role"})
        }

        if(data.username || data.email){
            const existingUser = await User.findOne({
                $or: [{email: data.email}, { username: data.username}],
                _id: {$ne: id},
            })
            if(existingUser){
                return res.status(400).send({message: "Username or email already exists"})
            }
        }

        let updatedUser = await User.findByIdAndUpdate(id,data, {new: true})
        if(!updatedUser) return res.status(404).send({message: "User not found"})

        return res.send({message: "User update successfully", updateUser})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "General error updating user", err})
    }
}

//Eliminar User client
export const deleteUserClient = async(req,res)=>{
    try{
        const {id} = req.params
        //const id = req.body._is

        const {password} = req.body

        if (!password){
            return res.status(400).send({ message: "Password is required" })
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).send({ message: "User not found" })

        const isPasswordCorrect = await checkPassword(user.password, password)
        if (!isPasswordCorrect) {
            return res.status(400).send({ message: "Password is incorrect" })
        }

        const deleteUser = await User.findByIdAndDelete(id)

        if(!deleteUser) return res.status(404).send({message: "User not found"})
            res.send({message: "User profile delete successfullly"})
    }catch(err){
        console.error(err)
        res.status(500).send({message: "Error deleting user profile,", err})
    }
}