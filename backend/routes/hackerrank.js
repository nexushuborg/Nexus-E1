import express from 'express';
const router = express.Router()
import * as cheerio from "cheerio";
import gfgProfile from "../middlewares/gfgProfileData.js";
import questionData from "../middlewares/gfgQuestionData.js"


router.post('/', async (req, res) => {

    const response = req.body;
    
    console.log({
        title: response.challenge_slug,
        code: response.code
    });

    res.json({
        title: response.challenge_slug,
        code: response.code
    });
})

export default router;