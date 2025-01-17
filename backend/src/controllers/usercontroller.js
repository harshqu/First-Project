import Company from "../models/companiesmodel.js";
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

        const admins = await User.find({admin:true});
        const updatePromises = admins.map(async(adminUser) => {
            if(!adminUser.approvalList.includes(user._id)) {
                adminUser.approvalList.push(user._id);
                await adminUser.save();
            }
        })

        await Promise.all(updatePromises);

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

const getUserDetails = async(req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log('Error in getting user details',error);
    }
}

const getAllUserDetails = async (req, res) => {
    try {
        const users = await User.find({ admin: { $ne: true } }).select('-password');
        const data = await Promise.all(
            users.map(async (user) => {
                const companies = await Company.find({ _id: { $in: user.companies } }).select('name -_id');
                const companyNames = companies.map((company) => company.name);
                return {
                    username: user.username,
                    id:user._id,
                    companies:companyNames,
                    isApproved: user.approved,
                }
            })
        )
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error in getting all user details', error);
        return res.status(500).json({ error: 'Failed to fetch user details' });
    }
};

const approveProfiles = async(req,res) => {
    try {
        const { userId } = req.body;
        const admin_id = req.user._id;
        const adminUser = await User.findById(admin_id);
        const user = await User.findById(userId);

        user.approved = true;
        await user.save();
        adminUser.approvalList = adminUser.approvalList.filter((id) => id.toString() !== userId);
        await adminUser.save();

        return res.status(200).json({message: "Profile has been approved"});
    } catch (error) {
        console.log("Error in profile approval",error);
    }
}


export {registerUser,loginUser,logout,getUserDetails,getAllUserDetails,approveProfiles};