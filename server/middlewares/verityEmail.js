import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const verifyEmail = (req, res, next) => {
    try {
        const token = req.cookies.token;

        const user = verify(token, process.env.JWT_SECRET);
        if (user["verified"] == "NO") {
            res.status(403).json("Unverified account");
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(403).json("Access Token verification failed");
        return;
    }
};
