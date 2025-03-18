import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        const user = verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(403).json("Access Token verification failed");
        return;
    }
};
