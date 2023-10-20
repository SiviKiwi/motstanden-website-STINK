import { InstrumentStat } from "common/interfaces";
import express, { Request, Response } from "express";

let router = express.Router()


router.post("/instrument-stats", 
    (req: Request, res: Response) => {
	const stat: InstrumentStat[] = req.body
	try {
	    
	} catch(err) {

	}
        res.end()
    } 
)

export default router;
