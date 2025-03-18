import { Router } from "express";
import {
    createPoll,
    getPoll,
    getPolls,
} from "../controllers/CommonController.js";

const commonRouter = Router();

commonRouter.get("/polls", getPolls);
commonRouter.get("/poll/create", createPoll);
commonRouter.get("/poll/:id", getPoll);

export default commonRouter;
