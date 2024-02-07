const User = require('../models/user')

exports.post = ("/register", async(req, res) => {
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
})