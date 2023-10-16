import { isNullOrWhitespace, strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { songLyricService } from "../services/songLyric.js";
import { NewSongLyric } from "common/interfaces";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

const router = express.Router()

router.get("/song-lyric/simple-list", (req, res) => { 
    const lyrics = songLyricService.getSimpleList()
    res.send(lyrics)
})

router.get("/private/song-lyric/:id", 
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse song lyric id"
    }),
    AuthenticateUser(),
    sendSongLyric({ 
        isPublic: false 
    })
)

router.get("/public/song-lyric/:id",
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse song lyric id"
    }),
    sendSongLyric({ 
        isPublic: true 
    })
)

function sendSongLyric({ isPublic }: {isPublic: boolean} ) {
    return (req: Request, res: Response) => {
        const id = strToNumber(req.params.id) as number
        try {
            const privateLyric = songLyricService.get(id)
            
            const filteredLyric = isPublic ? {
                id: privateLyric.id,
                title: privateLyric.title,
                content: privateLyric.content
            } : privateLyric
            
            res.send(filteredLyric)
        } catch (err) {
            console.log(err)
            res.status(500).end()
        }
    }
}


router.post("/song-lyric/:id/update")   // TODO

router.post("/song-lyric/new",
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        const newLyric = tryCreateValidLyric(req.body) 

        if(!newLyric)
            return res.status(400).send("Could not parse song lyric data")

        try {
            const id = songLyricService.insertNew(newLyric, user.userId)
        } catch (err) {
            console.log(err)
            res.status(400).send("Bad data")
        }
        res.end()
    }
)

function tryCreateValidLyric(obj: unknown): NewSongLyric | undefined {
    if (typeof obj !== "object" || obj === null)
        return undefined

    const lyric = obj as NewSongLyric

    if (typeof lyric.title !== "string" || isNullOrWhitespace(lyric.title))
        return undefined

    if (typeof lyric.content !== "string" || isNullOrWhitespace(lyric.content))
        return undefined

    if( typeof lyric.isPopular !== "boolean")
        return undefined

    return {
        title: lyric.title.trim(),
        content: lyric.content.trim(),
        isPopular: lyric.isPopular
    }
}

export default router;