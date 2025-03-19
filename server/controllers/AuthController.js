import { pool } from "../db.js";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const signIn = async (req, res) => {
    try {
        console.log("signing in");
        const { student_id, password } = req.body;
        console.log(req.body);

        let sql = `SELECT ID, NAME, STD_ID, EMAIL, VERIFIED FROM USERS WHERE STD_ID = $1 AND PASSWORD = $2 LIMIT 1`;
        let result = await pool.query(sql, [student_id, password]);

        if (result.rows.length == 1) {
            const user = result.rows[0];
            const token = sign(user, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            console.log(token);
            res.status(200).cookie("token", token).json("SignIn successful");
        } else {
            res.status(404).json("Invalid credentials");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("server error, please try again later");
    }
};

export const signUp = async (req, res) => {
    try {
        const { student_name, student_id, student_email, password } = req.body;

        console.log(req.body);

        if (isNaN(student_id)) {
            res.status(400).json("Invalid Student Id");
            return;
        }

        if (!student_email || student_email.length < 12) {
            res.status(400).json(
                "Invalid email. Try with your institutional email"
            );
            return;
        }

        const id_from_email = student_email.substring(0, 7);
        if (student_id != id_from_email) {
            res.status(400).json(
                "Invalid email. Try with your institutional email"
            );
            return;
        }
        if (password.length < 8) {
            res.status(400).json(
                "password too short, Use atleast 8 characters"
            );
            return;
        }

        let sql = `SELECT * FROM USERS WHERE STD_ID = $1`;
        let result = await pool.query(sql, [student_id]);

        console.log("checking duplication");

        if (result.rows.length == 0) {
            sql = `INSERT INTO USERS(NAME, STD_ID, EMAIL, PASSWORD) VALUES($1, $2, $3, $4) RETURNING ID, NAME, STD_ID, EMAIL, VERIFIED`;

            console.log("new user, entering in db");

            result = await pool.query(sql, [
                student_name,
                student_id,
                student_email,
                password,
            ]);

            console.log("user added in db");

            if (result.rows.length > 0)
                res.status(200).json("user signed up successfully");
        } else {
            res.status(403).json("User with this student id already exists");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("server error, please try again later");
    }
};

export const signOut = async (req, res) => {
    try {
        res.cookie("token", "");
        res.status(200).json("SignOut successful");
    } catch (err) {
        console.log(err);
        res.status(500).json("server error, please try again later");
    }
};

export const profileInfo = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log(err);
        res.status(500).json("server error, please try again later");
    }
};

export const updatePassword = async (req, res) => {};
