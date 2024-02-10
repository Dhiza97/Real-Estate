const User = require('../models/user')
const registerValidator = require('../validator/userValidator')
class  UserController {
     static async register (req, res) {
        const {error} = registerValidator.validate(req.body);
        if(error) return res.status(400).send({err: error.message})
        try {
            const {name, email} = req.body;
    
            const user = await User.create({
                    name,
                    email
            });
            res.status(200).json(user);
    
        } catch (error) {
            console.log(error);
        }
    }


    //For Login
    static login(req,res){
        const{email, password}=req.body;
    }


}

module.exports = UserController