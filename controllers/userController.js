const User = require('../models/user')
class  UserController {
     static async register (req, res) {
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

    static login(req,res){
        const{email, password}=req.body;
    }


}

module.exports = UserController