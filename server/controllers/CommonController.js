import { pool } from "../db.js";

export const getPolls = async (req, res) => {
    try {
        const std_id = req.user.id;

        let sql = `SELECT ID, TITLE, STARTED_AT, FINISHED_AT, (SELECT COUNT(*) FROM VOTED WHERE POLL_ID = P.ID) FROM POLL P WHERE VISIBILITY = 'PUBLIC' OR EXISTS(SELECT 1 FROM MODERATIONS WHERE STD_ID = $1 AND POLL_ID = P.ID) OR EXISTS(SELECT 1 FROM GROUPS WHERE MIN_STDID <= $2 AND MAX_STDID >= $3 AND POLL_ID = P.ID) ORDER BY STARTED_AT DESC`;

        let result = await pool.query(sql, [std_id, std_id, std_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("no poll found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const getPoll = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const std_id = req.user.id;

        let sql = `SELECT ID, TITLE, STARTED_AT, FINISHED_AT, (SELECT COUNT(*) FROM VOTED WHERE POLL_ID = P.ID) FROM POLL P WHERE ID = $1 AND (VISIBILITY = 'PUBLIC' OR EXISTS(SELECT 1 FROM MODERATIONS WHERE STD_ID = $2 AND POLL_ID = P.ID) OR EXISTS(SELECT 1 FROM GROUPS WHERE MIN_STDID <= $3 AND MAX_STDID >= $4 AND POLL_ID = $5))`;

        let result = await pool.query(sql, [
            poll_id,
            std_id,
            std_id,
            std_id,
            poll_id,
        ]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("no poll found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

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

export const getResult = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const std_id = req.user.id;

        let sql = `SELECT O.ID, TEXT, SCORE FROM OPTIONS O JOIN POLL P ON O.POLL_ID = P.ID WHERE POLL_ID = 1 AND (EXISTS(SELECT 1 FROM MODERATIONS WHERE STD_ID = 2 AND POLL_ID = 3) OR (VISIBILITY = 'PUBLIC' AND RESULT_VISIBILITY = 'PUBLIC') OR (VISIBILITY = 'PRIVATE' AND RESULT_VISIBILITY = 'PUBLIC' AND EXISTS(SELECT 1 FROM GROUPS WHERE MIN_STDID <= 4 AND MAX_STDID >= 5 AND POLL_ID = 6)))`;

        let result = await pool.query(sql, [
            poll_id,
            std_id,
            poll_id,
            std_id,
            std_id,
            std_id,
        ]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("no poll found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const searchUser = async (req, res) => {
    try {
        const { q } = req.query;
        const searchPattern = `%${q}%`;

        let sql = `SELECT ID, NAME, STD_ID, EMAIL FROM USERS WHERE STD_ID LIKE $1 OR NAME LIKE $2 ORDER BY NAME ASC`;

        let result = await pool.query(sql, [searchPattern, searchPattern]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("no user found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};
