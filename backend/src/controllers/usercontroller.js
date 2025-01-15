import User from "../models/usermodel.js";
import sendToken from "../utils/jwtToken.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password, gpa,admin } = req.body;
        
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create({
            username,
            email,
            password,
            gpa,
            admin,
        })

        sendToken(user,200,res)

    } catch (error) {
        console.log(error);
    }
};

const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) {
            return res.status(400).json({message: "Email not found" });
        }

        if(user.password === password) {
            sendToken(user,200,res)
        }
    } catch (error) {
        console.log('Error:',error)
    }
}

const logout = async(req,res) => {
    try {
        res.cookie('token',null,{
            expires: new Date(Date.now()),
            httpOnly:true,
        });

        return res.status(200).json({message:"logged out successfully"});
    } catch (error) {
        console.log('Error in logging out',error);
    }
}


export {registerUser,loginUser,logout}