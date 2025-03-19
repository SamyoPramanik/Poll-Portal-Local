import { pool } from "../db.js";

export const getPolls = async (req, res) => {};

export const getPoll = async (req, res) => {};

export const createPoll = async (req, res) => {
    try {
        console.log("hello");
        const {
            title,
            started_at,
            finished_at,
            visibility,
            result_visibility,
            min_select,
            max_select,
        } = req.body;

        const creator_id = req.user.id;

        let result = await pool.query(`BEGIN`);

        let sql = `INSERT INTO POLL(TITLE, STARTED_AT, FINISHED_AT, VISIBILITY, RESULT_VISIBILITY, MIN_SELECT, MAX_SELECT) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        result = await pool.query(sql, [
            title,
            started_at,
            finished_at,
            visibility,
            result_visibility,
            min_select,
            max_select,
        ]);
        const poll = result.rows[0];
        console.log(poll);
        sql = `INSERT INTO MODERATIONS(POLL_ID, STD_ID, ROLE) VALUES($1, $2, $3)`;
        result = await pool.query(sql, [poll.id, creator_id, "CREATOR"]);
        result = await pool.query("COMMIT");
        res.status(200).json("poll created");
    } catch (err) {
        console.log(err);
        await pool.query("ROLLBACK");
        res.status(500).json("server error, please try again later");
    }
};

export const searchUser = async (req, res) => {};
