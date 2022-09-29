const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register", async (request, response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword,
        })

        const userDetails = await newUser.save();
        response.status(200).json(userDetails);

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
})


// LOGIN
router.post("/login", async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username });
        !user && response.status(400).json("Wrong username");

        const validated = await bcrypt.compare(request.body.password, user.password)
        !validated && response.status(400).json("Wrong password");
        const { password, ...other } = user._doc;
        response.status(200).json(other)
    } catch (error) {
        response.status(500).json(error);
    }
})


module.exports = router