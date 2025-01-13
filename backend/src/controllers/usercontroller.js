import User from "../models/usermodel.js";
import sendToken from "../utils/jwtToken.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create({
            username,
            email,
            password
        })

        sendToken(user,200,res)

    } catch (error) {
        console.log(error);
    }
};


export {registerUser}