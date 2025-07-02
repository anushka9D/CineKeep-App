const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if(authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"No token, authorization denied"});
        }

        try{
            // Verify the token using the secret key
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;  // Attach the decoded user info to the request object
            console.log("The decoded user is:", req.user);

             next();
        } catch(error){
            return res.status(401).json({ error: "Invalid token" });
        }
    }else{
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }
};

module.exports = verifyToken;