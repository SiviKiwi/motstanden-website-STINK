import express, { Request, Response } from "express";

let router = express.Router()


router.post("/instrument-stats", 
    (req: Request, res: Response) => {
	console.log("succ")
        res.end()
    } 
)

router.get("/instrument",
    (req, res) => {
	console.log("AAAAA")
        res.send("{}")
    }
)

export default router;
