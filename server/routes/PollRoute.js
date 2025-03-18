import { Router } from "express";
import {
    addGroup,
    addModerator,
    addOption,
    addSubpoll,
    getGroups,
    getModerators,
    getOptions,
    getPoll,
    getResult,
    getSubpolls,
    giveVote,
    removeGroup,
    removeModerator,
    removeOption,
    removeSubpoll,
    update,
} from "../controllers/PollController.js";

const PollRouter = Router();

PollRouter.get("/:id", getPoll);
PollRouter.get("/:id/options", getOptions);
PollRouter.get("/:id/groups", getGroups);
PollRouter.get("/:id/add-moderator", addModerator);
PollRouter.get("/:id/remove-moderator", removeModerator);
PollRouter.post("/:id/add-option", addOption);
PollRouter.get("/:id/remove-option", removeOption);
PollRouter.post("/:id/add-group", addGroup);
PollRouter.get("/:id/remove-group", removeGroup);
PollRouter.get("/:id/result", getResult);
PollRouter.post("/:id/vote", giveVote);
PollRouter.post("/:id/update", update);
PollRouter.get("/:id/moderators", getModerators);
PollRouter.get("/:id/subpolls", getSubpolls);
PollRouter.get("/:id/remove-subpoll", removeSubpoll);
PollRouter.get("/:id/add-subpoll", addSubpoll);

export default PollRouter;
