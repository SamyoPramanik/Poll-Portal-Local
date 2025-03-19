import { json } from "express";
import { pool } from "../db";

export const getPoll = async (req, res) => {
    try {
        const poll_id = req.params.id;
        let sql = `SELECT * FROM POLLS WHERE ID = $1 LIMIT 1`;
        let result = await pool.query(sql, [poll_id]);
        if (result.rows.length == 1) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const getGroups = async (req, res) => {
    try {
        const poll_id = req.params.id;
        let sql = `SELECT * FROM GROUPS WHERE POLL_ID = $1`;
        let result = await pool.query(sql, [poll_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const getOptions = async (req, res) => {
    try {
        const poll_id = req.params.id;
        let sql = `SELECT * FROM GROUPS WHERE POLL_ID = $1`;
        let result = await pool.query(sql, [poll_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const addModerator = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const std_id = req.params.std_id;
        let sql = `INSERT INTO MODERATIONS(POLL_ID, STD_ID) VALUES($1, $2) RETURNING *`;
        let result = await pool.query(sql, [poll_id, std_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const removeModerator = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const std_id = req.params.std_id;
        let sql = `DELETE FROM MODERATIONS WHERE POLL_ID = $1 AND STD_ID = $2 RETURNING *`;
        let result = await pool.query(sql, [poll_id, std_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const addOption = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const { text } = req.body;
        let sql = `INSERT INTO OPTIONS(POLL_ID, TEXT) VALUES($1, $2) RETURNING *`;
        let result = await pool.query(sql, [poll_id, text]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const removeOption = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const option_id = req.params.option_id;
        let sql = `DELETE FROM OPTIONS WHERE ID = $1 RETURNING *`;
        let result = await pool.query(sql, [option_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const addGroup = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const { min_stdid, max_stid, point } = req.body;
        let sql = `INSERT INTO GROUPS(POLL_ID, MIN_STDID, MAX_STDID, POINT) VALUES($1, $2, $3, $4) RETURNING *`;
        let result = await pool.query(sql, [
            poll_id,
            min_stdid,
            max_stid,
            point,
        ]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const removeGroup = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const group_id = req.params.group_id;
        let sql = `DELETE FROM GROUPS WHERE ID = $1 RETURNING *`;
        let result = await pool.query(sql, [group_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const getResult = async (req, res) => {
    try {
        const poll_id = req.params.id;
        let sql = `SELECT * FROM OPTIONS WHERE POLL_ID = $1`;
        let result = await pool.query(sql, [poll_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const giveVote = async (req, res) => {
    // need update for multiple selections
    try {
        const poll_id = req.params.id;
        const std_id = req.user.id;
        const { option_id } = req.body;
        if (await canVote(std_id, poll_id, option_id)) {
            await pool.query("BEGIN");
            let sql = `UPDATE OPTIONS SET SCORE = SCORE + (SELECT POINT FROM GROUPS WHERE MIN_STDID <= $1 AND MAX_STDID >= $2 AND POLL_ID = $3) WHERE POLL_ID = $4 AND ID = $5 RETURNING *`;

            let result = await pool.query(sql, [
                std_id,
                std_id,
                poll_id,
                poll_id,
                option_id,
            ]);

            if (result.rows.length > 0) {
                sql = `INSERT INTO VOTED(STD_ID, POLL_ID) VALUES($1, $2)`;
                let result1 = await pool.query(sql, [std_id, poll_id]);
                if (result1.rows.length > 0) {
                    await pool.query("COMMIT");
                    res.status(200).json(result.rows[0]);
                }
            } else {
                res.status(400).json("Voting Failed. Please try again later");
            }
        } else {
            res.status(401), json("You can't vote");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const update = async (req, res) => {
    try {
        const poll_id = req.params.id;
        const {
            title,
            started_at,
            finished_at,
            visibility,
            result_visibility,
            min_select,
            max_select,
        } = req.body;
        let sql = `UPDATE POLL SET TITLE = $1, STARTED_AT  = $2, FINISHED_AT = $3, VISIBILITY = $4, RESULT_VISIBILITY = $5, MIN_SELECT = $6, MAX_SELECT = $7 WHERE ID = $8 RETURNING *`;
        let result = await pool.query(sql, [
            title,
            started_at,
            finished_at,
            visibility,
            result_visibility,
            min_select,
            max_select,
            poll_id,
        ]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const getModerators = async (req, res) => {
    try {
        const poll_id = req.params.id;
        let sql = `SELECT * FROM MODERATIONS WHERE POLL_ID = $1 AND ROLE = 'MODERATOR'`;
        let result = await pool.query(sql, [poll_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

export const getSubpolls = async (req, res) => {};

export const removeSubpoll = async (req, res) => {};

export const addSubpoll = async (req, res) => {};

export const getVoters = async (req, res) => {
    try {
        const poll_id = req.params.id;
        let sql = `SELECT U.ID, NAME, U.STD_ID, VOTED_AT FROM USERS U JOIN VOTED V ON U.ID = V.STD_ID AND V.POLL_ID = $1
`;
        let result = await pool.query(sql, [poll_id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json("Poll not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
};

const canVote = async (std_id, poll_id, option_id) => {
    try {
        const vote_possible = true;
        let sql = `SELECT * FROM GROUPS WHERE MIN_STDID <= $1 AND MAX_STDID >= $2 AND NOT EXISTS(SELECT 1 FROM VOTED WHERE STDID = $3 AND POLL_ID = $4) AND POLL_ID = $5`;

        let result = await pool.query(sql, [
            std_id,
            std_id,
            std_id,
            poll_id,
            poll_id,
        ]);

        if (result.rows.length <= 0) {
            vote_possible = false;
            return false;
        }

        sql = `SELECT * FROM OPTIONS WHERE ID = $1 AND POLL_ID = $2`;

        result = await pool.query(sql, [option_id, poll_id]);

        if (result.rows.length <= 0) {
            vote_possible = false;
            return false;
        }

        return vote_possible;
    } catch (err) {
        console.log(err);
        return false;
    }
};
