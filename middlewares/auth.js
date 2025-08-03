import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    // Accept token from header (custom) or standard Authorization header
    let jwtToken = req.headers.token;
    if (!jwtToken && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        jwtToken = req.headers.authorization.split(" ")[1];
    }

    if (!jwtToken) {
        return res.json({sucess: false, message: "Not authorized. Login again!"});
    }

    try {
        const tokenDecode = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
            next();
        } else {
            return res.json({sucess: false, message: "Not authorized. Login again!"});
        }
    } catch (error) {
        console.log(error.message);
        res.json({sucess: false, message: error.message});
    }
};

export default userAuth;