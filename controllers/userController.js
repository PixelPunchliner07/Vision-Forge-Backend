    import userModel from "../models/userModel.js";
    import bcrypt from "bcryptjs";
    import jwt from "jsonwebtoken";
    

    const registeredUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered. Please log in." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        if (error.code === 11000) {
            // This is a rare fallback for race conditions or index oddities
            return res.json({ success: false, message: "Email already registered. Please log in." });
        }
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}



    const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (isMatched) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}



    const userCredits = async (req,res)=>{
        try {
            const userId = req.userId;
            console.log("userId received:", userId, typeof userId);
            const user = await userModel.findById(userId);
            res.json({sucess:true,credits: user.creditBalance,user:{name:user.name}});
        } catch (error) {
            console.log(error.message);
            res.json({sucess:false,message:error.message});
        }
    }

    export { registeredUser, loginUser , userCredits };