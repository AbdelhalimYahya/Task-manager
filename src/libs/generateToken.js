import jwt from "jsonwebtoken";

export const generateToken = (userID , res) => {
    const token = jwt.sign({userID} , process.env.JWT_SECRET , {expiresIn : "15d"});
    res.cookie("token" , token , {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        partitioned: true,
    });

    return token;
};