import { pool } from "../db.js";

export const signIn = async (req, res) => {};

export const signUp = async (req, res) => {
    try {
        const { name, student_id, email, password } = req.body;

        let sql = `SELECT * FROM USERS WHERE STD_ID = $1`;
        const result = await pool.query(sql, [student_id]);
        console.log(result.rows);
        res.json("hello");
    } catch (err) {
        console.log(err);
    }
};

export const signOut = async (req, res) => {};

export const profileInfo = async (req, res) => {};

export const updatePassword = async (req, res) => {};
