import { InstrumentStat } from "common/interfaces";
import { UserGroup } from "common/enums";
import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js";
import * as instrumentStatService from "../services/instrumentStat.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

let router = express.Router()


router.post("/instrument-stats/new", 
    (req: Request, res: Response) => {
	const stat: InstrumentStat = req.body
	try {
	    instrumentStatService.insertStat(req.body as InstrumentStat)
	} catch(err) {

	}
        res.end()
    } 
)

router.get("/instrument-stats?:limit",
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(instrumentStatService.getStats(limit))
    }
)

export default router;
